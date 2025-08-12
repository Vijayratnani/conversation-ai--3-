from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import List, Dict, Optional
import logging
import traceback
import asyncio
from fastapi import HTTPException
from sqlalchemy import (
    select,
    func,
    extract,
    cast,
    Float,
    String,
    lateral,
    Column,
    JSON,
    join,
    text,
    and_,
    true,
    inspect,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import selectinload
from sqlalchemy.orm.attributes import InstrumentedAttribute
from sqlalchemy.sql.expression import ColumnElement
from sqlalchemy.sql.type_api import TypeEngine
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from models.call import Call
from models.script_adherence import ScriptAdherence
from models.product_knowledge_score import ProductKnowledgeScore
from models.missed_script_point import MissedScriptPoint
from models.product import Product
from models.call_analysis_metadata import CallAnalysisMetadata

# from schemas.Dashboard.product_specific_agent_performance_schema import (
#     ProductKnowledgeLevelSchema,
#     AverageHandlingTimeSchema,
#     ScriptAdherenceSchema,
# )

logger = logging.getLogger(__name__)

async def get_product_knowledge_level(db: AsyncSession) -> List[Dict]:
    today = datetime.utcnow().date()
    first_day_this_month = today.replace(day=1)
    first_day_last_month = (first_day_this_month - timedelta(days=1)).replace(day=1)

    # Current month scores across all agents
    current_scores_stmt = (
        select(
            Product.name.label("product_name"),
            func.avg(ProductKnowledgeScore.score).label("avg_score"),
            func.string_agg(ProductKnowledgeScore.issues_noted, '; ').label("issues")
        )
        .join(Product, Product.product_id == ProductKnowledgeScore.product_id)
        .where(ProductKnowledgeScore.assessment_date == first_day_this_month)
        .group_by(Product.name)
    )
    current_scores = (await db.execute(current_scores_stmt)).all()

    # Last month scores across all agents
    last_scores_stmt = (
        select(
            Product.name.label("product_name"),
            func.avg(ProductKnowledgeScore.score).label("avg_score")
        )
        .join(Product, Product.product_id == ProductKnowledgeScore.product_id)
        .where(
            ProductKnowledgeScore.assessment_date == first_day_last_month
            #ProductKnowledgeScore.assessment_date < first_day_this_month
        )
        .group_by(Product.name)
    )
    last_scores = (await db.execute(last_scores_stmt)).all()
    last_score_map = {row.product_name: float(row.avg_score or 0) for row in last_scores}

    # Helper for color
    def score_to_color(score):
        if score >= 85:
            return "bg-green-500"
        elif score >= 70:
            return "bg-amber-500"
        else:
            return "bg-red-500"

    data = []

    for row in current_scores:
        product = row.product_name
        score = float(row.avg_score or 0)
        issues = row.issues or "No major issues"

        # Simulated content
        examples = [
            f"Example issue for {product} #1.",
            f"Example issue for {product} #2.",
        ]
        trainings = [
            { "title": f"{product} Masterclass", "link": "#" },
            { "title": f"Handling {product} FAQs", "link": "#" }
        ]
        steps = [
            f"Review {product} documentation.",
            f"Schedule 1:1 with a senior agent on {product}."
        ]

        # Trend logic
        last_score = last_score_map.get(product, 0)
        if last_score:
            change = round(score - last_score, 2)
            direction = "up" if change >= 0 else "down"
            trend = {
                "period": "last month",
                "change": f"{'+' if change >= 0 else ''}{change}%",
                "direction": direction
            }
        else:
            trend = {
                "period": "last month",
                "change": "N/A",
                "direction": "up"
            }

        data.append({
            "product": product,
            "score": round(score, 2),
            "issues": issues,
            "color": score_to_color(score),
            "specificExamples": examples,
            "recommendedTraining": trainings,
            "scoreTrend": trend,
            "actionableSteps": steps
        })

    return data

async def get_average_handling_time_by_product_type(db: AsyncSession) -> List[Dict]:
    try:
        today = datetime.now(timezone.utc)
        last_30_days_start = today - timedelta(days=30)
        prev_30_days_start = last_30_days_start - timedelta(days=30)

         # Correct lateral subquery for product_mentions
        product_elements_subq = (
            select(
                func.jsonb_array_elements(CallAnalysisMetadata.product_mentions).label("value"),
                CallAnalysisMetadata.call_id.label("call_id")
            )
            .where(CallAnalysisMetadata.product_mentions.isnot(None))
            .select_from(CallAnalysisMetadata)
            .lateral()
        )
        product_elements = aliased(product_elements_subq, name="product_elements")
        # ...existing code...

        product_name_expr = func.jsonb_extract_path_text(product_elements.c.value, 'product')

        # Query average duration for last 30 days
        stmt_current = (
            select(
                product_name_expr.label("product"),
                func.avg(cast(Call.duration_seconds, Float)).label("avg_duration"),
            )
            .join(CallAnalysisMetadata, Call.call_id == CallAnalysisMetadata.call_id)
            .join(product_elements, Call.call_id == product_elements.c.call_id)
            .where(
                and_(
                    CallAnalysisMetadata.product_mentions.isnot(None),
                    func.jsonb_typeof(CallAnalysisMetadata.product_mentions) == 'array',
                    Call.call_timestamp >= last_30_days_start,
                )
            )
            .group_by(product_name_expr)
        )

        # Query average duration for previous 30 days
        stmt_previous = (
            select(
                product_name_expr.label("product"),
                func.avg(cast(Call.duration_seconds, Float)).label("avg_duration"),
            )
            .join(CallAnalysisMetadata, Call.call_id == CallAnalysisMetadata.call_id)
            .join(product_elements, true())
            .where(
                and_(
                    CallAnalysisMetadata.product_mentions.isnot(None),
                    func.jsonb_typeof(CallAnalysisMetadata.product_mentions) == 'array',
                    Call.call_timestamp >= prev_30_days_start,
                    Call.call_timestamp < last_30_days_start,
                )
            )
            .group_by(product_name_expr)
        )

        current_results_raw = await db.execute(stmt_current)
        current_results_rows = current_results_raw.all()

        previous_results_raw = await db.execute(stmt_previous)
        previous_results_rows = previous_results_raw.all()

        # Create dict maps for quick lookup
        current_results = {row.product: row.avg_duration for row in current_results_rows}
        previous_results = {row.product: row.avg_duration for row in previous_results_rows}

        response = []

        for product, avg_seconds in current_results.items():
            if not avg_seconds or avg_seconds == 0:
                continue

            # Format avg duration in mm:ss
            total_seconds = int(avg_seconds)
            minutes = total_seconds // 60
            seconds = total_seconds % 60
            time_str = f"{minutes}:{seconds:02d}"

            prev_avg = previous_results.get(product)
            if prev_avg and prev_avg > 0:
                change = ((avg_seconds - prev_avg) / prev_avg) * 100
                trend = "up" if change > 0 else "down"
                percent = f"{abs(round(change))}%"
            else:
                trend = "down"
                percent = "0%"

            response.append({
                "product": product,
                "time": time_str,
                "trend": trend,
                "percent": percent
            })

        return response

    except Exception:
        # Re-raise for FastAPI to handle and log
        raise


async def get_script_adherence_by_product(db: AsyncSession) -> List[Dict]:
    """
    Fetch detailed script adherence data for selected products, combining
    database missed points with hardcoded drill-down details including
    key strengths, agent feedback, impacts, recommended updates and training focus.
    Missing examples in key missed points are hardcoded where needed.
    """
    PRODUCT_TO_ADHERENCE_ID = {
        "Credit Cards": "credit-cards-adherence",
        "Personal Loans": "personal-loans-adherence",
        "Savings Account": "savings-accounts-adherence",
        "Mortgages": "mortgages-adherence",
    }
    ALLOWED_ADHERENCE_IDS = set(PRODUCT_TO_ADHERENCE_ID.values())

    # Hardcoded common drill down details (except keyMissedPoints)
    COMMON_DRILLDOWN_DATA = {
        "credit-cards-adherence": {
            "keyStrengths": [
                {"point": "Greeting and call opening", "examples": ["Consistently polite and professional openings observed."]},
                {"point": "Security verification process", "examples": ["Agents follow protocol accurately."]},
            ],
            "commonAgentFeedback": [
                "Script for premium benefits is too long.",
                "Unsure how to handle questions about competitor card benefits.",
            ],
            "impactOfNonAdherence": [
                {"area": "Customer Understanding", "description": "Reduced clarity on product value.", "severity": "Medium"},
                {"area": "Compliance", "description": "Minor risk of non-compliance on specific disclosures.", "severity": "Low"},
                {"area": "Sales Opportunity", "description": "Potential missed cross-sell/upsell if benefits not clear.", "severity": "Medium"},
            ],
            "recommendedScriptUpdates": [
                "Create concise bullet points for premium card benefits.",
                "Add a section on how to politely redirect competitor comparisons.",
            ],
            "trainingFocusAreas": [
                "Role-playing benefit explanations for premium cards.",
                "Refresher on Reg Z disclosure requirements.",
            ],
        },
        "personal-loans-adherence": {
            "keyStrengths": [
                {"point": "Explaining loan application process steps."},
                {"point": "Empathy and active listening during eligibility discussions."},
            ],
            "commonAgentFeedback": [],
            "impactOfNonAdherence": [
                {"area": "Customer Trust", "description": "Erosion of trust if key terms are omitted.", "severity": "High"},
                {"area": "Complaints", "description": "Increased likelihood of formal complaints regarding fees/penalties.", "severity": "Medium"},
            ],
            "recommendedScriptUpdates": [
                "Add a mandatory checklist item for prepayment penalty disclosure.",
                "Use a fee summary table in the script for easy reference.",
            ],
            "trainingFocusAreas": [
                "Understanding and explaining loan T&Cs.",
                "Handling objections related to fees.",
            ],
        },
        "savings-accounts-adherence": {
            "keyStrengths": [
                {"point": "Clear explanation of account types and minimum balances."},
                {"point": "Accurate information on current interest rates."},
            ],
            "commonAgentFeedback": [
                "Script is straightforward and easy to follow.",
            ],
            "impactOfNonAdherence": [
                {"area": "Customer Engagement", "description": "Slightly lower engagement with digital tools if not highlighted.", "severity": "Low"},
            ],
            "recommendedScriptUpdates": [
                "Consider adding a soft prompt for online banking feature awareness."
            ],
            "trainingFocusAreas": [
                "Maintaining high standards, sharing best practices from top performers."
            ],
        },
        "mortgages-adherence": {
            "keyStrengths": [
                {"point": "Building rapport with potential borrowers."},
                {"point": "Gathering initial application information effectively."},
            ],
            "commonAgentFeedback": [],
            "impactOfNonAdherence": [
                {"area": "Compliance", "description": "High risk of RESPA violations.", "severity": "High"},
                {"area": "Customer Experience", "description": "Negative experience due to unexpected costs or confusion.", "severity": "High"},
                {"area": "Conversion Rate", "description": "Lower conversion from application to closing.", "severity": "Medium"},
            ],
            "recommendedScriptUpdates": [
                "Integrate a closing cost estimation tool/range directly into the script.",
                "Provide clear, simple language for explaining APR vs. interest rate.",
                "Add mandatory verbal confirmation for RESPA disclosures.",
            ],
            "trainingFocusAreas": [
                "Mortgage compliance (RESPA).",
                "Explaining complex financial terms simply.",
                "Managing customer expectations on costs.",
            ],
        },
    }

    # Hardcoded examples for missed points with missing 'examples' (add only for those points)
    HARDCODED_MISSED_POINT_EXAMPLES = {
        "credit-cards-adherence": {
            "Explaining travel insurance coverage details": [
                "Agent A: 'It has travel insurance.' (Too vague)",
                "Agent B: 'I think it covers lost luggage.' (Uncertain)",
            ],
            "Required compliance disclosure (Reg Z)": [
                "Forgot to state APR range clearly."
            ],
            # "Mentioning specific bonus point categories" has no examples by design
        },
        "personal-loans-adherence": {
            "Explaining prepayment penalty clause": [
                "Agent C: 'You can pay it off early, no problem.' (Incorrect/Incomplete)"
            ],
            # "Clearly stating all applicable fees (origination, late)" no examples provided
        },
        "savings-accounts-adherence": {
            # No examples needed, all missed points are minor and have no examples
        },
        "mortgages-adherence": {
            "Providing accurate range for closing costs": [
                "Agent D: 'Closing costs are usually a few thousand.' (Too vague)"
            ],
            # Other points have no examples
        },
    }

    INVALID_TOP_MISSED_AREAS = {"fast center left so population.", "n/a", "unknown", ""}

    def safe_float_parse(value) -> Optional[float]:
        try:
            return float(value)
        except (ValueError, TypeError):
            return None

    try:
        stmt = (
            select(ScriptAdherence)
            .options(
                selectinload(ScriptAdherence.product),
                selectinload(ScriptAdherence.missed_points),
            )
        )
        result = await db.execute(stmt)
        records = result.scalars().unique().all()

        response = []

        for record in records:
            product_name = record.product.name if record.product else None
            adherence_id = PRODUCT_TO_ADHERENCE_ID.get(product_name) if isinstance(product_name, str) else None
            if not adherence_id or adherence_id not in ALLOWED_ADHERENCE_IDS:
                continue

            adherence_score = 0
            try:
                val = record.score

                if val is None:
                    adherence_score = 0
                elif isinstance(val, Decimal):
                    adherence_score = int(val.to_integral_value())
                elif isinstance(val, (float, int)):
                    adherence_score = int(val)
                elif isinstance(val, (InstrumentedAttribute, ColumnElement)):
                    # Defensive fallback if static type checker or misuse
                    adherence_score = 0
                else:
                    adherence_score = int(float(val))
            except (ValueError, TypeError):
                adherence_score = 0


            trend_val = safe_float_parse(record.trend_from_previous)
            if trend_val is None:
                trend_direction = "stable"
                trend_change = "0% MoM"
                trend_color = "text-amber-500"
            else:
                if trend_val > 0:
                    trend_direction = "up"
                    trend_change = f"+{trend_val}% MoM"
                    trend_color = "text-green-500"
                elif trend_val < 0:
                    trend_direction = "down"
                    trend_change = f"{trend_val}% MoM"
                    trend_color = "text-red-500"
                else:
                    trend_direction = "stable"
                    trend_change = "0% MoM"
                    trend_color = "text-amber-500"

            top_missed_area = (record.top_missed_area or "").strip()
            if top_missed_area.lower() in INVALID_TOP_MISSED_AREAS:
                top_missed_area = ""

            # Special rule for mortgages top missed area if empty
            if adherence_id == "mortgages-adherence" and not top_missed_area:
                top_missed_area = "Rate comparison details and closing cost estimation"

            # Compose keyMissedPoints dynamically from DB missed points for this record
            missed_points_list = []
            for mp in record.missed_points:
                # point description normalization
                point = mp.point_description.strip()
                frequency_str = f"{mp.frequency}%" if mp.frequency is not None else "N/A"
                impact = mp.impact or ""
                # Fetch hardcoded examples if available, else empty list
                examples = HARDCODED_MISSED_POINT_EXAMPLES.get(adherence_id, {}).get(point, [])

                missed_points_list.append(
                    {
                        "point": point,
                        "frequency": frequency_str,
                        "impact": impact,
                        "examples": examples,
                    }
                )

            # Fall back if no missed points found in DB for some reason (optional)
            if not missed_points_list:
                # fallback to hardcoded empty missed points for that product
                missed_points_list = []

            # Attach other drill down details from hardcoded common data
            drilldown = {
                "keyMissedPoints": missed_points_list,
                **COMMON_DRILLDOWN_DATA[adherence_id],
            }

            response.append(
                {
                    "id": adherence_id,
                    "product": product_name,
                    "adherenceScore": adherence_score,
                    "trend": {
                        "direction": trend_direction,
                        "change": trend_change,
                        "color": trend_color,
                    },
                    "topMissedArea": top_missed_area,
                    "drillDownDetails": drilldown,
                }
            )

        return response

    except Exception as e:
        logger.error("Failed to get script adherence by product", exc_info=e)
        raise RuntimeError("Error fetching script adherence data") from e
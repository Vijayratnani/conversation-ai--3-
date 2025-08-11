from faker import Faker
from .seed_config import fake, NUM_CUSTOMERS  # Adjust NUM_CUSTOMERS or add relevant count if needed
from models.missed_script_point import MissedScriptPoint
from typing import List
import asyncio
import random

async def seed_missed_script_points(db, script_adherence_records: List) -> List[MissedScriptPoint]:
    """
    Seed MissedScriptPoint records linked to each ScriptAdherence record.
    
    Args:
        db: Async database session.
        script_adherence_records: List of ScriptAdherence ORM instances.

    Returns:
        List of created MissedScriptPoint ORM instances.
    """

    missed_points_data = {
        1: [  # Credit Cards
            {
                "point_description": "Explaining travel insurance coverage details",
                "frequency": 15,
                "impact": "Customer confusion, potential dissatisfaction if benefits misunderstood.",
            },
            {
                "point_description": "Mentioning specific bonus point categories",
                "frequency": 10,
                "impact": "Missed opportunity to highlight value, customer may not maximize rewards.",
            },
            {
                "point_description": "Required compliance disclosure (Reg Z)",
                "frequency": 3,
                "impact": "Compliance risk, potential fines.",
            },
        ],
        2: [  # Personal Loans
            {
                "point_description": "Explaining prepayment penalty clause",
                "frequency": 18,
                "impact": "Customer dissatisfaction if penalized unexpectedly.",
            },
            {
                "point_description": "Clearly stating all applicable fees (origination, late)",
                "frequency": 12,
                "impact": "Lack of transparency, potential complaints.",
            },
        ],
        3: [  # Savings Account
            {
                "point_description": "Proactively mentioning online banking features",
                "frequency": 5,
                "impact": "Minor missed opportunity to reinforce convenience.",
            },
        ],
        5: [  # Mortgages
            {
                "point_description": "Providing accurate range for closing costs",
                "frequency": 25,
                "impact": "Customer surprise at actual costs, potential for deal to fall through.",
            },
            {
                "point_description": "Explaining difference between APR and interest rate",
                "frequency": 20,
                "impact": "Customer confusion, difficulty comparing offers.",
            },
            {
                "point_description": "Required RESPA disclosures",
                "frequency": 8,
                "impact": "Significant compliance risk.",
            },
        ],
    }

    records = []

    try:
        for adherence_record in script_adherence_records:
            product_id = adherence_record.product_id
            adherence_id = adherence_record.adherence_id

            # Defensive skip if required values missing
            if not adherence_id or not product_id:
                continue

            points_for_product = missed_points_data.get(product_id, [])

            for mp in points_for_product:

                    #From here the database tables entry starts(please hardcode data in variable above this)
                    record = MissedScriptPoint(
                        adherence_id=adherence_id,
                        point_description=mp["point_description"],
                        frequency=mp["frequency"],
                        impact=mp["impact"],
                    )
                    records.append(record)

        db.add_all(records)
        await asyncio.sleep(0)
        return records

    except Exception as e:
        raise Exception(f"Error while seeding missed_script_points: {e}")
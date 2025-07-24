from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.call_analysis_metadata import CallAnalysisMetadata
from schemas.call_analysis import (
    CallAnalysisMetadataCreate,
    CallAnalysisMetadata as CallAnalysisMetadataSchema,
)
from .base import CRUDBase
from uuid import UUID


class CRUDCallAnalysisMetadata(
    CRUDBase[CallAnalysisMetadata, CallAnalysisMetadataCreate, CallAnalysisMetadataCreate]
):
    async def get_by_call_id(
        self, db: AsyncSession, call_id: UUID
    ) -> CallAnalysisMetadata | None:
        result = await db.execute(
            select(CallAnalysisMetadata).where(CallAnalysisMetadata.call_id == call_id)
        )
        return result.scalars().first()

    async def create_or_update(
        self, db: AsyncSession, call_id: UUID, obj_in: CallAnalysisMetadataCreate
    ) -> CallAnalysisMetadata:
        existing = await self.get_by_call_id(db, call_id)
        if existing:
            for field, value in obj_in.dict(exclude_unset=True).items():
                setattr(existing, field, value)
            await db.commit()
            await db.refresh(existing)
            return existing

        new_entry = CallAnalysisMetadata(**obj_in.dict())
        db.add(new_entry)
        await db.commit()
        await db.refresh(new_entry)
        return new_entry


# Instance to be imported elsewhere
call_analysis = CRUDCallAnalysisMetadata(CallAnalysisMetadata)

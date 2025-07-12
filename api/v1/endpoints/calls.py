from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import crud.crud_call as crud
from schemas.call import Call, CallCreate
from db.session import get_db

router = APIRouter()

@router.get("/", response_model=List[Call])
async def read_calls(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve all calls.
    """
    calls = await crud.call.get_multi(db, skip=skip, limit=limit)
    return calls

@router.post("/", response_model=Call, status_code=201)
async def create_call(
    *,
    db: AsyncSession = Depends(get_db),
    call_in: CallCreate,
):
    """
    Create a new call record.
    """
    call = await crud.call.create(db=db, obj_in=call_in)
    return call

@router.get("/{call_id}", response_model=Call)
async def read_call(
    *,
    db: AsyncSession = Depends(get_db),
    call_id: int,
):
    """
    Get a specific call by ID.
    """
    call = await crud.call.get(db=db, id=call_id)
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return call

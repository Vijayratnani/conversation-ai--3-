from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import TypeDecorator, text
from typing import Any

class Base(DeclarativeBase):
    """Base for all models."""
    pass

class JSONB_GENERIC(TypeDecorator):
    """
    A generic JSONB type that can be used across different database backends.
    For PostgreSQL, it uses the native JSONB type.
    """
    impl = JSONB
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(JSONB())
        else:
            from sqlalchemy import JSON
            return dialect.type_descriptor(JSON())

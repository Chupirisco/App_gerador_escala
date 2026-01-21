from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Local(Base):
    __tablename__ = "local"

    id_loc = Column(Integer, primary_key=True, index=True)
    nome_loc = Column(String(200), nullable=False)

    individuos = relationship(
        "Individuo",
        back_populates="local",
        cascade="all, delete"
    )

    escalas_dia = relationship(
    "EscalaDia",
    back_populates="local",
    cascade="all, delete-orphan"
)

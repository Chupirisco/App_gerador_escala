from sqlalchemy import Column, Integer, String
from app.database import Base
from sqlalchemy.orm import relationship

class Funcao(Base):
    __tablename__ = "funcao"

    id_fun = Column(Integer, primary_key=True, index=True)
    nome_fun = Column(String(200), nullable=False)
    nivel_fun = Column(String(20), nullable=False)

    escalas_dia = relationship(
    "EscalaDiaFuncao",
    back_populates="funcao",
    cascade="all, delete-orphan"
    )
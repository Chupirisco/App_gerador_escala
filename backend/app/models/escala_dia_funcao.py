from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.database import Base


class EscalaDiaFuncao(Base):
    __tablename__ = "escala_dia_funcao"

    id_edf = Column(Integer, primary_key=True, index=True)
    quantidade = Column(Integer, nullable=False)

    id_fun_fk = Column(
        Integer,
        ForeignKey("funcao.id_fun"),
        nullable=False
    )

    id_esd_fk = Column(
        Integer,
        ForeignKey("escala_dia.id_esd"),
        nullable=False
    )

    funcao = relationship(
        "Funcao",
        back_populates="escalas_dia"
    )

    escala_dia = relationship(
        "EscalaDia",
        back_populates="funcoes"
    )

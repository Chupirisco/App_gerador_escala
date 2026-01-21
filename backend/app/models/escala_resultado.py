from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.database import Base


class EscalaResultado(Base):
    __tablename__ = "escala_resultado"

    id_esr = Column(Integer, primary_key=True, index=True)

    id_esd_fk = Column(
        Integer,
        ForeignKey("escala_dia.id_esd"),
        nullable=False
    )

    id_fun_fk = Column(
        Integer,
        ForeignKey("funcao.id_fun"),
        nullable=False
    )

    id_ind_fk = Column(
        Integer,
        ForeignKey("individuo.id_ind"),
        nullable=True
    )

    escala_dia = relationship(
        "EscalaDia",
        back_populates="resultados"
    )

    funcao = relationship("Funcao")

    individuo = relationship("Individuo")

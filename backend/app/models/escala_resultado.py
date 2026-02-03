from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class EscalaResultado(Base):
    __tablename__ = "escala_resultado"

    id_esr = Column(Integer, primary_key=True, index=True)
    id_esd_fk = Column(Integer, ForeignKey("escala_dia.id_esd"))
    id_fun_fk = Column(Integer, ForeignKey("funcao.id_fun"))
    id_ind_fk = Column(Integer, ForeignKey("individuo.id_ind"), nullable=True)
    lote_escala_esr = Column(String(36), index=True)

    escala_dia = relationship("EscalaDia")
    funcao = relationship("Funcao")
    individuo = relationship("Individuo")

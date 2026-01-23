from sqlalchemy import Column, Date, ForeignKey, Integer, Time
from sqlalchemy.orm import relationship
from app.database import Base


class EscalaDia(Base):
    __tablename__ = "escala_dia"

    id_esd = Column(Integer, primary_key=True, index=True)
    data_esd = Column(Date)
    horario_esd = Column(Time)
    id_loc_fk = Column(Integer, ForeignKey("local.id_loc"))

    local = relationship("Local")
    funcoes = relationship(
        "EscalaDiaFuncao",
        back_populates="escala_dia",
        cascade="all, delete"
    )
    resultados = relationship(
        "EscalaResultado",
        back_populates="escala_dia",
        cascade="all, delete"
    )

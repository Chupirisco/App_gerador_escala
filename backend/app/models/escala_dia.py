from sqlalchemy import Column, Date, ForeignKey, Integer, Time
from sqlalchemy.orm import relationship
from app.database import Base


class EscalaDia(Base):
    __tablename__ = "escala_dia"

    id_esd = Column(Integer, primary_key=True, index=True)
    data_esd = Column(Date, nullable=False)
    horario_esd = Column(Time, nullable=False)

    id_loc_fk = Column(
        Integer,
        ForeignKey("local.id_loc"),
        nullable=False
    )

    local = relationship(
        "Local",
        back_populates="escalas_dia"
    )

    funcoes = relationship(
    "EscalaDiaFuncao",
    back_populates="escala_dia",
    cascade="all, delete-orphan"
    )

    resultados = relationship(
    "EscalaResultado",
    back_populates="escala_dia",
    cascade="all, delete-orphan"
)

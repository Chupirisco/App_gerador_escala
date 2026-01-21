from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Individuo(Base):
    __tablename__ = "individuo"

    id_ind = Column(Integer, primary_key=True, index=True)
    nome_ind = Column(String(200), nullable=False)
    status_ind = Column(String(20), nullable=False)
    nivel_ind = Column(String(20), nullable=False)

    id_loc_fk = Column(Integer, ForeignKey("local.id_loc"))

    local = relationship(
        "Local",
        back_populates="individuos"
    )

    indisponibilidades = relationship(
        "Indisponibilidade",
        back_populates="individuo",
        cascade="all, delete-orphan"
    )



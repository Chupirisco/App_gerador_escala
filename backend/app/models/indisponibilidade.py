from sqlalchemy import Column, Date, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.database import Base


class Indisponibilidade(Base):
    __tablename__ = "indisponibilidade"

    id_indp = Column(Integer, primary_key=True, index=True)
    data_indp = Column(Date, nullable=False)

    id_ind_fk = Column(Integer, ForeignKey("individuo.id_ind"))
    

    individuo = relationship(
        "Individuo",
        back_populates="indisponibilidades"
    )
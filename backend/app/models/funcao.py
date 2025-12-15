from sqlalchemy import Column, Integer, String
from app.database import Base

class Funcao(Base):
    __tablename__ = "funcao"

    id_fun = Column(Integer, primary_key=True, index=True)
    nome_fun = Column(String(200), nullable=False)

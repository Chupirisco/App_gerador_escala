from sqlalchemy import Column, Integer, String
from app.database import Base

class Local(Base):
    __tablename__ = "local"

    id_loc = Column(Integer, primary_key=True, index=True)
    nome_loc = Column(String(200), nullable=False)

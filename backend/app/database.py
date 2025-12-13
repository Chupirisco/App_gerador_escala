from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# carrega variáveis do .env
load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# engine = conexão com o banco
engine = create_engine(
    DATABASE_URL,
    echo=True  # mostra SQL no terminal
)

# sessão = canal de conversa com o banco
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# base para criar os models
Base = declarative_base()

# ✅ DEPENDÊNCIA DO FASTAPI (ESSENCIAL)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

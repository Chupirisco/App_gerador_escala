from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.gerador import gerar_escala_mes


router = APIRouter(
    prefix="/gerar-escala",
    tags=["Geração de Escala"]
)


@router.post("/{ano}/{mes}")
def gerar(ano: int, mes: int, db: Session = Depends(get_db)):
    gerar_escala_mes(db, mes, ano)
    return {"msg": "Escala gerada com sucesso"}

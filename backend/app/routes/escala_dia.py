from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.escala_dia import EscalaDia
from app.models.escala_dia_funcao import EscalaDiaFuncao
from app.models.local import Local
from app.schemas.escala_dia import EscalaDiaCreate
from app.schemas.escala_dia_funcao import EscalaDiaFuncaoCreate

from typing import List

router = APIRouter(
    prefix="/escala-dia",
    tags=["Escala Dia"]
)

# Novo schema para receber escala + funções
class EscalaDiaWithFuncoesCreate(EscalaDiaCreate):
    funcoes: List[EscalaDiaFuncaoCreate]



# CREATE
@router.post("/")
def criar_escala_dia(
    escala: EscalaDiaWithFuncoesCreate,
    db: Session = Depends(get_db)
):
    try:
        local = db.query(Local).filter(Local.id_loc == escala.id_loc_fk).first()
        if not local:
            raise HTTPException(status_code=400, detail="Local informado não existe")

        nova_escala = EscalaDia(
            data_esd=escala.data_esd,
            horario_esd=escala.horario_esd,
            id_loc_fk=escala.id_loc_fk
        )

        db.add(nova_escala)
        db.flush() 

        for funcao in escala.funcoes:
            db.add(
                EscalaDiaFuncao(
                    quantidade=funcao.quantidade,
                    id_fun_fk=funcao.id_fun_fk,
                    id_esd_fk=nova_escala.id_esd
                )
            )

        db.commit()
        return {"msg": "Sucesso"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

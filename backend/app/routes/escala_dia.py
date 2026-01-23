from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.escala_dia import EscalaDia
from app.models.escala_dia_funcao import EscalaDiaFuncao
from app.models.local import Local
from app.schemas.escala_dia import EscalaDiaCreateWithFuncoes
from app.schemas.escala_dia_funcao import EscalaDiaFuncaoCreate

from typing import List
from pydantic import BaseModel

router = APIRouter(
    prefix="/escala-dia",
    tags=["Escala Dia"]
)

# Novo schema para receber escala + funções
class EscalaDiaWithFuncoesCreate(EscalaDiaCreateWithFuncoes):
    funcoes: List[EscalaDiaFuncaoCreate]


# CREATE
@router.post("/")
def criar_escala_dia(
    escala: EscalaDiaWithFuncoesCreate,
    db: Session = Depends(get_db)
):
    # Verifica se o local existe
    local = db.query(Local).filter(Local.id_loc == escala.id_loc_fk).first()
    if not local:
        raise HTTPException(status_code=400, detail="Local informado não existe")

    # Cria a escala do dia
    nova_escala = EscalaDia(
        data_esd=escala.data_esd,
        horario_esd=escala.horario_esd,
        id_loc_fk=escala.id_loc_fk
    )

    db.add(nova_escala)
    db.commit()
    db.refresh(nova_escala)  # pega o id_esd gerado

    # Cria as funções da escala
    for funcao in escala.funcoes:
        nova_funcao = EscalaDiaFuncao(
            quantidade=funcao.quantidade,
            id_fun_fk=funcao.id_fun_fk,
            id_esd_fk=nova_escala.id_esd
        )
        db.add(nova_funcao)

    db.commit()  # salva todas as funções
    return {"msg": "Sucesso", "id_esd": nova_escala.id_esd}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.escala_dia_funcao import EscalaDiaFuncao
from app.models.funcao import Funcao
from app.models.escala_dia import EscalaDia
from app.schemas.escala_dia_funcao import (
    EscalaDiaFuncaoCreate,
    EscalaDiaFuncaoResponse
)


router = APIRouter(
    prefix="/escala-dia-funcao",
    tags=["Escala Dia Função"]
)

# CREATE
@router.post("/")
def criar_escala_dia_funcao(
    dados: EscalaDiaFuncaoCreate,
    db: Session = Depends(get_db)
):
    funcao = (
        db.query(Funcao)
        .filter(Funcao.id_fun == dados.id_fun_fk)
        .first()
    )

    if not funcao:
        raise HTTPException(
            status_code=400,
            detail="Função informada não existe"
        )

    escala_dia = (
        db.query(EscalaDia)
        .filter(EscalaDia.id_esd == dados.id_esd_fk)
        .first()
    )

    if not escala_dia:
        raise HTTPException(
            status_code=400,
            detail="Escala do dia informada não existe"
        )

    nova_config = EscalaDiaFuncao(
        quantidade=dados.quantidade,
        id_fun_fk=dados.id_fun_fk,
        id_esd_fk=dados.id_esd_fk
    )

    db.add(nova_config)
    db.commit()
    db.refresh(nova_config)

    return {"msg": "Sucesso"}

@router.get("/", response_model=list[EscalaDiaFuncaoResponse])
def listar_configuracoes(db: Session = Depends(get_db)):
    return db.query(EscalaDiaFuncao).all()

@router.get("/{id}", response_model=EscalaDiaFuncaoResponse)
def buscar_configuracao(id: int, db: Session = Depends(get_db)):
    cfg = (
        db.query(EscalaDiaFuncao)
        .filter(EscalaDiaFuncao.id_edf == id)
        .first()
    )

    if not cfg:
        raise HTTPException(
            status_code=404,
            detail="Configuração não encontrada"
        )

    return cfg

@router.delete("/{id}")
def deletar_configuracao(id: int, db: Session = Depends(get_db)):
    cfg = (
        db.query(EscalaDiaFuncao)
        .filter(EscalaDiaFuncao.id_edf == id)
        .first()
    )

    if not cfg:
        raise HTTPException(
            status_code=404,
            detail="Configuração não encontrada"
        )

    db.delete(cfg)
    db.commit()

    return {"msg": "Sucesso"}

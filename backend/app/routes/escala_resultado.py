from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.escala_resultado import EscalaResultado
from app.models.escala_dia import EscalaDia
from app.models.funcao import Funcao
from app.models.individuo import Individuo
from app.schemas.escala_resultado import (
    EscalaResultadoCreate,
    EscalaResultadoResponse
)


router = APIRouter(
    prefix="/escala-resultado",
    tags=["Escala Resultado"]
)

# CREATE
@router.post("/")
def criar_resultado(
    dados: EscalaResultadoCreate,
    db: Session = Depends(get_db)
):
    escala = db.query(EscalaDia).filter(
        EscalaDia.id_esd == dados.id_esd_fk
    ).first()

    if not escala:
        raise HTTPException(
            status_code=400,
            detail="Escala do dia não existe"
        )

    funcao = db.query(Funcao).filter(
        Funcao.id_fun == dados.id_fun_fk
    ).first()

    if not funcao:
        raise HTTPException(
            status_code=400,
            detail="Função informada não existe"
        )

    individuo = None
    if dados.id_ind_fk is not None:
        individuo = db.query(Individuo).filter(
            Individuo.id_ind == dados.id_ind_fk
        ).first()

        if not individuo:
            raise HTTPException(
                status_code=400,
                detail="Indivíduo informado não existe"
            )

    resultado = EscalaResultado(
        id_esd_fk=dados.id_esd_fk,
        id_fun_fk=dados.id_fun_fk,
        id_ind_fk=dados.id_ind_fk
    )

    db.add(resultado)
    db.commit()
    db.refresh(resultado)

    return {"msg": "Sucesso"}

@router.get("/", response_model=list[EscalaResultadoResponse])
def listar_resultados(db: Session = Depends(get_db)):
    resultados = db.query(EscalaResultado).all()

    return [
        {
            "id_esr": r.id_esr,
            "funcao": r.funcao.nome_fun,
            "individuo": r.individuo.nome_ind if r.individuo else None,
            "data": r.escala_dia.data_esd,
            "horario": r.escala_dia.horario_esd.strftime("%H:%M")
        }
        for r in resultados
    ]


@router.get("/{id}", response_model=EscalaResultadoResponse)
def buscar_resultado(id: int, db: Session = Depends(get_db)):
    res = db.query(EscalaResultado).filter(
        EscalaResultado.id_esr == id
    ).first()

    if not res:
        raise HTTPException(
            status_code=404,
            detail="Resultado não encontrado"
        )

    return res

@router.delete("/{id}")
def deletar_resultado(id: int, db: Session = Depends(get_db)):
    res = db.query(EscalaResultado).filter(
        EscalaResultado.id_esr == id
    ).first()

    if not res:
        raise HTTPException(
            status_code=404,
            detail="Resultado não encontrado"
        )

    db.delete(res)
    db.commit()

    return {"msg": "Sucesso"}

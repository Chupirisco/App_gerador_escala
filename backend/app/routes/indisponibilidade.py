from calendar import monthrange
from datetime import date
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.models.indisponibilidade import Indisponibilidade
from app.models.individuo import Individuo
from app.schemas.indisponibilidade import IndisponibilidadeBatchCreate, IndisponibilidadeCreate


router = APIRouter(
    prefix="/indisponibilidade",
    tags=["Indisponibilidade"]
)



# CREATE
@router.post("/")
def criar_indisponibilidade(
    indisp: IndisponibilidadeCreate,
    db: Session = Depends(get_db)
):
    if indisp.id_ind_fk is not None:
        indivi = (
            db.query(Individuo)
            .filter(Individuo.id_ind == indisp.id_ind_fk)
            .first()
        )

        if not indivi:
            raise HTTPException(
                status_code=400,
                detail="Indivíduo informado não existe"
            )

        nova_indp = Indisponibilidade(
            data_indp=indisp.data_indp,
            id_ind_fk=indisp.id_ind_fk
        )

        db.add(nova_indp)
        db.commit()
        db.refresh(nova_indp)

        return {"msg": "Sucesso"}

    return {"msg": "Falhou"}

# Create diferenciado
@router.post("/lote")
def sincronizar_indisponibilidade_lote(
    dados: IndisponibilidadeBatchCreate,
    db: Session = Depends(get_db)
):
    from calendar import monthrange

    _, ultimo_dia = monthrange(dados.ano, dados.mes)

    inicio = date(dados.ano, dados.mes, 1)
    fim = date(dados.ano, dados.mes, ultimo_dia)

    # Todas as indisponibilidades já salvas no mês
    existentes = (
        db.query(Indisponibilidade)
        .filter(
            Indisponibilidade.id_ind_fk == dados.id_ind_fk,
            Indisponibilidade.data_indp.between(inicio, fim)
        )
        .all()
    )

    existentes_por_dia = {i.data_indp.day: i for i in existentes}

    dias_recebidos = set(dados.dias)
    dias_existentes = set(existentes_por_dia.keys())

    
    dias_para_criar = dias_recebidos - dias_existentes
    
    dias_para_remover = dias_existentes - dias_recebidos

    # Remove
    for dia in dias_para_remover:
        db.delete(existentes_por_dia[dia])

    # Cria
    for dia in dias_para_criar:
        db.add(
            Indisponibilidade(
                id_ind_fk=dados.id_ind_fk,
                data_indp=date(dados.ano, dados.mes, dia)
            )
        )

    db.commit()

    return { "msg": "Sucesso" }


#read todos
@router.get("/")
def listar_indisponibilidades(db: Session = Depends(get_db)):
    return db.query(Indisponibilidade).all()

# read por id
@router.get("/{id}")
def buscar_indisponibilidade(id: int, db: Session = Depends(get_db)):
    indp = (
        db.query(Indisponibilidade)
        .filter(Indisponibilidade.id_indp == id)
        .first()
    )

    if not indp:
        raise HTTPException(
            status_code=404,
            detail="Indisponibilidade não encontrada"
        )

    return indp

# read diferentão
@router.get("/{id_ind}/mes")
def listar_indisponibilidades_mes(
    id_ind: int,
    ano: int,
    mes: int,
    db: Session = Depends(get_db)
):
    _, ultimo_dia = monthrange(ano, mes)

    inicio = date(ano, mes, 1)
    fim = date(ano, mes, ultimo_dia)

    registros = (
        db.query(Indisponibilidade)
        .filter(
            Indisponibilidade.id_ind_fk == id_ind,
            Indisponibilidade.data_indp.between(inicio, fim)
        )
        .all()
    )

    return {
        "id_ind_fk": id_ind,
        "ano": ano,
        "mes": mes,
        "dias": [r.data_indp.day for r in registros]
    }



# delete
@router.delete("/{id}")
def deletar_indisponibilidade(id: int, db: Session = Depends(get_db)):
    indp = (
        db.query(Indisponibilidade)
        .filter(Indisponibilidade.id_indp == id)
        .first()
    )

    if not indp:
        raise HTTPException(
            status_code=404,
            detail="Indisponibilidade não encontrada"
        )

    db.delete(indp)
    db.commit()

    return {"msg": "Sucesso"}

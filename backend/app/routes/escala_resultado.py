from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.escala_resultado import EscalaResultado
from app.models.escala_dia import EscalaDia
from app.models.funcao import Funcao
from app.models.individuo import Individuo
from app.schemas.escala_resultado import EscalaResultadoCreate, EscalaResultadoResponse


router = APIRouter(prefix="/escala-resultado", tags=["Escala Resultado"])


# mostra todas as gerações(lotes)
@router.get("/lotes")
def listar_lotes(db: Session = Depends(get_db)):
    lotes = (
        db.query(
            EscalaResultado.lote_escala_esr.label("lote"),
            func.year(EscalaDia.data_esd).label("ano"),
            func.month(EscalaDia.data_esd).label("mes"),
        )
        .join(EscalaDia)
        .group_by(
            EscalaResultado.lote_escala_esr,
            func.year(EscalaDia.data_esd),
            func.month(EscalaDia.data_esd),
        )
        .order_by(
            func.year(EscalaDia.data_esd).desc(),
            func.month(EscalaDia.data_esd).desc(),
        )
        .all()
    )

    return [{"lote": l.lote, "ano": l.ano, "mes": l.mes} for l in lotes]


# get que mostra as escalas de uma determinada geração(lote)
@router.get("/lote/{lote_escala}/dias")
def listar_dias_do_lote(lote_escala: str, db: Session = Depends(get_db)):

    dias = (
        db.query(EscalaDia.id_esd, EscalaDia.data_esd)
        .join(EscalaResultado)
        .filter(EscalaResultado.lote_escala_esr == lote_escala)
        .distinct()
        .order_by(EscalaDia.data_esd)
        .all()
    )

    return [{"id_esd": d.id_esd, "data": d.data_esd} for d in dias]


# get filtrado para mostrar o resultado de uma geração
@router.get("/lote/{lote_escala}/dia/{id_esd}")
def listar_detalhes_dia(lote_escala: str, id_esd: int, db: Session = Depends(get_db)):

    resultados = (
        db.query(EscalaResultado)
        .filter(
            EscalaResultado.lote_escala_esr == lote_escala,
            EscalaResultado.id_esd_fk == id_esd,
        )
        .all()
    )

    return [
        {
            "funcao": r.funcao.nome_fun,
            "individuo": r.individuo.nome_ind if r.individuo else None,
            "horario": r.escala_dia.horario_esd.strftime("%H:%M"),
        }
        for r in resultados
    ]


@router.delete("/{id}")
def deletar_resultado(id: int, db: Session = Depends(get_db)):
    res = db.query(EscalaResultado).filter(EscalaResultado.id_esr == id).first()

    if not res:
        raise HTTPException(status_code=404, detail="Resultado não encontrado")

    db.delete(res)
    db.commit()

    return {"msg": "Sucesso"}


@router.delete("/lotes/{lote}")
def deletar_resultado(lote: str, db: Session = Depends(get_db)):
    res = (
        db.query(EscalaResultado)
        .filter(EscalaResultado.lote_escala_esr == lote)
        .first()
    )

    if not res:
        raise HTTPException(status_code=404, detail="Resultado não encontrado")

    db.delete(res)
    db.commit()

    return {"msg": "Sucesso"}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.escala_resultado import EscalaResultado
from app.models.escala_dia import EscalaDia
from app.models.funcao import Funcao
from app.models.individuo import Individuo
from app.models.local import Local
from app.schemas.escala_resultado import EscalaResultadoCreate, EscalaResultadoResponse


router = APIRouter(prefix="/escala-resultado", tags=["Escala Resultado"])


# mostra todas as gerações(lotes)
@router.get("/lotes")
@router.get("/lotes")
def listar_lotes(db: Session = Depends(get_db)):
    lotes = (
        db.query(
            EscalaDia.lote_escala_esd.label("lote"),
            func.year(EscalaDia.data_esd).label("ano"),
            func.month(EscalaDia.data_esd).label("mes"),
        )
        .group_by(
            EscalaDia.lote_escala_esd,
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
@router.get("/lote/{lote}")
def get_escalas_por_lote(lote: str, db: Session = Depends(get_db)):

    registros = (
        db.query(
            EscalaDia.id_esd,
            EscalaDia.data_esd,
            EscalaDia.horario_esd,
            Local.nome_loc,
        )
        .join(EscalaResultado, EscalaResultado.id_esd_fk == EscalaDia.id_esd)
        .join(Local, EscalaDia.id_loc_fk == Local.id_loc)
        .filter(EscalaDia.lote_escala_esd == lote)
        .distinct(EscalaDia.id_esd)
        .order_by(EscalaDia.data_esd, EscalaDia.horario_esd)
        .all()
    )

    if not registros:
        raise HTTPException(status_code=404, detail="Lote não encontrado")

    return [
        {
            "id_esd": r.id_esd,
            "data": r.data_esd.strftime("%d/%m/%Y"),
            "horario": r.horario_esd,
            "local": r.nome_loc,
        }
        for r in registros
    ]


@router.get("/lote/{lote}/dia/{id_esd}")
def listar_detalhes_dia(lote: str, id_esd: int, db: Session = Depends(get_db)):

    resultados = (
        db.query(EscalaResultado)
        .join(EscalaDia, EscalaResultado.id_esd_fk == EscalaDia.id_esd)
        .join(Local, EscalaDia.id_loc_fk == Local.id_loc)
        .join(Funcao, EscalaResultado.id_fun_fk == Funcao.id_fun)
        .outerjoin(Individuo, EscalaResultado.id_ind_fk == Individuo.id_ind)
        .filter(
            EscalaDia.lote_escala_esd == lote,
            EscalaResultado.id_esd_fk == id_esd,
        )
        .all()
    )

    if not resultados:
        raise HTTPException(status_code=404, detail="Dia não encontrado")

    # pega o escala_dia a partir do primeiro resultado
    escala_dia = resultados[0].escala_dia

    return {
        "id_esd": escala_dia.id_esd,
        "data": escala_dia.data_esd.strftime("%d/%m/%Y"),
        "horario": escala_dia.horario_esd.strftime("%H:%M"),
        "local": escala_dia.local.nome_loc,
        "resultados": [
            {
                "funcao": r.funcao.nome_fun,
                "individuo": r.individuo.nome_ind if r.individuo else None,
            }
            for r in resultados
        ],
    }


@router.delete("/{id}")
def deletar_resultado(id: int, db: Session = Depends(get_db)):

    resultado = db.query(EscalaResultado).filter(EscalaResultado.id_esr == id).first()

    if not resultado:
        raise HTTPException(status_code=404, detail="Resultado não encontrado")

    id_esd = resultado.id_esd_fk  # 👈 pega o dia da escala vinculado

    escala_dia = db.query(EscalaDia).filter(EscalaDia.id_esd == id_esd).first()

    if not escala_dia:
        raise HTTPException(status_code=404, detail="EscalaDia não encontrado")

    # deletando o EscalaDia, o cascade remove:
    # escala_resultado e escala_dia_funcao
    db.delete(escala_dia)
    db.commit()

    return {"msg": "Escala e resultados excluídos com sucesso"}


@router.delete("/lotes/{lote}")
def deletar_lote(lote: str, db: Session = Depends(get_db)):

    total = (
        db.query(EscalaDia)
        .filter(EscalaDia.lote_escala_esd == lote)
        .delete(synchronize_session=False)
    )

    if total == 0:
        raise HTTPException(status_code=404, detail="Lote não encontrado")

    db.commit()
    return {"msg": "Sucesso"}

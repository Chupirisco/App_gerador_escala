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
            EscalaResultado.id_esr,
            EscalaDia.id_esd,
            EscalaDia.data_esd,
            EscalaDia.horario_esd,
            Local.nome_loc,
            Funcao.nome_fun,
            Funcao.nivel_fun,
            Individuo.nome_ind,
            Individuo.nivel_ind,
            Individuo.status_ind,
        )
        .join(EscalaDia, EscalaResultado.id_esd_fk == EscalaDia.id_esd)
        .join(Local, EscalaDia.id_loc_fk == Local.id_loc)
        .join(Funcao, EscalaResultado.id_fun_fk == Funcao.id_fun)
        .outerjoin(Individuo, EscalaResultado.id_ind_fk == Individuo.id_ind)
        .filter(EscalaDia.lote_escala_esd == lote)
        .order_by(EscalaDia.data_esd, EscalaDia.horario_esd)
        .all()
    )

    if not registros:
        raise HTTPException(status_code=404, detail="Lote não encontrado")

    return [
        {
            "id_esr": r.id_esr,
            "id_esd": r.id_esd,
            "data": r.data_esd,
            "horario": r.horario_esd,
            "local": r.nome_loc,
            "funcao": r.nome_fun,
            "nivel_funcao": r.nivel_fun,
            "pessoa": (
                {
                    "nome": r.nome_ind,
                    "nivel": r.nivel_ind,
                    "status": r.status_ind,
                }
                if r.nome_ind
                else None
            ),
        }
        for r in registros
    ]


# get filtrado para mostrar o resultado de uma geração
@router.get("/lote/{lote}/dia/{id_esd}")
def listar_detalhes_dia(lote: str, id_esd: int, db: Session = Depends(get_db)):

    resultados = (
        db.query(EscalaResultado)
        .join(EscalaDia)
        .filter(
            EscalaDia.lote_escala_esd == lote,
            EscalaResultado.id_esd_fk == id_esd,
        )
        .all()
    )

    if not resultados:
        raise HTTPException(status_code=404, detail="Dia não encontrado")

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

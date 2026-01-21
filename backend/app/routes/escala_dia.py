from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.escala_dia import EscalaDia
from app.models.local import Local
from app.schemas.escala_dia import EscalaDiaCreate, EscalaDiaResponse


router = APIRouter(
    prefix="/escala-dia",
    tags=["Escala Dia"]
)

# CREATE
@router.post("/")
def criar_escala_dia(
    escala: EscalaDiaCreate,
    db: Session = Depends(get_db)
):
    local = (
        db.query(Local)
        .filter(Local.id_loc == escala.id_loc_fk)
        .first()
    )

    if not local:
        raise HTTPException(
            status_code=400,
            detail="Local informado não existe"
        )

    nova_escala = EscalaDia(
        data_esd=escala.data_esd,
        horario_esd=escala.horario_esd,
        id_loc_fk=escala.id_loc_fk
    )

    db.add(nova_escala)
    db.commit()
    db.refresh(nova_escala)

    return {"msg": "Sucesso"}


# READ (todos)
@router.get("/", response_model=list[EscalaDiaResponse])
def listar_escalas_dia(db: Session = Depends(get_db)):
    return db.query(EscalaDia).all()


# READ (por id)
@router.get("/{id}", response_model=EscalaDiaResponse)
def buscar_escala_dia(id: int, db: Session = Depends(get_db)):
    escala = (
        db.query(EscalaDia)
        .filter(EscalaDia.id_esd == id)
        .first()
    )

    if not escala:
        raise HTTPException(
            status_code=404,
            detail="Escala do dia não encontrada"
        )

    return escala


# DELETE
@router.delete("/{id}")
def deletar_escala_dia(id: int, db: Session = Depends(get_db)):
    escala = (
        db.query(EscalaDia)
        .filter(EscalaDia.id_esd == id)
        .first()
    )

    if not escala:
        raise HTTPException(
            status_code=404,
            detail="Escala do dia não encontrada"
        )

    db.delete(escala)
    db.commit()

    return {"msg": "Sucesso"}

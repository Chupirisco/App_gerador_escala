from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.models.indisponibilidade import Indisponibilidade
from app.models.individuo import Individuo
from app.schemas.indisponibilidade import IndisponibilidadeCreate


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

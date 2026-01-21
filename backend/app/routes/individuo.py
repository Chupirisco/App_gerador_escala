from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.individuo import Individuo
from app.schemas.individuo import IndividuoCreate, IndividuoResponse
from app.models.local import Local


router = APIRouter(
    prefix="/individuo",
    tags=["Individuo"]
)

# CREATE
@router.post("/")
def criar_individuo(ind: IndividuoCreate, db: Session = Depends(get_db)):
    
    if ind.id_loc_fk is not None:
        local = db.query(Local).filter(Local.id_loc == ind.id_loc_fk).first()
        if not local:
            raise HTTPException(
                status_code=400,
                detail="Local informado não existe"
            )

        novo_ind = Individuo(
            nome_ind=ind.nome_ind,
            status_ind=ind.status_ind,
            nivel_ind=ind.nivel_ind,
            id_loc_fk=ind.id_loc_fk
        )

        db.add(novo_ind)
        db.commit()
        db.refresh(novo_ind)

        return {"msg": "Sucesso"}
    
    return {"msg": "Falhou"}

# READ (todos)
@router.get("/", response_model=list[IndividuoResponse])
def listar_individuos(db: Session = Depends(get_db)):
    return db.query(Individuo).all()

# READ (por id)
@router.get("/{id}", response_model=IndividuoResponse)
def buscar_individuo(id: int, db: Session = Depends(get_db)):
    ind = db.query(Individuo).filter(Individuo.id_ind == id).first()

    if not ind:
        raise HTTPException(status_code=404, detail="Indivíduo não encontrado")

    return ind

# UPDATE
@router.put("/{id}")
def atualizar_individuo(
    id: int,
    dados: IndividuoCreate,
    db: Session = Depends(get_db)
):
    ind = db.query(Individuo).filter(Individuo.id_ind == id).first()

    if not ind:
        raise HTTPException(status_code=404, detail="Indivíduo não encontrado")
    
    if dados.id_loc_fk is not None:
        local = db.query(Local).filter(Local.id_loc == dados.id_loc_fk).first()
        if not local:
            raise HTTPException(
                status_code=400,
                detail="Local informado não existe"
            )

    ind.nome_ind = dados.nome_ind
    ind.status_ind = dados.status_ind
    ind.nivel_ind = dados.nivel_ind
    ind.id_loc_fk = dados.id_loc_fk

    db.commit()
    db.refresh(ind)

    return {"msg": "Sucesso" }


# DELETE
@router.delete("/{id}")
def deletar_individuo(id: int, db: Session = Depends(get_db)):
    ind = db.query(Individuo).filter(Individuo.id_ind == id).first()

    if not ind:
        raise HTTPException(status_code=404, detail="Indivíduo não encontrado")

    db.delete(ind)
    db.commit()

    return {"msg": "Sucesso"}

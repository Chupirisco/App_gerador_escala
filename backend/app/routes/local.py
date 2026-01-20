from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.local import Local
from app.schemas.local import LocalCreate, LocalResponse

router = APIRouter(
    prefix="/local",
    tags=["Local"]
)

# CREATE
@router.post("/")
def criar_local(local: LocalCreate, db: Session = Depends(get_db)):
    novo_local = Local(nome_loc=local.nome_loc)
    db.add(novo_local)
    db.commit()
    db.refresh(novo_local)
    return {"msg": "Sucesso"}

# READ (todos)
@router.get("/", response_model=list[LocalResponse])
def listar_locais(db: Session = Depends(get_db)):
    return db.query(Local).all()

# READ (por id)
@router.get("/{id}", response_model=LocalResponse)
def buscar_local(id: int, db: Session = Depends(get_db)):
    local = db.query(Local).filter(Local.id_loc == id).first()
    if not local:
        raise HTTPException(status_code=404, detail="Local não encontrado")
    return local

# DELETE
@router.delete("/{id}")
def deletar_local(id: int, db: Session = Depends(get_db)):
    local = db.query(Local).filter(Local.id_loc == id).first()
    if not local:
        raise HTTPException(status_code=404, detail="Local não encontrado")

    db.delete(local)
    db.commit()
    return {"msg": "Sucesso"}


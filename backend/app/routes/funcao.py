from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.funcao import Funcao
from app.schemas.funcao import FuncaoCreate, FuncaoResponse

router = APIRouter(
    prefix="/funcao",
    tags=["Função"]
)

# CREATE
@router.post("/")
def criar_funcao(funcao: FuncaoCreate, db: Session = Depends(get_db)):
    nova_funcao = Funcao(nome_fun=funcao.nome_fun)
    db.add(nova_funcao)
    db.commit()
    db.refresh(nova_funcao)
    return {"msg": "Sucesso"}


# READ (todos)
@router.get("/", response_model=list[FuncaoResponse])
def listar_funcao(db: Session = Depends(get_db)):
    return db.query(Funcao).all()


# READ (por id)
@router.get("/{id}", response_model=FuncaoResponse)
def buscar_funcao(id: int, db: Session = Depends(get_db)):
    funcao = db.query(Funcao).filter(Funcao.id_fun == id).first()
    if not funcao:
        raise HTTPException(status_code=404, detail="Função não encontrada")
    return funcao


# UPDATE
@router.put("/{id}", response_model=FuncaoResponse)
def atuzalizar_funcao(id: int, dados: FuncaoCreate, db: Session = Depends(get_db)):
    funcao = db.query(Funcao).filter(Funcao.id_fun == id).first()
    if not funcao:
        raise HTTPException(status_code=404, detail="Função não encontrada")

    funcao.nome_fun = dados.nome_fun
    
    db.commit()
    db.refresh(funcao)

    return funcao


# DELETE
@router.delete("/{id}")
def deletar_funcao(id: int, db: Session = Depends(get_db)):
    funcao = db.query(Funcao).filter(Funcao.id_fun == id).first()
    if not funcao:
        raise HTTPException(status_code=404, detail="Função não encontrada")
    
    db.delete(funcao)
    db.commit()
    return {"msg": "Função deletada"}

from fastapi import FastAPI
from app.database import engine
from app import models
from app.routes import local, funcao, individuo

app = FastAPI()

models.Local.metadata.create_all(bind=engine)
models.Individuo.metadata.create_all(bind=engine)
models.Funcao.metadata.create_all(bind=engine)

app.include_router(local.router)
app.include_router(funcao.router)
app.include_router(individuo.router)

@app.get("/")
def root():
    return {"msg": "API rodando"}
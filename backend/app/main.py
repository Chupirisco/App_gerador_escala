from fastapi import FastAPI
from app.routes import local, funcao, individuo
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(local.router)
app.include_router(funcao.router)
app.include_router(individuo.router)

@app.get("/")
def root():
    return {"msg": "API rodando"}
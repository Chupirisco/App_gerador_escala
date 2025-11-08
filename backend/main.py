from fastapi import FastAPI
from pydantic import BaseModel
from services.escala_generator import gerar_escala

app = FastAPI()

class DadosEntrada(BaseModel):
    mes: str
    pessoas: list
    funcoes: list

@app.post("/gerar-escala")
def gerar(dados: DadosEntrada):
    resultado = gerar_escala(dados)
    return {"escala": resultado}
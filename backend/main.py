from fastapi import FastAPI
from pydantic import BaseModel
from services.escala_gerador import gerar_escala

app = FastAPI()

class DadosEntrada(BaseModel):
    mes: str
    plantoes: list
    individuos: dict

@app.post("/gerar-escala")
def gerar(dados: DadosEntrada):
    resultado = gerar_escala(dados.dict())
    return resultado
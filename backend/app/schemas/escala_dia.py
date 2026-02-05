from datetime import date, time
from typing import List
from pydantic import BaseModel

from app.schemas.escala_dia_funcao import EscalaDiaFuncaoBase


# Schema já existente
class EscalaDiaCreate(BaseModel):
    data_esd: date
    horario_esd: time
    id_loc_fk: int


# Novo schema para receber junto com a escala
class EscalaDiaCreateWithFuncoes(BaseModel):
    data_esd: date
    horario_esd: time
    id_loc_fk: int
    funcoes: List[EscalaDiaFuncaoBase]

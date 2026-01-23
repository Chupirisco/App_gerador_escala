from datetime import date, time
from typing import List
from pydantic import BaseModel

# Schema já existente
class EscalaDiaFuncaoCreate(BaseModel):
    quantidade: int
    id_fun_fk: int
    id_esd_fk: int  # no momento de criar, ainda não temos o id_esd, vamos ignorar no front

# Novo schema para receber junto com a escala
class EscalaDiaCreateWithFuncoes(BaseModel):
    data_esd: date
    horario_esd: time
    id_loc_fk: int
    funcoes: List[EscalaDiaFuncaoCreate]

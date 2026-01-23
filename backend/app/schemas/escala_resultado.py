from datetime import date
from typing import Optional
from pydantic import BaseModel


class EscalaResultadoBase(BaseModel):
    id_esd_fk: int
    id_fun_fk: int
    id_ind_fk: Optional[int] = None


class EscalaResultadoCreate(EscalaResultadoBase):
    pass


class EscalaResultadoResponse(BaseModel):
    id_esr: int

    funcao: str
    individuo: str | None
    data: date
    horario: str

    class Config:
        from_attributes = True

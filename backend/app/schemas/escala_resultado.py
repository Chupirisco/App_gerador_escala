from typing import Optional
from pydantic import BaseModel


class EscalaResultadoBase(BaseModel):
    id_esd_fk: int
    id_fun_fk: int
    id_ind_fk: Optional[int] = None


class EscalaResultadoCreate(EscalaResultadoBase):
    pass


class EscalaResultadoResponse(EscalaResultadoBase):
    id_esr: int

    class Config:
        from_attributes = True

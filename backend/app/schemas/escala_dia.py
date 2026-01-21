from datetime import date, time
from pydantic import BaseModel


class EscalaDiaBase(BaseModel):
    data_esd: date
    horario_esd: time
    id_loc_fk: int


class EscalaDiaCreate(EscalaDiaBase):
    pass


class EscalaDiaResponse(EscalaDiaBase):
    id_esd: int

    class Config:
        from_attributes = True

from datetime import date
from typing import Optional
from pydantic import BaseModel


class IndisponibilidadeBase(BaseModel):
    data_indp: date
    id_ind_fk: int

class IndisponibilidadeCreate(IndisponibilidadeBase):
    pass

class IndisponibilidadeResponse(IndisponibilidadeBase):
    id_indp: int

    class Config:
        from_attributes = True


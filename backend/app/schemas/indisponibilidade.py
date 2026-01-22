from datetime import date
from typing import List

from pydantic import BaseModel, Field


class IndisponibilidadeBase(BaseModel):
    data_indp: date
    id_ind_fk: int


class IndisponibilidadeBatchCreate(BaseModel):
    id_ind_fk: int
    ano: int = Field(..., ge=2000)
    mes: int = Field(..., ge=1, le=12)
    dias: List[int] = Field(..., min_items=0)

class IndisponibilidadeCreate(IndisponibilidadeBase):
    pass

class IndisponibilidadeResponse(IndisponibilidadeBase):
    id_indp: int

    class Config:
        from_attributes = True


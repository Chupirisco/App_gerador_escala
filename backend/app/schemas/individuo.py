from pydantic import BaseModel
from typing import Optional


class IndividuoBase(BaseModel):    
    nome_ind: str
    status_ind: str
    nivel_ind: str
    id_loc_fk: int
    


class IndividuoCreate(IndividuoBase):
    pass


class IndividuoResponse(IndividuoBase):
    id_ind: int

    class Config:
        from_attributes = True

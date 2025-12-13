from pydantic import BaseModel
from typing import Optional
from app.schemas.local import LocalResponse

class IndividuoBase(BaseModel):
    nome_ind: str
    status_ind: str
    id_loc_fk: Optional[int] = None


class IndividuoCreate(IndividuoBase):
    pass


class IndividuoResponse(IndividuoBase):
    id_ind: int
    local: Optional[LocalResponse]

    class Config:
        from_attributes = True

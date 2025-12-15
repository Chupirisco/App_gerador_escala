from pydantic import BaseModel

class LocalBase(BaseModel):
    nome_loc: str


class LocalCreate(LocalBase):
    pass


class LocalResponse(LocalBase):
    id_loc: int

    class Config:
        from_attributes = True

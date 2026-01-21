from pydantic import BaseModel

class FuncaoBase(BaseModel):
    nome_fun: str
    nivel_fun: str

class FuncaoCreate(FuncaoBase):
    pass

class FuncaoResponse(FuncaoBase):
    id_fun: int

    class Config:
        from_attributes = True

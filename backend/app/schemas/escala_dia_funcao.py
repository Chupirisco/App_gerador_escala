from pydantic import BaseModel


class EscalaDiaFuncaoBase(BaseModel):
    quantidade: int
    id_fun_fk: int
    id_esd_fk: int


class EscalaDiaFuncaoCreate(EscalaDiaFuncaoBase):
    pass


class EscalaDiaFuncaoResponse(EscalaDiaFuncaoBase):
    id_edf: int

    class Config:
        from_attributes = True

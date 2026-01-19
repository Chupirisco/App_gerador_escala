export default function CadastrarLocal(){
    return (
        <div className="w-100 h-auto d-flex align-items-center flex-column my-5">
            <h1>Cadastrar Individuos</h1>
            <div className="card shadow-sm w-75 p-3 mt-5">
                <form className="row align-items-end g-2" >
                    <div className="col-md-15">
                        <label className="form-label">Nome</label>
                         <input type="text" placeholder="Nome do local" className="form-control"/>
                    </div>                  

                    {/* botões */}
                    <button type="submit" className="btn btn-outline-warning text-black col-md-1 mx-2">Cancelar</button>
                    <button type="submit" className="btn btn-primary col-md-1 mx-2">Cadastrar</button>
                </form>
            </div>           
        </div>
    );
}
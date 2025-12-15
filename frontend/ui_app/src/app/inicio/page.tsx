export default function Inicio() {
  return (
    <div className="d-flex w-100 h-100 flex-column">
      <div className="container text-center h-50 d-flex align-items-center">
        <div className="row w-100">
          <div className="col-12 col-md-4">
               <button className="btn btn-light w-100 shadow-sm hover-shadow">Individuos Cadastrados</button>
          </div>
          <div className="col-12 col-md-4">
               <button className="btn btn-light w-100 shadow-sm hover-shadow">Localidades Cadastradas</button>
          </div>
          <div className="col-12 col-md-4">
               <button className="btn btn-light w-100 shadow-sm hover-shadow">Funções Cadastradas</button>
          </div>                 
        </div>
      </div>    
      <div>
        <h1>serve</h1>
      </div>
    </div>
  );
}

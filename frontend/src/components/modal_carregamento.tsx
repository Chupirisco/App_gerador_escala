export default function ModalCarregamento() {
  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content d-flex justify-content-center align-items-center text-center"
          style={{ minHeight: "200px" }}
        >
          <div>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="mt-3 mb-0">Gerando escala...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

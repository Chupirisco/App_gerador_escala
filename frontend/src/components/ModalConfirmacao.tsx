"use client";

type ModalConfirmacaoProps = {
  mensagem: string;
  onConfirmar: () => void;
  onCancelar: () => void;
};

export default function ModalConfirmacao({
  mensagem,
  onConfirmar,
  onCancelar,
}: ModalConfirmacaoProps) {
  return (
    <>
      {/* BACKDROP */}
      <div className="modal-backdrop fade show"></div>

      {/* MODAL */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">Confirmação</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onCancelar}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <p className="mb-0">{mensagem}</p>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                className="btn btn-outline-secondary"
                onClick={onCancelar}
              >
                Cancelar
              </button>

              <button
                className="btn btn-danger"
                onClick={() => {
                  onConfirmar();
                  onCancelar();
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

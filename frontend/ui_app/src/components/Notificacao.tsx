"use client";
import { useEffect } from "react";

type NotificacaoProps = {
  mensagem: string;
  type: string;
  duracao?: number;
  onClose: () => void;
};

export default function Notificacao({
  mensagem,
  type = "sucesso",
  duracao = 5000,
  onClose,
}: NotificacaoProps) {
  useEffect(() => {
    const temporizador = setTimeout(onClose, duracao);
    return () => clearTimeout(temporizador);
  }, [duracao, onClose]);

  const bgColor = {
    sucesso: "alert-success",
    erro: "alert-danger",
    info: "alert-info",
  }[type];

  return (
    <div
      className={`${bgColor} alert alert-dismissible fade show shadow`}
      role="alert"
    >
      {mensagem}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );
}

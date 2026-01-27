export function verificarNivel(exp: string) {
  switch (exp) {
    case "experiente": {
      return "Experiente";
    }

    case "intermediario": {
      return "Intermediário";
    }

    case "novato": {
      return "Novato";
    }

    default: {
      return "Erro";
    }
  }
}

export function verificarStatus(status: string) {
  switch (status) {
    case "ativo": {
      return "bg-success";
    }

    case "inativo": {
      return "bg-secondary";
    }

    default: {
      return "bg-warning";
    }
  }
}

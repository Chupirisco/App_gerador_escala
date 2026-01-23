import random
from datetime import timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.individuo import Individuo
from app.models.indisponibilidade import Indisponibilidade
from app.models.escala_dia import EscalaDia
from app.models.escala_dia_funcao import EscalaDiaFuncao
from app.models.escala_resultado import EscalaResultado

# lista de funções e quem pode exercelas
ORDEM_NIVEL = {
    "novato": 1,
    "intermediario": 2,
    "cerimoniario": 3
}

def pode_exercer(individuo, funcao) -> bool:
    """
    Retorna True se o nível do indivíduo é suficiente
    para o nível mínimo exigido pela função
    """
    return (
        ORDEM_NIVEL.get(individuo.nivel_ind, 0)
        >=
        ORDEM_NIVEL.get(funcao.nivel_fun, 0)
    )


# método inicial, ele chama os outros
def gerar_escala_mes(
    db: Session,
    mes: int,
    ano: int
):
    # buscar todas as escalas do mês
    escalas = db.query(EscalaDia).filter(
        func.month(EscalaDia.data_esd) == mes,
        func.year(EscalaDia.data_esd) == ano
    ).all()

    for escala in escalas:
        gerar_escala_dia(db, escala)

    db.commit()

def candidatos_por_prioridade(
    db: Session,
    cfg: EscalaDiaFuncao,
    data_atual,
    data_anterior,
    escalados_hoje: set
):
    individuos = db.query(Individuo).filter(
        Individuo.status_ind == "ativo"
    ).all()

    candidatos = []

    nivel_fun = ORDEM_NIVEL.get(cfg.funcao.nivel_fun, 0)

    for ind in individuos:
        if ind.id_ind in escalados_hoje:
            continue

        # indisponível
        if db.query(Indisponibilidade).filter(
            Indisponibilidade.id_ind_fk == ind.id_ind,
            Indisponibilidade.data_indp == data_atual
        ).first():
            continue

        # ontem
        if db.query(EscalaResultado).join(EscalaDia).filter(
            EscalaResultado.id_ind_fk == ind.id_ind,
            EscalaDia.data_esd == data_anterior
        ).first():
            continue

        nivel_ind = ORDEM_NIVEL.get(ind.nivel_ind, 0)

        # nunca abaixo do nível da função
        if nivel_ind < nivel_fun:
            continue

        # prioridade: quanto mais próximo do nível da função, melhor
        prioridade = nivel_ind - nivel_fun

        candidatos.append((ind, prioridade))

    # ordena por prioridade (0 = ideal, 1 = acima, 2 = bem acima...)
    candidatos.sort(key=lambda x: x[1])

    return candidatos


# parte que faz as verificações do dia
def gerar_escala_dia(db: Session, escala: EscalaDia):
    data_atual = escala.data_esd
    data_anterior = data_atual - timedelta(days=1)

    configuracoes = (
        db.query(EscalaDiaFuncao)
        .filter(EscalaDiaFuncao.id_esd_fk == escala.id_esd)
        .all()
    )

    escalados_hoje = set()

    for cfg in configuracoes:
        for _ in range(cfg.quantidade):
            candidato = escolher_individuo(
                db,
                cfg,
                data_atual,
                data_anterior,
                escalados_hoje
            )

            resultado = EscalaResultado(
                id_esd_fk=escala.id_esd,
                id_fun_fk=cfg.id_fun_fk,
                id_ind_fk=candidato.id_ind if candidato else None
            )

            if candidato:
                escalados_hoje.add(candidato.id_ind)

            db.add(resultado)

#distribui os individuos nas funções disponiveis para aquele dia
def escolher_individuo(
    db: Session,
    cfg: EscalaDiaFuncao,
    data_atual,
    data_anterior,
    escalados_hoje: set
):
    candidatos = candidatos_por_prioridade(
        db,
        cfg,
        data_atual,
        data_anterior,
        escalados_hoje
    )

    if not candidatos:
        return None

    # pega apenas os de maior prioridade (menor diferença)
    melhor_prioridade = candidatos[0][1]
    mais_adequados = [
        ind for ind, p in candidatos if p == melhor_prioridade
    ]

    # justiça mensal (o que você já fazia)
    contagem = []
    for ind in mais_adequados:
        qtd = db.query(EscalaResultado).join(EscalaDia).filter(
            EscalaResultado.id_ind_fk == ind.id_ind,
            func.month(EscalaDia.data_esd) == data_atual.month
        ).count()

        contagem.append((ind, qtd))

    menor = min(qtd for _, qtd in contagem)
    menos_serviram = [ind for ind, qtd in contagem if qtd == menor]

    return random.choice(menos_serviram)

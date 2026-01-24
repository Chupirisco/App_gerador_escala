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
    # pega todos os indivíduos ativos
    individuos = db.query(Individuo).filter(
        Individuo.status_ind == "ativo"
    ).all()

    pontuacoes = []

    nivel_fun = ORDEM_NIVEL.get(cfg.funcao.nivel_fun, 0)

    for ind in individuos:
        # já escalado hoje
        if ind.id_ind in escalados_hoje:
            continue

        # indisponível no dia
        if db.query(Indisponibilidade).filter(
            Indisponibilidade.id_ind_fk == ind.id_ind,
            Indisponibilidade.data_indp == data_atual
        ).first():
            continue

        # já escalado ontem
        if db.query(EscalaResultado).join(EscalaDia).filter(
            EscalaResultado.id_ind_fk == ind.id_ind,
            EscalaDia.data_esd == data_anterior
        ).first():
            continue

        # nível insuficiente
        nivel_ind = ORDEM_NIVEL.get(ind.nivel_ind, 0)
        if nivel_ind < nivel_fun:
            continue

        # quantas vezes serviu no mês
        qtd_mes = db.query(EscalaResultado).join(EscalaDia).filter(
            EscalaResultado.id_ind_fk == ind.id_ind,
            func.month(EscalaDia.data_esd) == data_atual.month,
            func.year(EscalaDia.data_esd) == data_atual.year
        ).count()

        # última vez que serviu
        ultima = db.query(EscalaDia.data_esd).join(EscalaResultado).filter(
            EscalaResultado.id_ind_fk == ind.id_ind,
            EscalaDia.data_esd < data_atual
        ).order_by(EscalaDia.data_esd.desc()).first()

        dias_desde = (data_atual - ultima[0]).days if ultima else 999

        # score de justiça (quanto menor, melhor)
        score = (qtd_mes * 10) - dias_desde

        pontuacoes.append((ind, score))

    if not pontuacoes:
        return None

    # pega apenas os com menor score
    menor_score = min(score for _, score in pontuacoes)
    mais_justos = [ind for ind, score in pontuacoes if score == menor_score]

    # escolhe aleatoriamente entre os mais justos
    return random.choice(mais_justos)



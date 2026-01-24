import random
from datetime import timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.individuo import Individuo
from app.models.indisponibilidade import Indisponibilidade
from app.models.escala_dia import EscalaDia
from app.models.escala_dia_funcao import EscalaDiaFuncao
from app.models.escala_resultado import EscalaResultado

# ====================
# Níveis padronizados
# ====================
# novato < intermediario < experiente
NIVEL_PADRAO = {
    "novato": 1,
    "intermediario": 2,
    "experiente": 3
}

def pode_exercer(individuo, funcao) -> bool:
    """Verifica se o indivíduo possui nível suficiente para a função"""
    return NIVEL_PADRAO.get(individuo.nivel_ind, 0) >= NIVEL_PADRAO.get(funcao.nivel_fun, 0)

# ====================
# Geração da escala do mês
# ====================
def gerar_escala_mes(db: Session, mes: int, ano: int):
    """Percorre todas as escalas do mês e gera cada dia"""
    escalas = db.query(EscalaDia).filter(
        func.month(EscalaDia.data_esd) == mes,
        func.year(EscalaDia.data_esd) == ano
    ).all()

    for escala in escalas:
        gerar_escala_dia(db, escala)

    db.commit()

# ====================
# Geração da escala de um dia
# ====================
def gerar_escala_dia(db: Session, escala: EscalaDia):
    """Gera os indivíduos para todas as funções de um dia"""
    data_atual = escala.data_esd
    data_anterior = data_atual - timedelta(days=1)

    configuracoes = db.query(EscalaDiaFuncao).filter(
        EscalaDiaFuncao.id_esd_fk == escala.id_esd
    ).all()

    # Controla quem já foi escalado hoje para evitar duplicidade
    escalados_hoje = set()

    for cfg in configuracoes:
        for _ in range(cfg.quantidade):
            candidato = escolher_individuo(db, cfg, data_atual, data_anterior, escalados_hoje)

            resultado = EscalaResultado(
                id_esd_fk=escala.id_esd,
                id_fun_fk=cfg.id_fun_fk,
                id_ind_fk=candidato.id_ind if candidato else None
            )

            if candidato:
                escalados_hoje.add(candidato.id_ind)

            db.add(resultado)

# ====================
# Escolher indivíduo para uma função
# ====================
def escolher_individuo(
    db: Session,
    cfg: EscalaDiaFuncao,
    data_atual,
    data_anterior,
    escalados_hoje: set
):
    """Seleciona o indivíduo mais justo para a função do dia"""
    # Todos os ativos
    individuos = db.query(Individuo).filter(Individuo.status_ind == "ativo").all()
    candidatos = []

    nivel_fun = NIVEL_PADRAO.get(cfg.funcao.nivel_fun, 0)

    # Avalia cada indivíduo
    for ind in individuos:
        nivel_ind = NIVEL_PADRAO.get(ind.nivel_ind, 0)

        # Filtragens iniciais
        if ind.id_ind in escalados_hoje:
            continue  # já escalado hoje
        if nivel_ind < nivel_fun:
            continue  # nível insuficiente
        if db.query(Indisponibilidade).filter(
            Indisponibilidade.id_ind_fk == ind.id_ind,
            Indisponibilidade.data_indp == data_atual
        ).first():
            continue  # indisponível
        if db.query(EscalaResultado).join(EscalaDia).filter(
            EscalaResultado.id_ind_fk == ind.id_ind,
            EscalaDia.data_esd == data_anterior
        ).first():
            continue  # já serviu ontem

        # ====================
        # Score de justiça
        # ====================
        # Quantas vezes serviu no mês
        qtd_mes = db.query(EscalaResultado).join(EscalaDia).filter(
            EscalaResultado.id_ind_fk == ind.id_ind,
            func.month(EscalaDia.data_esd) == data_atual.month,
            func.year(EscalaDia.data_esd) == data_atual.year
        ).count()

        # Dias desde última escala
        ultima = db.query(EscalaDia.data_esd).join(EscalaResultado).filter(
            EscalaResultado.id_ind_fk == ind.id_ind,
            EscalaDia.data_esd < data_atual
        ).order_by(EscalaDia.data_esd.desc()).first()

        dias_desde = (data_atual - ultima[0]).days if ultima else 999

        # Score: menor é melhor
        # penaliza quem já serviu muitas vezes e dá prioridade a quem está no nível ideal
        score = (qtd_mes * 10) - dias_desde + (nivel_ind - nivel_fun) * 5

        candidatos.append((ind, score))

    # Se não houver candidatos ideais, adiciona qualquer indivíduo que possa exercer
    if not candidatos:
        for ind in individuos:
            if NIVEL_PADRAO.get(ind.nivel_ind, 0) >= nivel_fun:
                candidatos.append((ind, 999))  # score alto = menos ideal

    if not candidatos:
        return None

    # Seleciona os mais justos
    menor_score = min(score for _, score in candidatos)
    mais_justos = [ind for ind, score in candidatos if score == menor_score]

    # Escolhe aleatoriamente entre os mais justos
    escolhido = random.choice(mais_justos)

    return escolhido

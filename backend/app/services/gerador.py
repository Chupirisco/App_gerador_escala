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
from collections import defaultdict

def gerar_escala_mes(db: Session, mes: int, ano: int):
    escalas = db.query(EscalaDia).filter(
        func.month(EscalaDia.data_esd) == mes,
        func.year(EscalaDia.data_esd) == ano
    ).all()

    controle_mes = {
        "escalados": set(),
        "contagem": defaultdict(int)
    }

    for escala in escalas:
        gerar_escala_dia(db, escala, controle_mes)

    db.commit()


# ====================
# Geração da escala de um dia
# ====================
def gerar_escala_dia(db: Session, escala: EscalaDia, controle_mes: dict):
    data_atual = escala.data_esd
    data_anterior = data_atual - timedelta(days=1)

    configuracoes = db.query(EscalaDiaFuncao).filter(
        EscalaDiaFuncao.id_esd_fk == escala.id_esd
    ).all()

    escalados_hoje = set()

    for cfg in configuracoes:
        for _ in range(cfg.quantidade):
            candidato = escolher_individuo(
                db, cfg, data_atual, data_anterior,
                escalados_hoje, controle_mes
            )

            resultado = EscalaResultado(
                id_esd_fk=escala.id_esd,
                id_fun_fk=cfg.id_fun_fk,
                id_ind_fk=candidato.id_ind if candidato else None
            )

            if candidato:
                escalados_hoje.add(candidato.id_ind)
                controle_mes["escalados"].add(candidato.id_ind)
                controle_mes["contagem"][candidato.id_ind] += 1

            db.add(resultado)


# ====================
# Escolher indivíduo para uma função
# ====================
def escolher_individuo(
    db: Session,
    cfg: EscalaDiaFuncao,
    data_atual,
    data_anterior,
    escalados_hoje: set,
    controle_mes: dict
):
    individuos = db.query(Individuo).filter(
        Individuo.status_ind == "ativo"
    ).all()

    nivel_fun = NIVEL_PADRAO.get(cfg.funcao.nivel_fun, 0)

    candidatos_novos = []
    candidatos_recorrentes = []

    for ind in individuos:
        nivel_ind = NIVEL_PADRAO.get(ind.nivel_ind, 0)

        # já escalado hoje
        if ind.id_ind in escalados_hoje:
            continue

        # nível insuficiente
        if nivel_ind < nivel_fun:
            continue

        # indisponível no dia
        if db.query(Indisponibilidade).filter(
            Indisponibilidade.id_ind_fk == ind.id_ind,
            Indisponibilidade.data_indp == data_atual
        ).first():
            continue

        # trabalhou ontem (regra absoluta)
        if db.query(EscalaResultado).join(EscalaDia).filter(
            EscalaResultado.id_ind_fk == ind.id_ind,
            EscalaDia.data_esd == data_anterior
        ).first():
            continue

        # prioridade de nível (quanto menor, melhor)
        if nivel_ind == nivel_fun:
            bonus_nivel = 0
        else:
            bonus_nivel = 5  # nível maior, mas não ideal

        qtd_mes = controle_mes["contagem"].get(ind.id_ind, 0)

        ultima = db.query(EscalaDia.data_esd).join(EscalaResultado).filter(
            EscalaResultado.id_ind_fk == ind.id_ind,
            EscalaDia.data_esd < data_atual
        ).order_by(EscalaDia.data_esd.desc()).first()

        dias_desde = (data_atual - ultima[0]).days if ultima else 999

        score = (qtd_mes * 10) - dias_desde + bonus_nivel

        if ind.id_ind not in controle_mes["escalados"]:
            candidatos_novos.append((ind, score))
        else:
            candidatos_recorrentes.append((ind, score))

    # PRIORIDADE ABSOLUTA: quem ainda não serviu no mês
    candidatos = candidatos_novos if candidatos_novos else candidatos_recorrentes

    if not candidatos:
        return None

    menor_score = min(score for _, score in candidatos)
    mais_justos = [ind for ind, score in candidatos if score == menor_score]

    return random.choice(mais_justos)



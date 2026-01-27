# 📅 Geração de Escala — Lógica Atual (Modelo Fixo)

Este documento descreve, de forma conceitual, como funciona a geração automática da escala mensal.
O objetivo é explicar **as regras aplicadas**, **a ordem de decisão** e **os critérios de prioridade**, sem entrar em detalhes de implementação ou código.

---

## 📌 Visão Geral

A geração da escala segue um **modelo fixo**, baseado em regras claras de elegibilidade, justiça e distribuição equilibrada.
O processo acontece **dia a dia**, respeitando restrições técnicas, disponibilidade dos indivíduos e histórico de participação no mês.

---

## 🗓️ 1. Identificação dos dias que precisam de escala

Ao iniciar a geração da escala mensal, o sistema identifica todos os dias do mês selecionado que possuem escala cadastrada.

Cada dia identificado será processado individualmente, garantindo que todos recebam uma distribuição de funções conforme suas configurações específicas.

---

## 📊 2. Controle geral do mês

Antes de iniciar a distribuição das funções, o sistema cria um controle geral do mês para acompanhar:

* Quais indivíduos **já participaram da escala no mês**.
* Quantas vezes **cada indivíduo foi escalado** ao longo do mês.

Esse controle é utilizado durante toda a geração para garantir uma distribuição mais equilibrada e justa.

---

## 🔄 3. Processamento dia a dia

A geração da escala ocorre **dia por dia**, respeitando a ordem cronológica.

Para cada dia, o sistema considera:

* A data atual.
* A data imediatamente anterior, pois existe uma regra que impede que alguém seja escalado em dias consecutivos.

---

## 🧩 4. Leitura das funções configuradas para o dia

Para cada dia, o sistema analisa:

* Quais funções precisam ser preenchidas.
* Quantas pessoas são necessárias em cada função.

Cada função é tratada separadamente, e cada vaga passa por um processo individual de escolha.

---

## 🚫 5. Impedimento de duplicidade no mesmo dia

Durante a geração de um dia específico, o sistema garante que:

* Um mesmo indivíduo **não pode ser escalado mais de uma vez no mesmo dia**, mesmo que existam várias funções disponíveis.

Isso evita sobrecarga e conflitos na escala diária.

---

## 👥 6. Processo de seleção de indivíduos

Para cada vaga de cada função, o sistema avalia todos os indivíduos ativos e aplica uma sequência de regras para determinar quem pode ou não ser escolhido.

Esse processo segue critérios fixos e previsíveis.

---

## ❌ 7. Regras eliminatórias (obrigatórias)

Um indivíduo é automaticamente descartado da seleção se:

1. Já estiver escalado naquele mesmo dia.
2. Não possuir o nível mínimo exigido para a função.
3. Estiver marcado como indisponível na data.
4. Tiver participado da escala no dia imediatamente anterior.

Essas regras são absolutas e não admitem exceções.

---

## 🎓 8. Avaliação de nível técnico

Os níveis seguem uma hierarquia pré-definida:

```
novato < intermediario < experiente
```

* Indivíduos com **nível exatamente igual ao exigido pela função** são considerados ideais.
* Indivíduos com nível superior podem ser utilizados, porém com menor prioridade.

Essa regra busca alinhar a função ao nível mais adequado, evitando o uso excessivo de pessoas mais experientes quando não necessário.

---

## 🕒 9. Análise do histórico individual

Para cada indivíduo que passou pelas regras eliminatórias, o sistema analisa:

* Quantas vezes ele já foi escalado no mês.
* Há quanto tempo foi sua última participação na escala antes do dia atual.

Essas informações são usadas para avaliar o grau de justiça de uma nova escalação.

---

## ⚖️ 10. Cálculo do grau de prioridade (justiça)

Cada indivíduo recebe uma pontuação baseada em três fatores:

* Frequência de participação no mês
  (quanto mais vezes, menor a prioridade).
* Tempo desde a última escala
  (quanto mais tempo, maior a prioridade).
* Adequação do nível à função.

Quanto **menor a pontuação**, maior a prioridade daquele indivíduo para a vaga atual.

---

## 🆕 11. Prioridade absoluta para quem ainda não serviu no mês

Os indivíduos elegíveis são separados em dois grupos:

* Pessoas que **ainda não participaram da escala naquele mês**.
* Pessoas que **já participaram pelo menos uma vez**.

Se existir ao menos uma pessoa válida que ainda não serviu no mês, **somente esse grupo é considerado** para a escolha.

Isso garante que todos tenham oportunidade antes que ocorram repetições.

---

## 🎯 12. Escolha final do indivíduo

Entre os indivíduos considerados válidos:

1. O sistema identifica a menor pontuação.
2. Todos que possuem essa mesma pontuação são considerados igualmente justos.
3. Um deles é escolhido de forma aleatória.

Esse fator aleatório evita padrões rígidos e distribuições previsíveis demais.

---

## 📝 13. Registro e atualização dos controles

Após a escolha:

* O indivíduo é associado à função e ao dia correspondente.
* Os controles são atualizados para refletir:

  * A participação no dia atual.
  * A participação no mês.
  * O aumento da contagem mensal daquele indivíduo.

Se não existir nenhum indivíduo válido para uma vaga, ela permanece sem preenchimento.

---

## ✅ 14. Conclusão da geração mensal

Após todos os dias do mês serem processados:

* A geração da escala é finalizada.
* O resultado reflete um modelo fixo, baseado em regras claras, priorização justa e distribuição equilibrada.



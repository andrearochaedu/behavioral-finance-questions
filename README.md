# 📊 Plataforma Cooperativa de Diagnóstico de Bem-Estar Financeiro

Esta plataforma consiste em uma aplicação inteligente projetada para o diagnóstico de hábitos, comportamento e bem-estar financeiro de membros de cooperativas de crédito. O sistema une a precisão cibernética moderna ao calor humano nobre, aproximando teorias de relevância científica e referências de políticas públicas nacionais de uma jornada prática, acolhedora e livre de julgamentos orçamentários agressivos.

---

## 🎓 Fundamentação Científica e Didática

O diagnóstico da plataforma está estruturado sob dois pilares integrados de fundamentação: a literatura de psicologia econômica internacional e as diretrizes oficiais de Cidadania Financeira brasileiras.

### 1. O Índice de Saúde Financeira do Brasileiro (I-SFB 2024)
Aferido em colaboração técnica entre a **FEBRABAN** e o **Banco Central do Brasil**, o I-SFB 2024 estabelece uma escala de aferição de **0 a 100 pontos** dividida em sete faixas de equilíbrio dinâmico de contas. A plataforma adota rigorosamente essa classificação científica para dar o posicionamento global ao cooperado de forma cortês e motivadora, substituindo termos punitivos por diagnósticos restauradores:
*   **De 83 a 100 — Saúde Financeira Ótima:** Vida financeira com ampla liberdade e segurança futura.
*   **De 69 a 82 — Saúde Financeira Muito Boa:** Domínio do cotidiano, com margem ideal para o salto para a consolidação de investimentos regulares.
*   **De 61 a 68 — Saúde Financeira Boa:** O básico muito bem executado, mantendo contas estruturadas.
*   **De 57 a 60 — Saúde Financeira Ok:** Equilíbrio financeiro no limite, sugerindo atenção protetiva contra imprevistos.
*   **De 50 a 56 — Saúde Financeira Inicial (Baixa):** Primeiros sinais de desequilíbrio; momento acolhedor para reorganizar despesas fixas.
*   **De 37 a 49 — Saúde Financeira sob Atenção (Muito Baixa):** Sinais nítidos de fragilidade com risco de entrar em estresse severo; sugere-se a suspensão de parcelamentos voluntários.
*   **De 0 a 36 — Saúde Financeira em Reestruturação (Ruim):** Estágio de sensibilidade e desorganização ativa; momento ideal para mapear obrigações, estancar saídas não essenciais e renegociar descompassos com apoio humanizado.

### 2. Autocontrole de Gastos (CSSC)
*   **Referencial Teórico:** *Ponchio, M. C., Cordeiro, R. A., & Gonçalves, V. N. (2019).*
*   **Abordagem Didática (Comportamento):** O modelo demonstra que conhecimento técnico isolado não blinda o orçamento da ansiedade de consumo. O real amortecedor regulatório é o **CSSC (Consumer Spending Self-Control)** — a habilidade de impor limites internos saudáveis e resistir a gatilhos imediatistas.
*   **Tradução Prática (Módulo 1 e Módulo 4 do Banco Central):** O relatório detalha caminhos personalizados (*Sólido*, *Moderado* ou *A Ser Desenvolvido*) e sugere ferramentas testadas pelo BCB, como a **regra de adiamento de 24 horas para compras flexíveis** e estratégias para esvaziar os efeitos do "marketing de sedução" (como anúncios ancorados e impulsos alimentados por estômago vazio).

### 3. Contabilidade Mental
*   **Referencial Teórico:** *Muehlbacher, S., & Kirchler, E. (2019).*
*   **Abordagem Didática (Organização):** A contabilidade mental analisa como os indivíduos rotulam e segregam o dinheiro cognitivamente. Utilizar "classes mentais" específicas de despesa, violando o princípio clássico da fungibilidade, age como um forte pilar de autodisciplina.
*   **Tradução Prática (Módulo 2 do Banco Central):** Ensina as **quatro etapas pedagógicas para o orçamento do BCB**: 1) Planejamento (estimativas), 2) Registro Diário (anotação detalhada), 3) Agrupamento Temático (alimentação, habitação, lazer) e 4) Avaliação Mensal de metas de curto, médio e longo prazo compartilhadas harmoniosamente com a família.

### 4. Uso de Crédito e Cidadania Monetária (Módulos 3, 5 e 6 do Banco Central)
A plataforma fornece clareza conceitual em finanças aplicadas:
*   **Crédito:** Desmistifica os juros como "o aluguel do dinheiro no tempo". Orienta o participante a pechinchar e comparar o **Custo Efetivo Total (CET)**, entendendo o impacto real do tempo exponencial dos juros compostos.
*   **Poupança Ativa:** Enfatiza a diretriz do Banco Central sobre a importância de **"Pagar-se Primeiro"** (guardar a parcela reservada do futuro e segurança antes de iniciar o pagamento de despesas operacionais voluntárias), reduzindo drasticamente o estresse e preparando o futuro de forma consistente.

---

## 🛠️ Detalhamento Técnico e de Arquitetura

A aplicação foi desenvolvida com padrões industriais, garantindo alto desempenho, elegância responsiva e tipagem estática rigorosa.

```
├── public/                 # Vetores gráficos e metadados
├── src/
│   ├── components/
│   │   ├── Auth.tsx                    # Login sofisticado de cooperados
│   │   ├── FinancialAssessment.tsx     # Motor principal do questionário de 50 questões
│   │   └── ...
│   ├── services/
│   │   ├── firebase.ts                 # Integração e regras persistentes de Auth e Firestore
│   │   ├── storageService.ts           # Gestão de persistência offline (Local Storage)
│   │   └── questionnaireData.ts        # Árvore de perguntas científicas (Q01-Q50)
│   ├── App.tsx             # Orquestrador SPA e transições com Framer Motion
│   ├── types.ts            # Tipagem integral estática de dados e scores de usuários
│   └── index.css           # Estilização global via Tailwind CSS
├── metadata.json           # Definição e escopos do aplicativo
└── package.json            # Scripts de build bundler (esbuild + vite)
```

### Principais Componentes Técnicos
1.  **Frontend SPA Moderno (React 18 + Vite):** Interface SPA ágil sem carregamento de página desnecessário, provendo fluidez absoluta em transições de questionário e gráficos.
2.  **Visual Inteligente (Tailwind CSS):** Estética refinada com tema escuro de alto contraste ("Ambiente Ardósia/Slate"), que confere credibilidade de aplicação bancária premium. Curvas circulares amplas e tipografia bem distribuída.
3.  **Conversão de Algoritmo Científico (`SCORE_LOOKUP`):** O sistema recebe a árvore de respostas das questões de bem-estar financeiro (Q07-Q16) e, através de um mapeamento científico rigoroso no arquivo de comportamento, traduz a pontuação bruta em notas na escala I-SFB 24 (de 14 a 86 pontos).
4.  **Sistema Híbrido de Persistência:**
    *   **Offline-First (Local Storage):** Sincronização imediata no navegador protegendo os dados nos turnos do diagnóstico se a conexão falhar.
    *   **Firebase Integration:** Sincronização em nuvem do progresso e resultados históricos de exames do cooperado, protegida pelas regras integradas do Google Cloud.

---

Este projeto sintetiza e materializa o propósito das finanças cooperativas: colocar a engenharia de software de ponta a favor do letramento didático, da equidade de tratamento e do cuidado integral com a saúde financeira real de seus parceiros e membros.

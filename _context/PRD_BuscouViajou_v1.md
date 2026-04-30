# Product Requirements Document (PRD) - Enterprise Edition

| | |
|---|---|
| **Projeto:** | Marketplace de Fretamento Turístico Buscou Viajou |
| **Versão:** | 1.0 |
| **Data:** | 15 de Fevereiro de 2026 |
| **Status:** | Pronto para Desenvolvimento |

---

## 1. Visão Geral e Estratégia

### 1.1. Problema e Oportunidade de Mercado

O mercado brasileiro de fretamento de veículos para turismo, apesar de seu volume expressivo, opera de maneira predominantemente analógica, fragmentada e ineficiente. Para o cliente, o processo de cotação envolve múltiplos contatos telefônicos, falta de padronização de preços e ausência de um selo de confiança sobre os fornecedores. Para as empresas de transporte, há uma grande dificuldade em otimizar a ocupação da frota e alcançar novos públicos fora de sua rede de contatos imediata. A **Buscou Viajou** nasce para solucionar essa ineficiência de mercado, posicionando-se como **o Trivago do fretamento de veículos** — uma plataforma de comparação e reserva onde o cliente busca, compara preços de dezenas de empresas lado a lado e reserva em poucos cliques.

### 1.2. Visão do Produto

Ser a **principal plataforma de busca e comparação de fretamento de veículos de turismo do Brasil**, funcionando como um **metabuscador inteligente** que conecta clientes a uma vasta rede de empresas de transporte parceiras, todas rigorosamente verificadas. Assim como o Trivago permite comparar hotéis por preço, localização e avaliação, a Buscou Viajou permite comparar veículos fretados por preço, tipo, comodidades e reputação da empresa. A plataforma irá automatizar e trazer transparência para todo o ciclo: **busca → comparação → reserva → pagamento → bilhete digital (QR Code) → viagem → avaliação**.

### 1.3. Posicionamento Competitivo — Modelo "Trivago"

O diferencial da Buscou Viajou em relação a um marketplace tradicional é a **experiência de comparação**:

- **Busca unificada:** O cliente digita origem, destino e datas uma única vez e vê todas as opções de todas as empresas parceiras.
- **Comparação transparente:** Resultados exibidos lado a lado com preço, avaliação, comodidades, tipo de veículo e fotos.
- **Filtros inteligentes:** Tipo de veículo, faixa de preço, avaliação mínima, comodidades específicas (Wi-Fi, banheiro, ar-condicionado).
- **Ordenação por relevância:** Algoritmo que considera preço, avaliação, taxa de cancelamento e pricing dinâmico.
- **Preço dinâmico visível:** O cliente vê claramente quando há promoção ou aumento por alta demanda, com indicadores visuais de "melhor preço" e "alta procura".

### 1.4. Objetivos e Métricas de Sucesso (KPIs)

| Objetivo | Métrica de Sucesso (KPI) |
|---|---|
| **Validar o modelo de negócio** | Atingir um GMV (Gross Merchandise Volume) de R$ 500.000 nos primeiros 6 meses. |
| **Construir a oferta** | Onboarding de 50 empresas parceiras ativas e verificadas nos primeiros 4 meses. |
| **Gerar demanda** | Alcançar 200 viagens concluídas e pagas através da plataforma nos primeiros 6 meses. |
| **Garantir a satisfação** | Manter um NPS (Net Promoter Score) acima de 50 tanto para clientes quanto para empresas parceiras. |
| **Engajar os usuários** | Atingir uma taxa de conversão de cotação para reserva paga superior a 10%. |

---

## 2. Modelo de Negócio e Financeiro

### 2.1. Modelo de Marketplace — Estilo Trivago

A Buscou Viajou operará como um **marketplace de comparação e intermediação**. A plataforma é responsável por agregar a oferta de todas as empresas parceiras em uma única interface de busca, permitir a comparação transparente, processar a transação financeira de forma segura e fornecer as ferramentas para a gestão da reserva. A **responsabilidade pela prestação do serviço de transporte** (qualidade do veículo, pontualidade, segurança da viagem) é **integralmente da empresa parceira**.

### 2.2. Fontes de Receita

A monetização da plataforma será baseada em duas fontes de receita, cobradas das empresas parceiras:

1. **Taxa de Assinatura Mensal:** Um valor fixo cobrado mensalmente para que a empresa parceira mantenha seus veículos listados e ativos na plataforma.
2. **Taxa de Serviço por Transação:** Uma taxa fixa cobrada sobre o valor de cada viagem concluída com sucesso através da plataforma.

*Ambos os valores serão configuráveis por empresa pelo Super Admin, permitindo flexibilidade comercial.*

### 2.3. Modelo de Precificação das Empresas Parceiras

Cada empresa parceira define seus preços na plataforma com base nos seguintes parâmetros:

| Parâmetro | Descrição | Obrigatório |
|---|---|---|
| **Custo de Saída Mínima** | Valor mínimo cobrado para qualquer viagem, independentemente da distância. Cobre custos fixos de mobilização do veículo (saída da garagem, preparação, motorista). | Sim |
| **Valor por KM** | Preço cobrado por quilômetro rodado. Aplicado sobre a distância total (garagem→cliente + trajeto + retorno garagem). | Sim |
| **Adicionais** | Itens extras configuráveis: guia turístico, cooler com bebidas, seguro viagem, parada para refeição, etc. Podem ser: valor fixo, valor por pessoa ou pacote. | Não |

**Fórmula de preço base:**

```
Preço Base = MAX(Custo de Saída Mínima, KM Total × Valor/KM) + Σ(Adicionais Selecionados)
```

O preço base é o valor mínimo. Se o cálculo por KM for inferior ao custo de saída mínima, prevalece o custo de saída mínima. Isso protege a empresa em viagens curtas.

### 2.4. Pricing Dinâmico (Oferta e Demanda)

Inspirado no modelo da Uber, a plataforma aplica um **multiplicador dinâmico** sobre o preço base de cada empresa, ajustado automaticamente conforme a relação entre oferta e demanda.

#### Como funciona

1. **O sistema monitora em tempo real:**
   - Número de buscas para uma rota/data específica (demanda)
   - Número de veículos disponíveis para essa rota/data (oferta)
   - Taxa de ocupação da frota das empresas na região
   - Sazonalidade (feriados, férias, eventos regionais)

2. **O sistema calcula o multiplicador:**

| Nível | Condição | Multiplicador | Indicador Visual |
|---|---|---|---|
| **Normal** | Oferta ≥ Demanda | 1.0x (sem alteração) | Preço normal |
| **Procura Alta** | Demanda > Oferta em 30% | 1.1x a 1.3x | 🟡 "Alta procura" |
| **Procura Muito Alta** | Demanda > Oferta em 60% | 1.3x a 1.6x | 🟠 "Procura muito alta" |
| **Pico** | Demanda > Oferta em 100%+ | 1.6x a 2.0x (teto) | 🔴 "Preço de pico" |
| **Promoção** | Oferta >> Demanda | 0.8x a 0.95x | 🟢 "Melhor preço" |

3. **Preço final apresentado ao cliente:**

```
Preço Final = Preço Base × Multiplicador Dinâmico
```

4. **Transparência:** O cliente sempre vê o multiplicador aplicado. Ex: "Preço com alta procura (+20%)" ou "Promoção: 15% de desconto por baixa procura".

> As regras detalhadas do pricing dinâmico (RN-DYN-001 a RN-DYN-006) estão na Seção 12.1.1.

### 2.5. Fluxo Financeiro

O fluxo de pagamento é o pilar do modelo de negócio e será totalmente gerenciado pela plataforma:

1. O **Cliente** paga **100% do valor** da reserva na plataforma via gateway de pagamento (Stripe).
2. O valor fica retido na conta master do Buscou Viajou no Stripe.
3. Após a conclusão da viagem, o sistema calcula o valor a ser repassado para a empresa parceira, já descontando a taxa de serviço.
4. O repasse é realizado para a conta conectada (Stripe Connect) da empresa parceira em um prazo configurável (ex: D+15 após o término da viagem).

---

## 3. Usuários e Perfis de Acesso

O sistema será multi-tenant e suportará múltiplos níveis de permissão para garantir a segurança e a correta separação de responsabilidades.

| Perfil (Role) | Ator | Plataforma | Descrição e Permissões Chave |
|---|---|---|---|
| **Cliente** | Cliente Final | App Mobile / Web | Busca, cota, reserva, paga, avalia viagens e gerencia seu histórico. |
| **Admin de Empresa** | Dono/Gestor da Empresa | Painel Web | Acesso total à sua própria empresa: gestão de frota, motoristas, viagens, finanças, usuários e configurações. |
| **Operador de Empresa** | Funcionário da Empresa | Painel Web | Focado na operação: gerencia solicitações de viagem, aloca veículos e motoristas. **Não tem acesso** a configurações financeiras ou de usuários. |
| **Financeiro de Empresa** | Funcionário da Empresa | Painel Web | Acesso somente leitura aos relatórios financeiros e ao painel de recebíveis da sua empresa. |
| **Super Admin Buscou Viajou** | Equipe Buscou Viajou | Painel Web | Acesso irrestrito a toda a plataforma: gerencia empresas parceiras, configura taxas, supervisiona transações, gera relatórios globais e gerencia o conteúdo do site. |

---

## 4. Glossário de Termos

| Termo | Definição |
|---|---|
| **GMV** | Gross Merchandise Volume. O valor total de todas as transações pagas através da plataforma. |
| **KYC** | Know Your Customer. Processo de verificação de identidade do cliente. |
| **Marketplace** | Modelo de negócio onde a plataforma conecta compradores e vendedores, intermediando a transação. |
| **MoSCoW** | Método de priorização (Must-Have, Should-Have, Could-Have, Won't-Have). |
| **Repasse** | Transferência do valor da viagem (descontadas as taxas) da conta do Buscou Viajou para a conta da empresa parceira. |
| **Stripe Connect** | Produto da Stripe que permite que uma plataforma processe pagamentos e repasse fundos para terceiros (as empresas parceiras). |
| **Taxa de Serviço** | Valor cobrado pelo Buscou Viajou a cada transação bem-sucedida. |
| **Custo de Saída Mínima** | Valor mínimo cobrado pela empresa para qualquer viagem, independentemente da distância. Cobre custos fixos de mobilização do veículo. |
| **Pricing Dinâmico** | Modelo de precificação onde o preço final é ajustado automaticamente por um multiplicador baseado na relação entre oferta e demanda, similar ao surge pricing da Uber. |
| **Multiplicador** | Fator aplicado sobre o preço base para refletir a oferta/demanda. Varia de 0.8x (promoção) a 2.0x (pico). |
| **Bilhete Digital** | QR Code gerado após confirmação de pagamento, que serve como comprovante de reserva e bilhete de embarque. Validado pelo motorista no dia da viagem. |
| **Metabuscador** | Plataforma que agrega e compara ofertas de múltiplos fornecedores em uma única interface de busca, como Trivago para hotéis ou Buscou Viajou para fretamento. |

---

## 5. Casos de Uso (Use Cases)

Esta seção detalha os principais fluxos de interação do sistema sob a perspectiva do usuário.

### 5.1. UC-001: Realizar Cotação e Reserva de Veículo

| | |
|---|---|
| **ID:** | UC-001 |
| **Caso de Uso:** | Realizar Cotação e Reserva de Veículo |
| **Ator Principal:** | Cliente |
| **Resumo:** | O cliente busca por veículos disponíveis para uma viagem específica, compara as opções, escolhe um veículo e finaliza a reserva, realizando o pagamento. |
| **Pré-condições:** | O cliente está logado na plataforma (App ou Web). |
| **Pós-condições:** | Uma nova reserva é criada com o status `CONFIRMED` e associada ao cliente e à empresa parceira. Uma transação financeira é registrada. O cliente e a empresa são notificados. |

#### Fluxo Principal (Happy Path)

1. **Cliente** preenche o formulário de busca com: Origem, Destino, Data/Hora de Ida, Data/Hora de Volta (opcional), e Número de Passageiros.
2. **Sistema** valida os dados de entrada.
3. **Sistema** calcula a rota e a distância total (incluindo deslocamentos de garagem) para cada veículo potencialmente disponível.
4. **Sistema** aplica as regras de precificação (RN-PRICE-001/002) e retorna uma lista de veículos disponíveis com seus respectivos preços finais.
5. **Cliente** visualiza a lista de resultados e seleciona um veículo para ver os detalhes.
6. **Cliente** revisa os detalhes e clica em "Solicitar Reserva".
7. **Sistema** cria uma reserva com status `PENDING_APPROVAL` e notifica a **Empresa Parceira**.
8. **Empresa Parceira** (Admin ou Operador) aprova a solicitação (ver UC-002).
9. **Sistema** atualiza o status da reserva para `PENDING_PAYMENT` e notifica o **Cliente**.
10. **Cliente** acessa a reserva e clica em "Pagar Agora".
11. **Sistema** redireciona para o checkout do Stripe, onde o cliente insere os dados de pagamento.
12. **Sistema (via Stripe)** processa o pagamento e a pré-autorização do depósito caução.
13. **Sistema** confirma o pagamento, atualiza o status da reserva para `CONFIRMED`.
14. **Sistema** gera o **Bilhete Digital (QR Code)** da viagem contendo: ID da reserva, dados do cliente, rota, data/hora, veículo e empresa. O QR Code é único e criptografado.
15. **Sistema** envia um e-mail de confirmação para o **Cliente** com o bilhete digital em anexo (PDF) e notifica a **Empresa Parceira** sobre a viagem confirmada.
16. **Cliente** pode acessar o bilhete digital (QR Code) a qualquer momento no app/web, na seção "Minhas Viagens".

#### Fluxos Alternativos

- **5a. Sem resultados:** Se o sistema não encontrar veículos disponíveis, exibe uma mensagem amigável e sugere ao cliente alterar os filtros da busca.
- **8a. Solicitação Recusada:** Se a empresa parceira recusar a solicitação, o sistema atualiza o status da reserva para `REJECTED` e notifica o cliente, sugerindo que ele busque outras opções.
- **8b. Solicitação Expirada:** Se a empresa não responder em 24 horas, o sistema atualiza o status para `EXPIRED` e notifica o cliente.
- **12a. Falha no Pagamento:** Se o pagamento falhar, o sistema informa o erro ao cliente e permite que ele tente novamente com outro método de pagamento.

### 5.2. UC-002: Gerenciar Solicitação de Viagem

| | |
|---|---|
| **ID:** | UC-002 |
| **Caso de Uso:** | Gerenciar Solicitação de Viagem |
| **Ator Principal:** | Admin de Empresa, Operador de Empresa |
| **Resumo:** | O administrador ou operador da empresa parceira recebe uma nova solicitação de viagem, analisa os detalhes e decide por aprovar ou recusar. |
| **Pré-condições:** | Existe uma reserva com status `PENDING_APPROVAL`. O ator está logado no Painel Web. |
| **Pós-condições:** | A reserva é atualizada para `PENDING_PAYMENT` (se aprovada) ou `REJECTED` (se recusada). |

#### Fluxo Principal

1. **Ator** recebe uma notificação (e-mail e na plataforma) sobre uma nova solicitação.
2. **Ator** acessa o painel de "Solicitações de Viagem" e clica na nova solicitação.
3. **Sistema** exibe todos os detalhes da viagem: rota, datas, horários, informações do cliente (sem dados sensíveis) e o valor que a empresa irá receber.
4. **Ator** verifica a disponibilidade do veículo e de um motorista para as datas solicitadas.
5. **Ator** clica em "Aprovar Viagem".
6. **Sistema** abre um modal para que o Ator aloque um motorista específico para a viagem.
7. **Ator** seleciona o motorista e confirma a aprovação.
8. **Sistema** atualiza o status da reserva para `PENDING_PAYMENT` e dispara a notificação para o cliente proceder com o pagamento.

#### Fluxos Alternativos

- **5a. Recusar Viagem:** O ator clica em "Recusar Viagem". O sistema solicita um motivo (opcional) e atualiza o status da reserva para `REJECTED`, notificando o cliente.

### 5.3. UC-003: Auto-Cadastro de Empresa Parceira (Self-Service)

| | |
|---|---|
| **ID:** | UC-003 |
| **Caso de Uso:** | Auto-Cadastro de Empresa Parceira |
| **Ator Principal:** | Representante da Empresa (novo), Super Admin Buscou Viajou (aprovação) |
| **Resumo:** | Uma empresa de transporte interessada em ser parceira preenche um formulário público de pré-cadastro com seus dados e documentos. A solicitação cai em uma fila de aprovação para o Super Admin, que analisa e aprova ou recusa. |
| **Pré-condições:** | A empresa acessa a página pública "Seja um Parceiro" no site da Buscou Viajou. Não é necessário login. |
| **Pós-condições:** | Se aprovada: empresa criada com status `ACTIVE`, usuário `Admin de Empresa` criado e e-mail de boas-vindas enviado. Se recusada: e-mail informando o motivo e possibilidade de re-submissão. |

#### Fluxo Principal — Pré-Cadastro (Empresa)

1. **Representante** acessa a landing page "Seja um Parceiro da Buscou Viajou" e clica em "Cadastrar Minha Empresa".
2. **Sistema** exibe o formulário de pré-cadastro em **3 etapas** (wizard):

   **Etapa 1 — Dados da Empresa:**
   - Razão Social, Nome Fantasia, CNPJ, Endereço completo, Telefone comercial

   **Etapa 2 — Dados do Responsável:**
   - Nome completo, CPF, E-mail, Telefone pessoal, Cargo na empresa

   **Etapa 3 — Documentos e Frota:**
   - Upload do Contrato Social (PDF, max 10MB)
   - Upload do Alvará de Funcionamento (PDF, max 10MB)
   - Upload da Autorização ANTT (PDF, max 10MB)
   - Quantidade estimada de veículos (select: 1-5, 6-15, 16-50, 50+)
   - Tipos de veículos disponíveis (checkbox: Ônibus, Micro-ônibus, Van)
   - Regiões de atuação (multi-select por estado)
   - Campo aberto: "Conte um pouco sobre sua empresa" (opcional, max 500 caracteres)

3. **Representante** revisa os dados no resumo e clica em "Enviar Cadastro".
4. **Sistema** valida todos os campos, verifica se o CNPJ não está já cadastrado, e cria a solicitação com status `PENDING_APPROVAL`.
5. **Sistema** envia e-mail de confirmação ao representante: "Recebemos seu cadastro! Nosso time analisará em até 48 horas úteis."
6. **Sistema** notifica o **Super Admin** sobre a nova solicitação de parceria.

#### Fluxo Principal — Aprovação (Super Admin)

7. **Super Admin** acessa o painel de "Solicitações de Parceria" e vê a lista de empresas aguardando aprovação, ordenada por data (mais antigas primeiro).
8. **Super Admin** clica em uma solicitação para ver todos os detalhes e documentos enviados.
9. **Super Admin** verifica os documentos e dados. Se tudo estiver em ordem, define as taxas (assinatura e serviço) e clica em "Aprovar Empresa".
10. **Sistema** atualiza o status da empresa para `ACTIVE`, cria o usuário `Admin de Empresa` associado e envia um e-mail ao representante com:
    - Link para definir senha e acessar o painel pela primeira vez
    - Guia rápido "Primeiros passos: como cadastrar seus veículos e começar a receber viagens"
    - Informações sobre taxas definidas

#### Fluxos Alternativos

- **9a. Recusar:** O Super Admin clica em "Recusar" e preenche o motivo (obrigatório). O sistema envia e-mail ao representante com o motivo e a opção "Corrigir e Reenviar" (link para editar a solicitação existente).
- **9b. Solicitar Documentos Adicionais:** O Super Admin clica em "Solicitar Mais Informações" e descreve o que falta. O status muda para `PENDING_DOCUMENTS`. O representante recebe e-mail com link para complementar o cadastro.
- **4a. CNPJ já cadastrado:** Se o CNPJ já existe no sistema, o formulário exibe: "Este CNPJ já possui um cadastro. Se você é o responsável, entre em contato com nosso suporte."

### 5.4. UC-004: Abrir e Gerenciar Disputa

| | |
|---|---|
| **ID:** | UC-004 |
| **Caso de Uso:** | Abrir e Gerenciar Disputa |
| **Ator Principal:** | Cliente (abertura), Super Admin Buscou Viajou (mediação) |
| **Resumo:** | O cliente abre uma disputa após a conclusão de uma viagem alegando problemas com o serviço prestado. A equipe Buscou Viajou media o conflito, coleta evidências e emite uma resolução. |
| **Pré-condições:** | A reserva está com status `COMPLETED` ou `NO_SHOW_COMPANY`. O prazo para abertura de disputa não expirou (72h após conclusão). O cliente está logado. |
| **Pós-condições:** | Uma disputa é criada, analisada e resolvida. Dependendo do resultado, um reembolso total ou parcial pode ser emitido ao cliente e/ou uma penalidade aplicada à empresa. O repasse à empresa é bloqueado durante a análise. |

#### Fluxo Principal

1. **Cliente** acessa a reserva concluída e clica em "Reportar Problema".
2. **Sistema** exibe um formulário com as categorias de disputa: Veículo Diferente do Anunciado, Atraso Significativo, Problemas de Segurança, Motorista Inadequado, Comodidades Ausentes, No-Show da Empresa, Outro.
3. **Cliente** seleciona a categoria, descreve o problema em texto livre e faz upload de evidências (fotos, vídeos — máximo 5 arquivos, 10MB cada).
4. **Sistema** cria a disputa com status `OPEN`, bloqueia o repasse financeiro da reserva associada e notifica a **Empresa Parceira** e o **Super Admin Buscou Viajou**.
5. **Empresa Parceira** recebe a notificação e tem **48 horas** para enviar sua contestação com evidências.
6. **Super Admin Buscou Viajou** acessa o painel de disputas e revisa as evidências de ambas as partes.
7. **Super Admin** seleciona uma resolução: Reembolso Total ao Cliente, Reembolso Parcial (% configurável), Disputa Improcedente (repasse liberado normalmente), ou Penalidade à Empresa (multa + impacto no ranking).
8. **Super Admin** registra a justificativa da decisão e confirma a resolução.
9. **Sistema** atualiza o status da disputa para `RESOLVED`, executa a ação financeira correspondente (reembolso e/ou liberação de repasse), e notifica ambas as partes com a decisão.

#### Fluxos Alternativos

- **5a. Empresa não contesta:** Se a empresa não enviar contestação em 48 horas, o Super Admin pode resolver com base apenas nas evidências do cliente.
- **7a. Escalonamento:** Se o Super Admin não conseguir resolver, a disputa pode ser escalonada para análise jurídica com status `ESCALATED`.
- **3a. Prazo expirado:** Se o cliente tentar abrir uma disputa após 72h da conclusão, o sistema exibe mensagem informando que o prazo expirou e sugere contato com o suporte.

### 5.5. UC-005: Avaliar Viagem

| | |
|---|---|
| **ID:** | UC-005 |
| **Caso de Uso:** | Avaliar Viagem |
| **Ator Principal:** | Cliente (avaliação), Admin de Empresa (resposta) |
| **Resumo:** | Após a conclusão de uma viagem, o cliente avalia o serviço prestado pela empresa parceira. A empresa pode responder publicamente à avaliação. |
| **Pré-condições:** | A reserva está com status `COMPLETED`. O cliente ainda não avaliou esta viagem. O prazo de avaliação (7 dias) não expirou. |
| **Pós-condições:** | Uma avaliação é registrada e associada à reserva, ao veículo e à empresa. A nota média da empresa é recalculada. |

#### Fluxo Principal

1. **Sistema** envia uma notificação ao **Cliente** 2 horas após a conclusão da viagem solicitando avaliação.
2. **Cliente** acessa a reserva concluída e clica em "Avaliar Viagem".
3. **Sistema** exibe o formulário de avaliação com:
   - Nota geral (1 a 5 estrelas) — obrigatória
   - Notas por categoria (1 a 5 estrelas cada) — obrigatórias:
     - Pontualidade
     - Estado do Veículo
     - Motorista (cordialidade e direção)
     - Custo-benefício
   - Comentário em texto livre — opcional (min 10, max 500 caracteres se preenchido)
4. **Cliente** preenche as notas e o comentário e clica em "Enviar Avaliação".
5. **Sistema** valida os dados, salva a avaliação com status `PUBLISHED` e recalcula a nota média da empresa e do veículo.
6. **Sistema** notifica a **Empresa Parceira** sobre a nova avaliação.
7. **Admin de Empresa** pode visualizar a avaliação e clicar em "Responder".
8. **Admin** escreve a resposta (max 500 caracteres) e confirma.
9. **Sistema** salva a resposta e a exibe publicamente junto à avaliação.

#### Fluxos Alternativos

- **4a. Lembrete:** Se o cliente não avaliar em 48h, o sistema envia um segundo lembrete. Após 7 dias, a possibilidade de avaliar expira.
- **5a. Moderação automática:** Se o comentário contiver palavras ofensivas (filtro automático), a avaliação é salva com status `PENDING_MODERATION` para revisão do Super Admin.
- **9a. Contestação de avaliação:** Se a empresa considerar a avaliação falsa ou injusta, pode solicitar revisão ao Super Admin via botão "Contestar Avaliação", que altera o status para `UNDER_REVIEW`.

### 5.6. UC-006: Concluir Viagem e Processar Repasse

| | |
|---|---|
| **ID:** | UC-006 |
| **Caso de Uso:** | Concluir Viagem e Processar Repasse |
| **Ator Principal:** | Operador/Admin de Empresa (registro), Sistema (processamento financeiro) |
| **Resumo:** | A empresa parceira registra o início e a conclusão da viagem no sistema, disparando o fluxo pós-viagem que inclui: confirmação do cliente, janela de contestação, liberação de caução e agendamento do repasse. |
| **Pré-condições:** | A reserva está com status `CONFIRMED` e a data de embarque chegou. |
| **Pós-condições:** | A reserva está com status `COMPLETED`. A caução é liberada. O repasse é agendado conforme RN-FIN-006. |

#### Fluxo Principal

1. **Operador/Admin** acessa a reserva no painel e clica em "Registrar Embarque" no horário de partida.
2. **Sistema** atualiza o status da reserva para `IN_PROGRESS` e notifica o **Cliente** que a viagem foi iniciada.
3. Ao término da viagem, **Operador/Admin** clica em "Registrar Conclusão".
4. **Sistema** atualiza o status para `PENDING_COMPLETION` e notifica o **Cliente** para confirmar a conclusão.
5. **Cliente** recebe a notificação e tem **24 horas** para:
   - a) Confirmar a conclusão — status atualizado para `COMPLETED`.
   - b) Contestar e abrir uma disputa (ver UC-004).
6. Se o cliente não responder em 24 horas, o sistema confirma automaticamente e atualiza o status para `COMPLETED`.
7. **Sistema** inicia o fluxo financeiro pós-viagem:
   - Libera a pré-autorização do depósito caução no cartão do cliente.
   - Calcula o valor de repasse: `valor total - taxa de serviço da plataforma`.
   - Agenda o repasse para a empresa parceira conforme prazo configurado (RN-FIN-006, ex: D+15).
8. **Sistema** notifica a empresa sobre o repasse agendado com o valor e data previstos.
9. **Sistema** envia notificação ao cliente solicitando avaliação (ver UC-005).

#### Fluxos Alternativos

- **1a. Empresa não registra embarque:** Se a empresa não registrar o embarque até 1 hora após o horário programado, o sistema envia alerta ao Super Admin e notifica o cliente.
- **3a. No-Show do Cliente:** Se o cliente não compareceu, o Operador clica em "Registrar No-Show do Cliente". O sistema aplica RN-FIN-003 (sem reembolso, repasse normal).
- **1b. No-Show da Empresa:** Se a empresa não comparecer e não registrar embarque, o **Cliente** pode reportar no-show da empresa via app. O sistema cria automaticamente uma disputa com categoria "No-Show da Empresa" e bloqueia o repasse.

### 5.7. UC-007: Bilhete Digital (QR Code)

| | |
|---|---|
| **ID:** | UC-007 |
| **Caso de Uso:** | Gerar, Exibir e Validar Bilhete Digital (QR Code) |
| **Ator Principal:** | Cliente (exibição), Motorista/Operador (validação) |
| **Resumo:** | Após o pagamento confirmado, o sistema gera um bilhete digital com QR Code que serve como comprovante de reserva e bilhete de embarque. O motorista ou operador valida o QR Code no momento do embarque. |
| **Pré-condições:** | A reserva está com status `CONFIRMED`. |
| **Pós-condições:** | O QR Code é validado, o embarque é registrado automaticamente e o status atualiza para `IN_PROGRESS`. |

#### Fluxo Principal

1. **Sistema** gera automaticamente o bilhete digital ao confirmar o pagamento. O bilhete contém:
   - QR Code criptografado (contém: booking_id + hash de validação)
   - Nome do cliente
   - Origem → Destino (com paradas)
   - Data e horário de embarque
   - Empresa e veículo (modelo, placa)
   - Motorista designado
   - Código de reserva legível (ex: BV-2026-A3K9)
2. **Cliente** pode acessar o bilhete digital de 3 formas:
   - No app/web: seção "Minhas Viagens" → botão "Ver Bilhete"
   - Por e-mail: PDF em anexo no e-mail de confirmação
   - Offline: o QR Code fica disponível mesmo sem conexão (cache local)
3. No dia da viagem, **Cliente** apresenta o QR Code no celular ao **Motorista/Operador**.
4. **Motorista/Operador** escaneia o QR Code usando o app da empresa ou a câmera do celular (link web).
5. **Sistema** valida o QR Code verificando: booking_id existe, status é `CONFIRMED`, data corresponde, e o hash é válido.
6. **Sistema** exibe na tela do motorista: "✅ Bilhete válido" com nome do cliente e detalhes da viagem.
7. **Sistema** registra automaticamente o embarque (mesma ação do botão "Registrar Embarque" do UC-006).

#### Fluxos Alternativos

- **5a. QR Code inválido:** Sistema exibe "❌ Bilhete inválido" com o motivo (reserva cancelada, data incorreta, já utilizado).
- **5b. QR Code já escaneado:** Sistema exibe "⚠️ Bilhete já utilizado em [data/hora]" para prevenir duplicação.
- **3a. Sem acesso ao celular:** O código de reserva legível (BV-2026-A3K9) pode ser informado verbalmente ao motorista, que digita manualmente no app para validação.

---

## 6. Especificação de Telas e Componentes

Esta seção detalha os campos, validações e estados para as principais telas do sistema, servindo como um guia para a equipe de frontend.

### 6.1. Telas do Cliente (App/Web)

#### Tela: Busca de Viagem (Home)

| Componente | Tipo | Validação | Comportamento |
|---|---|---|---|
| **Origem** | Autocomplete (Google Places) | Obrigatório | - |
| **Destino** | Autocomplete (Google Places) | Obrigatório, diferente da Origem | - |
| **Data de Ida** | Date Picker | Obrigatório, data futura (>= D+1) | - |
| **Data de Volta** | Date Picker | Opcional, se preenchido deve ser >= Data de Ida | Habilita o toggle "Ida e Volta". |
| **Nº de Passageiros** | Stepper (Input numérico) | Obrigatório, > 0 | - |
| **Botão Buscar** | Button | Habilitado apenas se todos os campos obrigatórios forem válidos | Dispara o caso de uso UC-001. |

#### Tela: Cadastro do Cliente

| Campo | Tipo | Validação | Mensagem de Erro |
|---|---|---|---|
| **Nome** | Text Input | Obrigatório, min 2 caracteres | "Informe seu nome." |
| **Sobrenome** | Text Input | Obrigatório, min 2 caracteres | "Informe seu sobrenome." |
| **E-mail** | Text Input (email) | Obrigatório, formato de e-mail válido, único no sistema | "Informe um e-mail válido." / "Este e-mail já está em uso." |
| **CPF** | Text Input (mask) | Obrigatório, formato de CPF válido (11 dígitos + cálculo de dígitos verificadores) | "CPF inválido." |
| **Data de Nascimento** | Date Picker | Obrigatório, idade >= 18 anos | "Você precisa ser maior de 18 anos." |
| **Telefone** | Text Input (mask) | Obrigatório, formato +55 XX XXXXX-XXXX | "Informe um telefone válido." |

### 6.2. Telas da Empresa Parceira (Painel Web)

#### Tela: Cadastro de Veículo

| Campo | Tipo | Validação | Ajuda/Contexto |
|---|---|---|---|
| **Modelo** | Text Input | Obrigatório | Ex: Marcopolo Paradiso G8 1800 DD |
| **Placa** | Text Input (mask) | Obrigatório, formato Mercosul ou antigo, única no sistema | "Esta placa já está cadastrada." |
| **Tipo de Veículo** | Select | Obrigatório (Ônibus, Micro-ônibus, Van) | - |
| **Capacidade** | Number Input | Obrigatório, > 0 | Número máximo de passageiros. |
| **Garagem Associada** | Select | Obrigatório | O veículo deve pertencer a uma garagem já cadastrada. |
| **Valor por KM** | Currency Input | Obrigatório, > 0 | Preço cobrado por quilômetro rodado. |
| **Custo de Saída Mínima** | Currency Input | Obrigatório, > 0 | Valor mínimo cobrado por viagem, independente da distância. Cobre custos fixos de mobilização. |
| **Participa do Pricing Dinâmico** | Toggle (Switch) | Padrão: Sim | Se ativo, o preço deste veículo pode ser ajustado automaticamente conforme oferta e demanda. Se desativado, preço é sempre fixo. |
| **Comodidades** | Checkbox Group | Opcional | Marque todas as comodidades que o veículo oferece. |
| **Fotos do Veículo** | File Upload (multiple) | Mínimo de 3 fotos (PNG, JPEG, max 5MB) | "É necessário enviar pelo menos 3 fotos." |

### 6.3. Telas de Disputa

#### Tela: Abertura de Disputa (Cliente — App/Web)

| Campo | Tipo | Validação | Comportamento |
|---|---|---|---|
| **Categoria do Problema** | Select | Obrigatório (Veículo Diferente, Atraso, Segurança, Motorista, Comodidades, No-Show Empresa, Outro) | Exibe campo de descrição contextual conforme categoria. |
| **Descrição** | Textarea | Obrigatório, min 20 caracteres, max 2000 caracteres | Placeholder muda conforme categoria selecionada. |
| **Evidências** | File Upload (multiple) | Opcional, max 5 arquivos, formatos PNG/JPEG/MP4, max 10MB cada | Preview das imagens/vídeos após upload. |
| **Botão Enviar** | Button | Habilitado quando categoria e descrição são válidos | Cria disputa e exibe confirmação. |

#### Tela: Gestão de Disputas (Super Admin — Painel Web)

| Componente | Tipo | Descrição |
|---|---|---|
| **Lista de Disputas** | Tabela com filtros | Filtros: status (Open, In Review, Escalated, Resolved), data, empresa, valor. Ordenação padrão: mais recentes primeiro. |
| **Detalhe da Disputa** | Painel lateral / Página | Exibe: dados da reserva, alegação do cliente com evidências, contestação da empresa com evidências, timeline de eventos. |
| **Ação de Resolução** | Select + Textarea | Select: Reembolso Total, Reembolso Parcial, Improcedente, Penalidade à Empresa. Textarea: justificativa obrigatória (min 50 caracteres). |
| **Campo % Reembolso** | Number Input | Visível apenas quando "Reembolso Parcial" selecionado. Range: 1-99%. |
| **Botão Resolver** | Button | Exige confirmação via modal antes de executar. |

### 6.4. Telas de Avaliação

#### Tela: Avaliar Viagem (Cliente — App/Web)

| Campo | Tipo | Validação | Comportamento |
|---|---|---|---|
| **Nota Geral** | Star Rating (1-5) | Obrigatório | Estrelas clicáveis com animação. |
| **Pontualidade** | Star Rating (1-5) | Obrigatório | - |
| **Estado do Veículo** | Star Rating (1-5) | Obrigatório | - |
| **Motorista** | Star Rating (1-5) | Obrigatório | - |
| **Custo-benefício** | Star Rating (1-5) | Obrigatório | - |
| **Comentário** | Textarea | Opcional. Se preenchido: min 10, max 500 caracteres | Contador de caracteres visível. |
| **Botão Enviar** | Button | Habilitado quando todas as notas obrigatórias preenchidas | Exibe confirmação e agradecimento. |

#### Tela: Avaliações da Empresa (Admin de Empresa — Painel Web)

| Componente | Tipo | Descrição |
|---|---|---|
| **Resumo de Avaliações** | Cards | Nota média geral, nota por categoria, total de avaliações. |
| **Lista de Avaliações** | Lista com filtros | Filtros: nota (1-5), período, com/sem resposta. Card de cada avaliação exibe: nome do cliente (primeiro nome + inicial), notas, comentário, data. |
| **Botão Responder** | Button | Visível apenas em avaliações sem resposta. Abre textarea inline (max 500 caracteres). |
| **Botão Contestar** | Button | Visível em todas avaliações. Abre modal com textarea para justificativa (min 50 caracteres). Envia para revisão do Super Admin. |

### 6.5. Tela de Conclusão de Viagem (Operador/Admin — Painel Web)

| Componente | Tipo | Validação | Comportamento |
|---|---|---|---|
| **Botão Registrar Embarque** | Button | Visível apenas para reservas `CONFIRMED` no dia da viagem | Atualiza status para `IN_PROGRESS`. Exige confirmação. |
| **Botão Registrar Conclusão** | Button | Visível apenas para reservas `IN_PROGRESS` | Atualiza status para `PENDING_COMPLETION`. Exige confirmação. |
| **Botão No-Show do Cliente** | Button (destaque vermelho) | Visível apenas para reservas `CONFIRMED` após horário de embarque | Abre modal com campo de observação (opcional). Aplica RN-FIN-003. |
| **Informações da Viagem** | Card resumo | - | Exibe: cliente, rota, horários, motorista alocado, veículo, valor. |
| **Status do Repasse** | Badge + Info | - | Exibe: valor do repasse, data prevista, status (Agendado, Processando, Pago, Bloqueado por Disputa). |

### 6.6. Tela: Pré-Cadastro de Empresa Parceira (Página Pública)

> Formulário wizard de 3 etapas acessível sem login na landing page "Seja um Parceiro".

#### Etapa 1 — Dados da Empresa

| Campo | Tipo | Validação | Mensagem de Erro |
|---|---|---|---|
| **Razão Social** | Text Input | Obrigatório, min 5 caracteres | "Informe a razão social da empresa." |
| **Nome Fantasia** | Text Input | Obrigatório, min 2 caracteres | "Informe o nome fantasia." |
| **CNPJ** | Text Input (mask XX.XXX.XXX/XXXX-XX) | Obrigatório, formato válido, único no sistema | "CNPJ inválido." / "Este CNPJ já possui cadastro." |
| **Endereço** | Autocomplete (Google Places) + campos complemento/número | Obrigatório | "Informe o endereço da empresa." |
| **Telefone Comercial** | Text Input (mask) | Obrigatório, formato +55 XX XXXX-XXXX | "Informe um telefone válido." |

#### Etapa 2 — Dados do Responsável

| Campo | Tipo | Validação | Mensagem de Erro |
|---|---|---|---|
| **Nome Completo** | Text Input | Obrigatório, min 5 caracteres | "Informe o nome completo." |
| **CPF** | Text Input (mask) | Obrigatório, formato válido | "CPF inválido." |
| **E-mail** | Text Input (email) | Obrigatório, formato válido, único | "E-mail inválido." / "Este e-mail já está em uso." |
| **Telefone Pessoal** | Text Input (mask) | Obrigatório | "Informe um telefone válido." |
| **Cargo** | Text Input | Obrigatório | "Informe seu cargo na empresa." |

#### Etapa 3 — Documentos e Frota

| Campo | Tipo | Validação | Ajuda |
|---|---|---|---|
| **Contrato Social** | File Upload | Obrigatório, PDF, max 10MB | "Envie o contrato social da empresa." |
| **Alvará de Funcionamento** | File Upload | Obrigatório, PDF, max 10MB | "Envie o alvará vigente." |
| **Autorização ANTT** | File Upload | Obrigatório, PDF, max 10MB | "Envie a autorização da ANTT." |
| **Quantidade de Veículos** | Select | Obrigatório (1-5, 6-15, 16-50, 50+) | "Quantos veículos sua frota possui?" |
| **Tipos de Veículos** | Checkbox Group | Obrigatório, ao menos 1 (Ônibus, Micro-ônibus, Van) | "Selecione os tipos de veículos da sua frota." |
| **Regiões de Atuação** | Multi-select por Estado | Obrigatório, ao menos 1 | "Selecione os estados onde sua empresa opera." |
| **Sobre a Empresa** | Textarea | Opcional, max 500 caracteres | "Conte um pouco sobre sua empresa e experiência no setor." |

#### Navegação do Wizard

| Componente | Comportamento |
|---|---|
| **Indicador de progresso** | Barra com 3 etapas (1. Empresa, 2. Responsável, 3. Documentos). Etapas concluídas em verde. |
| **Botão Próximo** | Habilitado apenas se todos os campos obrigatórios da etapa forem válidos. Salva dados localmente (não perde se navegar). |
| **Botão Voltar** | Permite retornar a etapas anteriores sem perder dados preenchidos. |
| **Botão Enviar Cadastro** | Visível apenas na etapa 3. Exibe modal de confirmação com resumo de todos os dados antes de enviar. |
| **Tela de Sucesso** | Após envio: "🎉 Cadastro enviado com sucesso! Nosso time analisará em até 48h. Você receberá uma resposta no e-mail informado." |

### 6.7. Tela: Fila de Aprovação de Empresas (Super Admin — Painel Web)

| Componente | Tipo | Descrição |
|---|---|---|
| **Lista de Solicitações** | Tabela com filtros | Colunas: Razão Social, CNPJ, Data da Solicitação, Região, Qtd Veículos, Status. Filtros: status (Pending, Approved, Rejected, Pending Documents), região, data. Ordenação padrão: mais antigas primeiro (FIFO). |
| **Card de Detalhe** | Painel lateral expandível | Exibe todos os dados do formulário em 3 seções (Empresa, Responsável, Documentos). Documentos com preview inline (PDF viewer). |
| **Definir Taxas** | Formulário inline | Campos: Taxa de Assinatura Mensal (R$), Taxa de Serviço por Transação (R$). Preenchimento obrigatório antes de aprovar. |
| **Botão Aprovar** | Button (verde) | Exige que taxas estejam definidas. Abre modal de confirmação. |
| **Botão Recusar** | Button (vermelho) | Abre modal com textarea obrigatória para motivo da recusa (min 20 caracteres). |
| **Botão Solicitar Documentos** | Button (amarelo) | Abre modal com textarea para descrever documentos faltantes. Altera status para `PENDING_DOCUMENTS`. |
| **Métricas no topo** | Cards resumo | Pendentes de aprovação, Aprovadas este mês, Recusadas este mês, Tempo médio de análise. |

### 6.8. Tela: Bilhete Digital / QR Code (Cliente — App/Web)

| Componente | Tipo | Descrição |
|---|---|---|
| **QR Code** | Imagem SVG/PNG (tamanho grande, centralizado) | QR Code criptografado. Funciona offline (cacheado no device). Botão "Aumentar" para tela cheia. |
| **Código Legível** | Texto destacado | Ex: `BV-2026-A3K9`. Para validação verbal caso QR Code não funcione. |
| **Dados da Viagem** | Card resumo | Origem → Destino, Data/Hora de embarque, Nº de passageiros. |
| **Dados do Veículo** | Card resumo | Empresa, Modelo, Placa, Motorista designado, Telefone de contato. |
| **Botão "Compartilhar"** | Share button | Permite compartilhar o bilhete via WhatsApp, email ou salvar como imagem. |
| **Botão "Baixar PDF"** | Download button | Gera PDF formatado do bilhete para impressão. |
| **Status do Bilhete** | Badge | "Válido", "Utilizado em [data]", "Cancelado". |

### 6.9. Tela: Validação de QR Code (Motorista/Operador — App/Web Mobile)

| Componente | Tipo | Descrição |
|---|---|---|
| **Scanner de QR Code** | Câmera do device | Abre câmera automaticamente ao acessar a tela. Área de scan com guia visual. |
| **Campo de Código Manual** | Text Input | Alternativa ao scan: digitar o código legível (ex: BV-2026-A3K9). |
| **Resultado — Válido** | Card verde | "✅ Bilhete Válido" + nome do cliente + detalhes resumidos da viagem. Botão "Confirmar Embarque" para registrar. |
| **Resultado — Inválido** | Card vermelho | "❌ Bilhete Inválido" + motivo (cancelado, data errada, não encontrado). |
| **Resultado — Já Utilizado** | Card amarelo | "⚠️ Já utilizado em [data/hora]". Para prevenir duplicação. |

### 6.10. Tela: Resultados de Busca e Comparação (Cliente — App/Web)

> Esta é a tela central do modelo Trivago — onde o cliente compara lado a lado todas as opções disponíveis.

#### Layout

| Componente | Tipo | Descrição |
|---|---|---|
| **Resumo da Busca** | Header fixo | Exibe: Origem → Destino, Data(s), Nº Passageiros. Botão "Editar busca" para voltar ao formulário sem perder dados. |
| **Contador de Resultados** | Texto | "23 veículos disponíveis para sua viagem". |
| **Barra de Ordenação** | Select / Tabs | Opções: Menor Preço, Maior Avaliação, Mais Relevante (padrão — algoritmo que pondera preço + avaliação + taxa cancelamento). |
| **Filtros Laterais (Desktop) / Bottom Sheet (Mobile)** | Painel de filtros | Ver tabela de filtros abaixo. |
| **Lista de Cards de Veículo** | Lista vertical | Um card por veículo. Ver tabela de card abaixo. |
| **Indicador de Carregamento** | Skeleton / Spinner | Exibido enquanto a cotação é processada. |
| **Estado Vazio** | Ilustração + Texto | "Nenhum veículo disponível para esta rota e data. Tente alterar os filtros ou as datas." |

#### Filtros

| Filtro | Tipo | Opções |
|---|---|---|
| **Tipo de Veículo** | Checkbox | Ônibus, Micro-ônibus, Van |
| **Faixa de Preço** | Range Slider | Min R$ — Max R$ (limites calculados dinamicamente dos resultados) |
| **Avaliação Mínima** | Star select | 3+, 4+, 4.5+ estrelas |
| **Comodidades** | Checkbox | Wi-Fi, Ar-condicionado, Banheiro, TV, Tomada USB (lista dinâmica) |
| **Empresa** | Checkbox | Lista de empresas com resultados (com contagem) |

#### Card de Veículo (cada resultado)

| Componente | Tipo | Descrição |
|---|---|---|
| **Foto Principal** | Imagem | Primeira foto do veículo. Carousel de 3 fotos ao passar o mouse (desktop) ou swipe (mobile). |
| **Nome do Veículo** | Texto bold | Ex: "Marcopolo Paradiso G8 1800 DD" |
| **Empresa** | Texto + Logo | Nome da empresa com mini-logo. Link para perfil da empresa. |
| **Avaliação** | Estrelas + Número | Ex: ★★★★☆ 4.2 (48 avaliações). Clicável para ver avaliações. |
| **Capacidade** | Badge | Ex: "46 lugares" |
| **Comodidades** | Ícones inline | Ícones das 4-5 principais comodidades. "+3 mais" se houver excedente. |
| **Preço** | Texto destaque (grande) | Preço final em destaque. Ex: "R$ 3.200,00" |
| **Indicador de Pricing** | Badge colorido | 🟢 "Melhor preço" / 🟡 "Alta procura +20%" / 🟠 "Procura muito alta +45%" / Sem badge se normal. |
| **Preço Original** | Texto riscado (opcional) | Visível apenas quando multiplicador ≠ 1.0x. Ex: "~~R$ 4.000,00~~ R$ 3.200,00" (promoção) ou "R$ 2.800,00 → R$ 3.360,00" (surge). |
| **Tempo de Viagem** | Texto secundário | Ex: "~6h de viagem • 450 km" |
| **Botão "Ver Detalhes"** | Button | Navega para a tela de detalhes do veículo (6.11). |
| **Selo "Preço Travado"** | Timer sutil | "Preço garantido por mais 28 min". Countdown do travamento de cotação (RN-PRICE-006). |

### 6.11. Tela: Detalhes do Veículo (Cliente — App/Web)

> Página completa do veículo onde o cliente confirma todas as informações antes de solicitar reserva.

#### Seção 1 — Galeria e Identificação

| Componente | Tipo | Descrição |
|---|---|---|
| **Galeria de Fotos** | Carousel full-width | Todas as fotos do veículo. Navegação por setas ou swipe. Botão "Ver todas" abre lightbox. |
| **Nome do Veículo** | H1 | Modelo completo. |
| **Empresa** | Link + Logo | Nome da empresa, logo, nota média. Link para perfil público da empresa. |
| **Badge Tipo** | Badge | "Ônibus", "Micro-ônibus" ou "Van". |
| **Capacidade** | Texto | "Até 46 passageiros". |

#### Seção 2 — Preço e Ação

| Componente | Tipo | Descrição |
|---|---|---|
| **Preço Final** | Texto grande, destaque | "R$ 3.200,00" com indicador de pricing dinâmico (se aplicável). |
| **Detalhamento de Preço** | Accordion/expandível | Ao expandir: "Custo de Saída Mínima: R$ 500 • KM rodado: 450 km × R$ 6,00 = R$ 2.700 • Multiplicador: 1.0x (normal) • Total: R$ 3.200,00". |
| **Timer de Preço Travado** | Countdown | "Este preço está garantido por mais 24 min". |
| **Botão "Solicitar Reserva"** | Button primário (CTA) | Destaque visual. Dispara UC-001 passo 6. Desabilitado se KYC não verificado (exibe tooltip). |
| **Adicionais Disponíveis** | Lista com checkboxes + preço | Ex: "☐ Guia turístico (+R$ 300) ☐ Cooler com bebidas (+R$ 15/pessoa)". Atualiza preço final em tempo real ao selecionar. |

#### Seção 3 — Comodidades

| Componente | Tipo | Descrição |
|---|---|---|
| **Lista de Comodidades** | Grid de ícones + texto | Todas as comodidades com ícone e nome. Ex: "🌐 Wi-Fi • ❄️ Ar-condicionado • 🚻 Banheiro • 📺 TV • 🔌 Tomada USB". |

#### Seção 4 — Sobre a Empresa

| Componente | Tipo | Descrição |
|---|---|---|
| **Nome e Logo** | Card | Razão social, logo, regiões de atuação. |
| **Nota Média** | Estrelas + número | Nota geral + número total de avaliações. |
| **Notas por Categoria** | Mini barras | Pontualidade, Estado do Veículo, Motorista, Custo-benefício. |
| **Últimas 3 Avaliações** | Lista resumida | Nome (primeiro nome + inicial), nota, trecho do comentário, data. |
| **Botão "Ver Todas as Avaliações"** | Link | Navega para lista completa de avaliações da empresa. |

#### Seção 5 — Detalhes da Rota

| Componente | Tipo | Descrição |
|---|---|---|
| **Mapa da Rota** | Google Maps embed | Mapa visual com origem, destino, paradas e rota traçada. |
| **Resumo da Rota** | Texto | Distância total, tempo estimado, paradas incluídas. |
| **Endereço da Garagem** | Texto + mapa | Localização da garagem de onde o veículo sairá. |

### 6.12. Tela: Minhas Viagens (Cliente — App/Web)

> Hub central do cliente para acompanhar todas as suas viagens.

| Componente | Tipo | Descrição |
|---|---|---|
| **Tabs de Status** | Tab bar | "Próximas" (padrão), "Em Andamento", "Concluídas", "Canceladas". Cada tab com contador (ex: "Próximas (2)"). |
| **Card de Viagem** | Lista de cards | Um card por reserva. Ver detalhes do card abaixo. |
| **Estado Vazio** | Ilustração + CTA | "Você ainda não tem viagens. Que tal buscar a primeira?" + Botão "Buscar Veículos". |

#### Card de Viagem (por status)

| Componente | Comportamento por Status |
|---|---|
| **Rota** | Sempre visível: "São Paulo → Rio de Janeiro" |
| **Data/Hora** | Sempre visível: "15 Mar 2026 • 08:00" |
| **Empresa + Veículo** | Sempre visível: "TransTur • Marcopolo Paradiso G8" |
| **Preço** | Sempre visível: "R$ 3.200,00" |
| **Status Badge** | Cor por status: 🟡 Aguardando Aprovação, 🔵 Aguardando Pagamento, 🟢 Confirmada, 🔵 Em Andamento, ✅ Concluída, 🔴 Cancelada |
| **Botão "Pagar Agora"** | Visível apenas em `PENDING_PAYMENT` |
| **Botão "Ver Bilhete"** | Visível em `CONFIRMED` e `IN_PROGRESS` — abre tela 6.8 |
| **Botão "Avaliar"** | Visível em `COMPLETED` se ainda não avaliou e dentro do prazo de 7 dias |
| **Botão "Reportar Problema"** | Visível em `COMPLETED` dentro do prazo de 72h (disputa) |
| **Botão "Cancelar"** | Visível em `PENDING_APPROVAL`, `PENDING_PAYMENT`, `CONFIRMED` |
| **Info de Reembolso** | Visível em `CANCELLED_BY_CLIENT` e `CANCELLED_BY_COMPANY`: valor reembolsado, método, status |

### 6.13. Tela: Perfil / Minha Conta (Cliente — App/Web)

| Seção | Componentes | Descrição |
|---|---|---|
| **Dados Pessoais** | Nome, Sobrenome, E-mail (read-only), Telefone, CPF (read-only), Data de Nascimento. Botão "Editar" habilita campos editáveis. | Dados cadastrais do cliente. CPF e e-mail não editáveis após verificação. |
| **Status KYC** | Badge: "✅ Verificado", "🟡 Pendente", "❌ Não Verificado". Botão "Verificar Identidade" se não verificado. | Status da verificação de identidade. |
| **Métodos de Pagamento** | Lista de cartões salvos (últimos 4 dígitos, bandeira, validade). Botão "Adicionar Cartão" (Stripe). Botão "Remover" por cartão. | Gerenciado via Stripe Customer Portal. |
| **Notificações** | Toggles: E-mail (promoções, lembretes), Push (atualizações de viagem), SMS (autenticação). | Preferências de comunicação. |
| **Termos e Políticas** | Links: "Termos de Uso", "Política de Privacidade", "Política de Cancelamento". | Links para documentos jurídicos. |
| **Excluir Conta** | Botão vermelho "Excluir Minha Conta". Abre modal: "Tem certeza? Todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita." Requer confirmação via SMS. | RN-SEC-004 (LGPD). |

### 6.14. Tela: Painel de Reservas (Admin/Operador de Empresa — Painel Web)

| Componente | Tipo | Descrição |
|---|---|---|
| **Tabs de Status** | Tab bar | "Novas Solicitações" (com badge contador), "Aguardando Pagamento", "Confirmadas", "Em Andamento", "Concluídas", "Canceladas/Recusadas". |
| **Tabela de Reservas** | Tabela com filtros | Colunas: Código da Reserva, Cliente, Rota, Data Viagem, Veículo, Motorista, Valor, Status, Ações. |
| **Filtros** | Inline | Período (date range), Veículo (select), Motorista (select), Busca por código ou nome do cliente. |
| **Ações por Status** | Botões contextuais | `PENDING_APPROVAL`: Aprovar / Recusar. `CONFIRMED`: Registrar Embarque / Cancelar. `IN_PROGRESS`: Registrar Conclusão. `PENDING_COMPLETION`: Aguardando confirmação do cliente. |
| **Detalhe da Reserva** | Painel lateral | Ao clicar na linha: detalhes completos (rota com mapa, dados do cliente, timeline de eventos, valor com breakdown, status do repasse). |
| **Calendário Visual** | Toggle view | Alternativa à tabela: visualização de calendário com reservas posicionadas por data (visão semanal/mensal). |
| **Exportar** | Botão | Exportar lista filtrada em CSV/Excel. |

### 6.15. Tela: Dashboards

#### 6.15.1. Dashboard do Super Admin Buscou Viajou

| Componente | Tipo | Descrição |
|---|---|---|
| **Seletor de Período** | Date Range Picker | Filtra todos os cards e gráficos por período. Atalhos: Hoje, Últimos 7 dias, Este mês, Este trimestre. |
| **Cards KPI (topo)** | 4-5 Cards numéricos | GMV do período, Receita líquida, Viagens concluídas, Empresas ativas, Taxa de conversão. Cada card com variação percentual vs período anterior (▲ verde / ▼ vermelho). |
| **Gráfico GMV** | Gráfico de Linha | Evolução do GMV diário/semanal/mensal com toggle. |
| **Gráfico Receita** | Gráfico de Barras empilhadas | Receita por fonte: assinatura vs taxa de serviço. |
| **Funil de Conversão** | Gráfico de Funil | Buscas → Cotações → Solicitações → Reservas Pagas → Concluídas. Com % de conversão entre etapas. |
| **NPS** | Gauge + Trend | NPS atual (clientes e parceiros separados) com tendência. |
| **Top Empresas** | Tabela ranking | Top 10 por GMV, com nota média e taxa de cancelamento. |
| **Disputas Ativas** | Card com link | Número de disputas abertas. Link direto para gestão. |
| **Solicitações de Parceria** | Card com link | Pendentes de aprovação. Link direto para fila. |
| **Mapa de Calor** | Google Maps | Rotas mais buscadas/reservadas por região. |

#### 6.15.2. Dashboard do Admin de Empresa

| Componente | Tipo | Descrição |
|---|---|---|
| **Seletor de Período** | Date Range Picker | Mesmo padrão do Super Admin. |
| **Cards KPI** | 4 Cards numéricos | Faturamento bruto, Repasses recebidos, Viagens realizadas, Nota média. |
| **Gráfico Faturamento** | Gráfico de Linha | Evolução diária/semanal/mensal. |
| **Repasses a Receber** | Tabela | Lista de repasses pendentes: reserva, valor, data prevista, status. |
| **Ocupação da Frota** | Gráfico de Barras horizontais | Um bar por veículo: % de dias com viagem no período. |
| **Últimas Avaliações** | Lista resumida | 5 avaliações mais recentes com nota, comentário e botão "Responder". |
| **Alertas** | Lista de notificações | Documentos vencendo, solicitações pendentes, disputas abertas. |

---

## 7. Especificação da API (Backend)

Esta seção define o contrato da API RESTful que servirá de base para a comunicação entre o frontend (App/Web) e o backend.

### 7.0. Convenções Gerais da API

#### Versionamento

Todos os endpoints são prefixados com `/v1/`. Exemplo: `POST /v1/quotes`. Futuras versões com breaking changes usarão `/v2/`.

#### Paginação

Todos os endpoints que retornam listas utilizam paginação cursor-based:

- **Request params:** `?cursor={cursor}&limit={limit}` (limit padrão: 20, máximo: 100)
- **Response:** `{ "data": [...], "pagination": { "next_cursor": "abc123", "has_more": true } }`

#### Filtros e Ordenação

Endpoints de listagem aceitam:
- `?status={status}` — filtro por status
- `?from={date}&to={date}` — filtro por período
- `?sort_by={field}&order={asc|desc}` — ordenação

#### Formato de Erro Padrão (RFC 7807)

```json
{
  "type": "https://api.viacao.com/errors/validation-error",
  "title": "Erro de Validação",
  "status": 422,
  "detail": "O campo CPF é inválido. Verifique os números digitados.",
  "instance": "/v1/users/register",
  "error_id": "err_xyz123",
  "errors": [
    { "field": "cpf", "message": "CPF inválido.", "code": "INVALID_CPF" }
  ]
}
```

#### Rate Limiting

| Perfil | Limite | Janela |
|---|---|---|
| Cliente (autenticado) | 100 requisições | por minuto |
| Admin/Operador (autenticado) | 200 requisições | por minuto |
| Não autenticado | 30 requisições | por minuto |

Headers de resposta: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

#### Autenticação

Todos os endpoints (exceto autenticação) requerem header `Authorization: Bearer {jwt_token}`. O JWT contém: `user_id`, `role`, `company_id` (se aplicável), `exp`.

### 7.1. Autenticação

- `POST /v1/auth/login/sms` : Envia um código de verificação para o telefone do cliente.
- `POST /v1/auth/verify/sms` : Valida o código SMS e retorna um JWT (JSON Web Token) para o cliente.
- `POST /v1/auth/login/admin` : Autenticação para usuários do painel (Admins, Operadores) com e-mail e senha. Retorna um JWT.
- `POST /v1/auth/refresh` : Renova o JWT usando um refresh token válido.
- `POST /v1/auth/logout` : Invalida o refresh token atual.

### 7.2. Cotação e Busca

- `POST /v1/quotes` : Endpoint principal de cotação. Recebe os dados da viagem e retorna uma lista de veículos disponíveis com preços.
  - **Request Body:** `{ "origin": {...}, "destination": {...}, "departureDate": "...", "returnDate": "...", "passengers": 25, "stops": [{...}] }`
  - **Response (200 OK):** `{ "data": [ { "vehicleId": "...", "companyName": "...", "companyRating": 4.5, "price": 4500.00, "amenities": [...], ... } ], "meta": { "routeDistanceKm": 450, "estimatedDurationHours": 6 } }`

### 7.3. Reservas (Bookings)

- `POST /v1/bookings` : Cria uma nova solicitação de reserva.
- `GET /v1/bookings` : Retorna o histórico de viagens do usuário logado. Suporta filtros: `?status={status}&from={date}&to={date}`.
- `GET /v1/bookings/{id}` : Retorna os detalhes de uma reserva específica.
- `POST /v1/bookings/{id}/approve` : (Admin/Operador Empresa) Aprova uma solicitação. **Request Body:** `{ "driverId": "..." }`
- `POST /v1/bookings/{id}/reject` : (Admin/Operador Empresa) Recusa uma solicitação. **Request Body:** `{ "reason": "..." }`
- `POST /v1/bookings/{id}/pay` : Inicia o processo de pagamento para uma reserva aprovada. Retorna `stripe_checkout_session_url`.
- `POST /v1/bookings/{id}/cancel` : Cancela uma reserva. Aplica política de cancelamento (RN-FIN-002 ou RN-FIN-007 conforme ator). **Request Body:** `{ "reason": "..." }`
- `POST /v1/bookings/{id}/start` : (Admin/Operador Empresa) Registra o início da viagem (embarque). Atualiza status para `IN_PROGRESS`.
- `POST /v1/bookings/{id}/complete` : (Admin/Operador Empresa) Registra a conclusão da viagem. Atualiza status para `PENDING_COMPLETION`.
- `POST /v1/bookings/{id}/confirm-completion` : (Cliente) Confirma a conclusão da viagem. Atualiza status para `COMPLETED`.
- `POST /v1/bookings/{id}/no-show-client` : (Admin/Operador Empresa) Registra no-show do cliente. Aplica RN-FIN-003.
- `POST /v1/bookings/{id}/no-show-company` : (Cliente) Reporta no-show da empresa. Cria disputa automaticamente.

### 7.4. Gestão de Frota (Admin Empresa)

- `GET, POST /v1/vehicles` : Lista e cria novos veículos.
- `GET, PUT, DELETE /v1/vehicles/{id}` : Detalha, atualiza e remove um veículo.
- `GET, POST /v1/vehicles/{id}/photos` : Lista e adiciona fotos ao veículo.
- `DELETE /v1/vehicles/{id}/photos/{photoId}` : Remove foto de um veículo.
- `GET, POST /v1/drivers` : Lista e cria novos motoristas.
- `GET, PUT, DELETE /v1/drivers/{id}` : Detalha, atualiza e remove um motorista.
- `GET, POST /v1/garages` : Lista e cria garagens da empresa.
- `GET, PUT, DELETE /v1/garages/{id}` : Detalha, atualiza e remove uma garagem.
- `GET, POST /v1/documents` : Lista e faz upload de documentos (veículos, motoristas, empresa). **Query params:** `?entity_type={vehicle|driver|company}&entity_id={id}`
- `GET, DELETE /v1/documents/{id}` : Detalha e remove documento.

### 7.5. Avaliações (Reviews)

- `POST /v1/bookings/{id}/review` : (Cliente) Cria uma avaliação para uma viagem concluída.
  - **Request Body:** `{ "overallRating": 5, "punctualityRating": 4, "vehicleRating": 5, "driverRating": 5, "valueRating": 4, "comment": "..." }`
- `GET /v1/companies/{id}/reviews` : Lista avaliações públicas de uma empresa. Suporta filtros: `?rating={1-5}&sort_by={date|rating}`.
- `POST /v1/reviews/{id}/respond` : (Admin Empresa) Responde publicamente a uma avaliação. **Request Body:** `{ "response": "..." }`
- `POST /v1/reviews/{id}/contest` : (Admin Empresa) Contesta uma avaliação para revisão do Super Admin. **Request Body:** `{ "reason": "..." }`
- `PUT /v1/reviews/{id}/moderate` : (Super Admin) Modera uma avaliação contestada. **Request Body:** `{ "action": "approve|remove", "reason": "..." }`

### 7.6. Disputas

- `POST /v1/bookings/{id}/dispute` : (Cliente) Abre uma disputa sobre uma viagem concluída.
  - **Request Body:** `{ "category": "VEHICLE_DIFFERENT|DELAY|SAFETY|DRIVER|AMENITIES|NO_SHOW_COMPANY|OTHER", "description": "...", "evidences": [file_ids] }`
- `GET /v1/disputes` : Lista disputas. (Super Admin: todas; Admin Empresa: da sua empresa; Cliente: as suas). Filtros: `?status={OPEN|IN_REVIEW|ESCALATED|RESOLVED}`.
- `GET /v1/disputes/{id}` : Detalhes de uma disputa com timeline de eventos.
- `POST /v1/disputes/{id}/contest` : (Admin Empresa) Envia contestação da empresa. **Request Body:** `{ "response": "...", "evidences": [file_ids] }`
- `POST /v1/disputes/{id}/resolve` : (Super Admin) Resolve a disputa. **Request Body:** `{ "resolution": "FULL_REFUND|PARTIAL_REFUND|DISMISSED|PENALTY", "refundPercentage": 50, "justification": "...", "penaltyAmount": 0 }`
- `POST /v1/disputes/{id}/escalate` : (Super Admin) Escala a disputa para análise jurídica.

### 7.7. Notificações

- `GET /v1/notifications` : Lista notificações do usuário logado. Filtros: `?read={true|false}`.
- `PUT /v1/notifications/{id}/read` : Marca uma notificação como lida.
- `PUT /v1/notifications/read-all` : Marca todas as notificações como lidas.

### 7.8. Conta do Usuário

- `GET /v1/users/me` : Retorna dados do perfil do usuário logado.
- `PUT /v1/users/me` : Atualiza dados do perfil.
- `POST /v1/users/me/delete` : (Cliente) Solicita exclusão da conta e dados pessoais (RN-SEC-004/LGPD). Requer confirmação via SMS.

### 7.9. Dashboard e Relatórios

- `GET /v1/admin/dashboard` : (Super Admin) Retorna métricas consolidadas: GMV, receita, viagens, conversão, NPS. **Query params:** `?period={daily|weekly|monthly}&from={date}&to={date}`
- `GET /v1/company/dashboard` : (Admin Empresa) Retorna métricas da empresa: faturamento, repasses, ocupação, viagens, avaliações. **Query params:** `?period={daily|weekly|monthly}&from={date}&to={date}`
- `GET /v1/admin/companies` : (Super Admin) Lista todas as empresas com filtros.
- `GET /v1/admin/transactions` : (Super Admin) Lista todas as transações com filtros.

### 7.10. Webhooks (Stripe)

O sistema deve registrar os seguintes webhooks do Stripe para processar eventos assíncronos:

| Evento Stripe | Ação do Sistema |
|---|---|
| `checkout.session.completed` | Atualiza reserva para `CONFIRMED`, registra transação, gera bilhete QR Code. |
| `charge.refunded` | Atualiza transação como reembolsada, notifica cliente. |
| `payment_intent.payment_failed` | Notifica cliente sobre falha, permite retry. |
| `account.updated` (Connect) | Atualiza status da conta conectada da empresa parceira. |
| `transfer.created` (Connect) | Registra confirmação de repasse para a empresa. |

### 7.11. Auto-Cadastro de Empresas Parceiras

- `POST /v1/partners/signup` : **(Público, sem autenticação)** Submete formulário de pré-cadastro de empresa parceira.
  - **Request Body:**
    ```json
    {
      "company": { "legalName": "...", "tradeName": "...", "cnpj": "...", "address": {...}, "phone": "..." },
      "representative": { "fullName": "...", "cpf": "...", "email": "...", "phone": "...", "role": "..." },
      "fleet": { "vehicleCount": "6-15", "vehicleTypes": ["BUS", "VAN"], "regions": ["SP", "RJ", "MG"] },
      "description": "...",
      "documents": { "socialContract": "file_id", "permit": "file_id", "antt": "file_id" }
    }
    ```
  - **Response (201 Created):** `{ "applicationId": "...", "status": "PENDING_APPROVAL", "message": "Cadastro recebido com sucesso." }`
- `POST /v1/partners/signup/upload` : **(Público)** Upload de documentos durante o pré-cadastro. Retorna `file_id` para referência no formulário.
- `GET /v1/admin/partner-applications` : **(Super Admin)** Lista solicitações de parceria. Filtros: `?status={PENDING_APPROVAL|APPROVED|REJECTED|PENDING_DOCUMENTS}`.
- `GET /v1/admin/partner-applications/{id}` : **(Super Admin)** Detalhes de uma solicitação.
- `POST /v1/admin/partner-applications/{id}/approve` : **(Super Admin)** Aprova solicitação. **Request Body:** `{ "monthlyFee": 199.90, "transactionFee": 49.90 }`
- `POST /v1/admin/partner-applications/{id}/reject` : **(Super Admin)** Recusa solicitação. **Request Body:** `{ "reason": "..." }`
- `POST /v1/admin/partner-applications/{id}/request-documents` : **(Super Admin)** Solicita documentos adicionais. **Request Body:** `{ "message": "..." }`
- `PUT /v1/partners/signup/{id}/update` : **(Público, via link no e-mail)** Atualiza solicitação com documentos ou dados corrigidos.

### 7.12. Bilhete Digital (QR Code)

- `GET /v1/bookings/{id}/ticket` : **(Cliente)** Retorna os dados do bilhete digital incluindo o QR Code (base64 SVG) e código legível.
  - **Response (200 OK):**
    ```json
    {
      "ticketCode": "BV-2026-A3K9",
      "qrCodeSvg": "<svg>...</svg>",
      "qrCodePng": "base64...",
      "status": "VALID",
      "booking": { "origin": "...", "destination": "...", "departureDate": "...", "vehicle": {...}, "driver": {...} }
    }
    ```
- `GET /v1/bookings/{id}/ticket/pdf` : **(Cliente)** Gera e retorna o bilhete em formato PDF para download/impressão.
- `POST /v1/tickets/validate` : **(Motorista/Operador)** Valida um QR Code ou código legível no embarque.
  - **Request Body:** `{ "qrPayload": "..." }` ou `{ "ticketCode": "BV-2026-A3K9" }`
  - **Response (200 OK):** `{ "valid": true, "booking": {...}, "client": { "firstName": "...", "lastName": "..." }, "autoCheckedIn": true }`
  - **Response (400):** `{ "valid": false, "reason": "ALREADY_USED|CANCELLED|EXPIRED|INVALID|WRONG_DATE" }`

### 7.13. Pricing Dinâmico

- `GET /v1/pricing/multiplier` : **(Interno/Debug)** Retorna o multiplicador atual para uma rota/data. **Query params:** `?origin_lat={}&origin_lng={}&destination_lat={}&destination_lng={}&date={}`
- `GET /v1/admin/pricing/events` : **(Super Admin)** Lista eventos de sazonalidade cadastrados.
- `POST /v1/admin/pricing/events` : **(Super Admin)** Cadastra evento que afeta pricing dinâmico. **Request Body:** `{ "name": "Carnaval 2026", "startDate": "...", "endDate": "...", "affectedRegions": ["SP", "RJ"], "minimumLevel": "HIGH" }`
- `PUT /v1/admin/pricing/settings` : **(Super Admin)** Atualiza configurações do pricing dinâmico (teto, piso, frequência de recálculo).

---

## 8. Modelo de Dados (SQL Schema)

O schema abaixo representa a estrutura detalhada do banco de dados relacional (PostgreSQL).

```sql
-- ============================================================
-- TABELAS CORE
-- ============================================================

-- Tabela de Empresas Parceiras
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    monthly_fee NUMERIC(10, 2) DEFAULT 0,
    transaction_fee NUMERIC(10, 2) DEFAULT 0,
    average_rating NUMERIC(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    cancellation_count INTEGER DEFAULT 0,
    max_installments INTEGER DEFAULT 12,
    -- Máximo de parcelas permitido (1 a 12)
    interest_free_installments INTEGER DEFAULT 1,
    -- Parcelas sem juros (1 = à vista, 3 = até 3x sem juros)
    stripe_account_id VARCHAR(255),
    -- Stripe Connect account ID
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL',
    -- PENDING_APPROVAL, ACTIVE, SUSPENDED, INACTIVE
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Endereços de Empresas
CREATE TABLE company_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(100),
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Usuários (Clientes e Admins)
CREATE TYPE user_role AS ENUM (
    'CLIENT', 'SUPER_ADMIN', 'COMPANY_ADMIN',
    'COMPANY_OPERATOR', 'COMPANY_FINANCIAL'
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    -- Nulo para Clientes e Super Admins
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    -- Nulo para clientes que usam apenas SMS
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    date_of_birth DATE,
    role user_role NOT NULL,
    kyc_status VARCHAR(50) NOT NULL DEFAULT 'NOT_VERIFIED',
    -- NOT_VERIFIED, PENDING, VERIFIED, REJECTED
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- GESTÃO DE FROTA
-- ============================================================

-- Tabela de Garagens
CREATE TABLE garages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(100),
    neighborhood VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Veículos
CREATE TYPE vehicle_type AS ENUM ('BUS', 'MINIBUS', 'VAN');

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE RESTRICT,
    plate VARCHAR(10) NOT NULL UNIQUE,
    model VARCHAR(255) NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    capacity INTEGER NOT NULL,
    price_per_km NUMERIC(10, 2) NOT NULL,
    min_departure_cost NUMERIC(10, 2) NOT NULL,
    -- Custo de Saída Mínima
    dynamic_pricing_enabled BOOLEAN DEFAULT true,
    -- Participa do pricing dinâmico?
    average_rating NUMERIC(3, 2) DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    -- ACTIVE, INACTIVE, MAINTENANCE, BLOCKED_DOCUMENT
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Fotos de Veículos
CREATE TABLE vehicle_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    file_url VARCHAR(500) NOT NULL,
    file_key VARCHAR(255) NOT NULL,
    -- S3/R2 key
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Comodidades (lookup)
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    -- Ex: Wi-Fi, Ar Condicionado, Banheiro, TV, Tomada USB
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true
);

-- Tabela de associação Veículo <-> Comodidades
CREATE TABLE vehicle_amenities (
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (vehicle_id, amenity_id)
);

-- Tabela de Motoristas
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    cnh_number VARCHAR(20) NOT NULL UNIQUE,
    cnh_category VARCHAR(5) NOT NULL,
    -- A, B, C, D, E
    cnh_expiry_date DATE NOT NULL,
    phone VARCHAR(20),
    photo_url VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    -- ACTIVE, INACTIVE, BLOCKED_DOCUMENT
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Adicionais / Extras
CREATE TYPE addon_pricing_type AS ENUM ('FIXED', 'PER_PERSON', 'PACKAGE');

CREATE TABLE addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    -- Ex: Guia turístico, Seguro viagem, Cooler com bebidas
    description TEXT,
    pricing_type addon_pricing_type NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- DOCUMENTOS
-- ============================================================

-- Tabela de Documentos (genérica para empresa, veículo e motorista)
CREATE TYPE document_entity_type AS ENUM ('COMPANY', 'VEHICLE', 'DRIVER');

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type document_entity_type NOT NULL,
    entity_id UUID NOT NULL,
    -- Referencia companies.id, vehicles.id ou drivers.id
    document_type VARCHAR(100) NOT NULL,
    -- Ex: CONTRATO_SOCIAL, ANTT, CRLV, CNH, SEGURO, ALVARA
    file_url VARCHAR(500) NOT NULL,
    file_key VARCHAR(255) NOT NULL,
    expiry_date DATE,
    -- Nulo para documentos sem vencimento
    status VARCHAR(50) NOT NULL DEFAULT 'VALID',
    -- VALID, EXPIRING_SOON, EXPIRED, PENDING_REVIEW
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES users(id)
);

-- Índice para busca rápida de documentos por entidade
CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);
-- Índice para job diário de verificação de vencimento
CREATE INDEX idx_documents_expiry ON documents(expiry_date) WHERE expiry_date IS NOT NULL;

-- ============================================================
-- RESERVAS E VIAGENS
-- ============================================================

-- Tabela de Reservas
CREATE TYPE booking_status AS ENUM (
    'PENDING_APPROVAL', 'PENDING_PAYMENT', 'CONFIRMED',
    'IN_PROGRESS', 'PENDING_COMPLETION', 'COMPLETED',
    'CANCELLED_BY_CLIENT', 'CANCELLED_BY_COMPANY',
    'REJECTED', 'EXPIRED', 'NO_SHOW_CLIENT', 'NO_SHOW_COMPANY'
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    driver_id UUID REFERENCES drivers(id),
    -- Alocado na aprovação
    status booking_status NOT NULL,
    is_round_trip BOOLEAN DEFAULT false,
    total_price NUMERIC(10, 2) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    -- Preço antes do multiplicador dinâmico
    dynamic_multiplier NUMERIC(3, 2) NOT NULL DEFAULT 1.0,
    -- Multiplicador aplicado
    platform_fee NUMERIC(10, 2) NOT NULL,
    -- Taxa de serviço Buscou Viajou
    company_payout NUMERIC(10, 2) NOT NULL,
    -- Valor a repassar para empresa
    security_deposit NUMERIC(10, 2) NOT NULL,
    total_distance_km NUMERIC(10, 2) NOT NULL,
    estimated_duration_hours NUMERIC(5, 2),
    origin_address TEXT NOT NULL,
    origin_latitude NUMERIC(10, 7),
    origin_longitude NUMERIC(10, 7),
    destination_address TEXT NOT NULL,
    destination_latitude NUMERIC(10, 7),
    destination_longitude NUMERIC(10, 7),
    departure_date TIMESTAMPTZ NOT NULL,
    return_date TIMESTAMPTZ,
    actual_start_at TIMESTAMPTZ,
    -- Registrado no embarque
    actual_end_at TIMESTAMPTZ,
    -- Registrado na conclusão
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES users(id),
    cancelled_at TIMESTAMPTZ,
    rejection_reason TEXT,
    payout_scheduled_date DATE,
    payout_status VARCHAR(50) DEFAULT 'PENDING',
    -- PENDING, SCHEDULED, PROCESSING, PAID, BLOCKED
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Paradas Intermediárias
CREATE TABLE booking_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    stop_order INTEGER NOT NULL,
    -- Ordem da parada no itinerário
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Adicionais Selecionados na Reserva
CREATE TABLE booking_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    addon_id UUID NOT NULL REFERENCES addons(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- FINANCEIRO
-- ============================================================

-- Tabela de Transações Financeiras
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    stripe_transfer_id VARCHAR(255),
    -- Para repasses via Stripe Connect
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    type VARCHAR(50) NOT NULL,
    -- PAYMENT, REFUND, PARTIAL_REFUND, DEPOSIT_HOLD,
    -- DEPOSIT_RELEASE, PAYOUT, PENALTY
    status VARCHAR(50) NOT NULL,
    -- PENDING, SUCCEEDED, FAILED, CANCELLED
    refund_percentage NUMERIC(5, 2),
    -- Para reembolsos parciais
    metadata JSONB,
    -- Dados extras (motivo do reembolso, etc.)
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- AVALIAÇÕES
-- ============================================================

-- Tabela de Avaliações
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id),
    client_id UUID NOT NULL REFERENCES users(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    overall_rating SMALLINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    punctuality_rating SMALLINT NOT NULL CHECK (punctuality_rating BETWEEN 1 AND 5),
    vehicle_rating SMALLINT NOT NULL CHECK (vehicle_rating BETWEEN 1 AND 5),
    driver_rating SMALLINT NOT NULL CHECK (driver_rating BETWEEN 1 AND 5),
    value_rating SMALLINT NOT NULL CHECK (value_rating BETWEEN 1 AND 5),
    comment TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED',
    -- PUBLISHED, PENDING_MODERATION, UNDER_REVIEW, REMOVED
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Respostas às Avaliações
CREATE TABLE review_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL UNIQUE REFERENCES reviews(id) ON DELETE CASCADE,
    responder_id UUID NOT NULL REFERENCES users(id),
    -- Admin de Empresa
    response TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- DISPUTAS
-- ============================================================

-- Tabela de Disputas
CREATE TYPE dispute_status AS ENUM (
    'OPEN', 'IN_REVIEW', 'ESCALATED', 'RESOLVED'
);

CREATE TYPE dispute_category AS ENUM (
    'VEHICLE_DIFFERENT', 'DELAY', 'SAFETY', 'DRIVER',
    'AMENITIES', 'NO_SHOW_COMPANY', 'OTHER'
);

CREATE TYPE dispute_resolution AS ENUM (
    'FULL_REFUND', 'PARTIAL_REFUND', 'DISMISSED', 'PENALTY'
);

CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    client_id UUID NOT NULL REFERENCES users(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    category dispute_category NOT NULL,
    description TEXT NOT NULL,
    status dispute_status NOT NULL DEFAULT 'OPEN',
    -- Contestação da empresa
    company_response TEXT,
    company_responded_at TIMESTAMPTZ,
    -- Resolução
    resolution dispute_resolution,
    resolution_justification TEXT,
    refund_percentage NUMERIC(5, 2),
    penalty_amount NUMERIC(10, 2),
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    -- Prazos
    company_response_deadline TIMESTAMPTZ NOT NULL,
    -- 48h após abertura
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Evidências de Disputas
CREATE TABLE dispute_evidences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    -- Cliente ou Admin Empresa
    file_url VARCHAR(500) NOT NULL,
    file_key VARCHAR(255) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    -- PNG, JPEG, MP4
    file_size_bytes INTEGER NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- NOTIFICAÇÕES
-- ============================================================

-- Tabela de Notificações
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    -- BOOKING_NEW, BOOKING_APPROVED, BOOKING_REJECTED, BOOKING_PAID,
    -- BOOKING_STARTED, BOOKING_COMPLETED, REVIEW_RECEIVED,
    -- DISPUTE_OPENED, DISPUTE_RESOLVED, PAYOUT_SCHEDULED,
    -- PAYOUT_COMPLETED, DOCUMENT_EXPIRING, DOCUMENT_EXPIRED
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    reference_type VARCHAR(50),
    -- BOOKING, DISPUTE, REVIEW, DOCUMENT, PAYOUT
    reference_id UUID,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read)
    WHERE is_read = false;

-- ============================================================
-- AUDITORIA
-- ============================================================

-- Tabela de Log de Auditoria (requisito LGPD)
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    -- CREATE, UPDATE, DELETE, LOGIN, APPROVE, REJECT, CANCEL, etc.
    entity_type VARCHAR(50) NOT NULL,
    -- USER, COMPANY, VEHICLE, BOOKING, TRANSACTION, etc.
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);

-- ============================================================
-- CONFIGURAÇÕES DO SISTEMA
-- ============================================================

-- Tabela de Configurações Globais (Super Admin)
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- AUTO-CADASTRO DE EMPRESAS PARCEIRAS
-- ============================================================

-- Tabela de Solicitações de Parceria (Self-Service Onboarding)
CREATE TYPE partner_application_status AS ENUM (
    'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'PENDING_DOCUMENTS'
);

CREATE TABLE partner_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Dados da Empresa
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    address_street VARCHAR(255),
    address_number VARCHAR(20),
    address_complement VARCHAR(100),
    address_city VARCHAR(100),
    address_state VARCHAR(2),
    address_zip VARCHAR(10),
    company_phone VARCHAR(20),
    -- Dados do Responsável
    representative_name VARCHAR(255) NOT NULL,
    representative_cpf VARCHAR(14) NOT NULL,
    representative_email VARCHAR(255) NOT NULL,
    representative_phone VARCHAR(20) NOT NULL,
    representative_role VARCHAR(100),
    -- Frota estimada
    estimated_vehicle_count VARCHAR(20),
    -- '1-5', '6-15', '16-50', '50+'
    vehicle_types TEXT[],
    -- ARRAY['BUS', 'MINIBUS', 'VAN']
    operating_regions TEXT[],
    -- ARRAY['SP', 'RJ', 'MG']
    description TEXT,
    -- Documentos
    social_contract_file_url VARCHAR(500),
    permit_file_url VARCHAR(500),
    antt_file_url VARCHAR(500),
    -- Status e workflow
    status partner_application_status NOT NULL DEFAULT 'PENDING_APPROVAL',
    rejection_reason TEXT,
    additional_docs_request TEXT,
    -- Taxas definidas na aprovação
    approved_monthly_fee NUMERIC(10, 2),
    approved_transaction_fee NUMERIC(10, 2),
    -- Referência à empresa criada após aprovação
    company_id UUID REFERENCES companies(id),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_partner_applications_cnpj
    ON partner_applications(cnpj)
    WHERE status IN ('PENDING_APPROVAL', 'PENDING_DOCUMENTS', 'APPROVED');

-- ============================================================
-- BILHETE DIGITAL (QR CODE)
-- ============================================================

-- Tabela de Bilhetes Digitais
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id),
    ticket_code VARCHAR(20) NOT NULL UNIQUE,
    -- Ex: BV-2026-A3K9
    qr_payload TEXT NOT NULL,
    -- Payload criptografado para o QR Code
    qr_hash VARCHAR(64) NOT NULL,
    -- HMAC-SHA256 para validação
    status VARCHAR(20) NOT NULL DEFAULT 'VALID',
    -- VALID, USED, INVALIDATED
    used_at TIMESTAMPTZ,
    -- Timestamp de quando foi escaneado
    validated_by UUID REFERENCES users(id),
    -- Motorista/Operador que escaneou
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- PRICING DINÂMICO
-- ============================================================

-- Snapshots de demanda para cálculo do multiplicador
CREATE TABLE demand_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_hash VARCHAR(64) NOT NULL,
    -- Hash da combinação origem+destino (geohash)
    travel_date DATE NOT NULL,
    search_count INTEGER NOT NULL DEFAULT 0,
    -- Buscas nos últimos 15min
    available_vehicles INTEGER NOT NULL DEFAULT 0,
    -- Veículos disponíveis
    occupancy_rate NUMERIC(5, 2),
    -- Taxa de ocupação na região (0-100%)
    calculated_multiplier NUMERIC(3, 2) NOT NULL DEFAULT 1.0,
    snapshot_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_demand_snapshots_route_date
    ON demand_snapshots(route_hash, travel_date, snapshot_at DESC);

-- Eventos de sazonalidade que afetam o pricing
CREATE TABLE pricing_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    -- Ex: "Carnaval 2026", "Réveillon SP"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    affected_regions TEXT[],
    -- ARRAY['SP', 'RJ']
    minimum_multiplier_level VARCHAR(20) NOT NULL DEFAULT 'HIGH',
    -- NORMAL, HIGH, VERY_HIGH, PEAK
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cotações travadas (preço garantido por 30 min)
CREATE TABLE locked_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    base_price NUMERIC(10, 2) NOT NULL,
    multiplier NUMERIC(3, 2) NOT NULL,
    final_price NUMERIC(10, 2) NOT NULL,
    route_origin TEXT NOT NULL,
    route_destination TEXT NOT NULL,
    travel_date TIMESTAMPTZ NOT NULL,
    locked_until TIMESTAMPTZ NOT NULL,
    -- 30 min após cotação
    is_used BOOLEAN DEFAULT false,
    -- true quando convertida em reserva
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_locked_quotes_client ON locked_quotes(client_id, locked_until DESC);

-- Valores iniciais de configuração
INSERT INTO system_settings (key, value, description) VALUES
    ('approval_sla_hours', '24', 'Prazo em horas para empresa aprovar/recusar solicitação'),
    ('min_booking_advance_hours', '24', 'Antecedência mínima em horas para solicitar viagem'),
    ('dispute_window_hours', '72', 'Prazo em horas após conclusão para abrir disputa'),
    ('review_window_days', '7', 'Prazo em dias após conclusão para avaliar viagem'),
    ('completion_confirmation_hours', '24', 'Prazo para cliente confirmar conclusão da viagem'),
    ('company_dispute_response_hours', '48', 'Prazo para empresa contestar disputa'),
    ('default_payout_delay_days', '15', 'Prazo padrão D+N para repasse após conclusão'),
    ('cancel_full_refund_hours', '72', 'Cancelamento com reembolso total se > Xh de antecedência'),
    ('cancel_partial_refund_hours', '24', 'Cancelamento com 50% multa se entre X e Yh'),
    ('security_deposit_percentage', '10', 'Percentual do valor da viagem como depósito caução'),
    ('dynamic_pricing_max_multiplier', '2.0', 'Multiplicador máximo do pricing dinâmico'),
    ('dynamic_pricing_min_multiplier', '0.8', 'Multiplicador mínimo do pricing dinâmico'),
    ('dynamic_pricing_recalc_minutes', '15', 'Frequência de recálculo do multiplicador'),
    ('quote_lock_minutes', '30', 'Tempo em minutos que o preço cotado fica travado'),
    ('partner_review_sla_hours', '48', 'SLA para análise de solicitações de parceria');
```

---

## 9. Requisitos Não-Funcionais (NFRs)

Esta seção define os critérios de qualidade e as restrições operacionais do sistema.

| Categoria | ID | Requisito | Métrica de Aceite |
|---|---|---|---|
| **Performance** | NFR-01 | **Tempo de Resposta da API** | 95% das requisições à API devem ter um tempo de resposta inferior a 500ms. |
| | NFR-02 | **Tempo de Carregamento da Página** | As principais páginas da plataforma (Home, Resultados, Detalhes) devem ter um First Contentful Paint (FCP) inferior a 2 segundos. |
| **Escalabilidade** | NFR-03 | **Suporte a Usuários Concorrentes** | A plataforma deve suportar 1.000 usuários concorrentes sem degradação de performance. |
| | NFR-04 | **Escalabilidade da Base de Dados** | A arquitetura do banco de dados deve ser projetada para escalar horizontalmente para suportar o crescimento do número de empresas e reservas. |
| **Disponibilidade** | NFR-05 | **Uptime do Serviço** | A plataforma deve garantir um uptime de 99.8% (excluindo janelas de manutenção programadas). |
| **Segurança** | NFR-06 | **Conformidade com LGPD** | Todos os dados de usuários devem ser armazenados e tratados em conformidade com a Lei Geral de Proteção de Dados. |
| | NFR-07 | **Segurança de Senhas** | Todas as senhas de administradores devem ser armazenadas usando algoritmos de hash fortes (ex: bcrypt). |
| | NFR-08 | **Proteção contra Injeção de SQL** | Todas as queries ao banco de dados devem usar prepared statements ou ORM para prevenir ataques de SQL Injection. |
| **Manutenibilidade** | NFR-09 | **Cobertura de Testes** | O código do backend deve ter uma cobertura de testes unitários superior a 80%. |

---

## 10. Qualidade e Requisitos Globais

Esta seção detalha os requisitos transversais que garantem a qualidade, robustez e escalabilidade da plataforma em diferentes domínios.

### 10.1. Relatórios e Analytics

A plataforma deve fornecer painéis analíticos (dashboards) para os perfis `Super Admin Buscou Viajou` e `Admin de Empresa` com o objetivo de fornecer insights para a tomada de decisão estratégica e operacional.

#### Dashboard do Super Admin Buscou Viajou

| Métrica | Visualização | Descrição |
|---|---|---|
| **GMV (Gross Merchandise Volume)** | Gráfico de Linha (diário/semanal/mensal) | Valor total transacionado na plataforma. |
| **Receita da Plataforma** | Gráfico de Barras (por fonte: assinatura, taxa) | Receita líquida do Buscou Viajou. |
| **Novas Empresas Parceiras** | Número e Gráfico de Linha | Acompanhamento do onboarding de parceiros. |
| **Viagens Concluídas** | Número e Gráfico de Barras (por região/tipo de veículo) | Volume de viagens realizadas com sucesso. |
| **Taxa de Conversão** | Funil (Cotação → Reserva → Pagamento) | Eficiência do funil de vendas. |
| **NPS (Net Promoter Score)** | Gráfico de Gauge (separado para Clientes e Parceiros) | Medidor de satisfação e lealdade. |

#### Dashboard do Admin de Empresa

| Métrica | Visualização | Descrição |
|---|---|---|
| **Faturamento Bruto** | Gráfico de Linha (diário/semanal/mensal) | Valor total recebido pelas viagens. |
| **Repasses a Receber** | Tabela e Número | Valor líquido a ser repassado pelo Buscou Viajou. |
| **Taxa de Ocupação da Frota** | Gráfico de Pizza (por veículo) | Percentual de tempo em que os veículos estiveram em viagem. |
| **Viagens Realizadas** | Número e Tabela | Histórico de viagens com detalhes (cliente, rota, valor). |
| **Avaliações dos Clientes** | Média (estrelas) e Lista de Comentários | Feedback direto dos clientes sobre os serviços prestados. |

### 10.2. Acessibilidade (a11y)

A plataforma deve ser acessível a todos os usuários, incluindo pessoas com deficiências visuais, auditivas, motoras ou cognitivas. O desenvolvimento, especialmente do frontend, deve seguir as diretrizes do **WCAG (Web Content Accessibility Guidelines) 2.1**, nível **AA**.

| Diretriz | Requisito Chave | Exemplo de Implementação |
|---|---|---|
| **Perceptível** | **Alternativas em Texto:** Fornecer texto alternativo (`alt text`) para todas as imagens não-decorativas. | `<img src="..." alt="Ônibus Marcopolo Paradiso G8">` |
| **Operável** | **Navegação por Teclado:** Todos os elementos interativos (links, botões, formulários) devem ser totalmente acessíveis e operáveis utilizando apenas o teclado. | O foco do teclado deve ser visível e seguir uma ordem lógica. |
| **Compreensível** | **Rótulos e Instruções:** Todos os campos de formulário devem ter rótulos (`<label>`) associados. As mensagens de erro devem ser claras e descritivas. | `<label for="email">E-mail</label>` `<input id="email">` |
| **Robusto** | **Compatibilidade:** O código deve ser semanticamente correto (uso adequado de tags HTML5 como `<nav>`, `<main>`, `<header>`) para garantir a compatibilidade com tecnologias assistivas (leitores de tela). | Utilizar `<h1>` para o título principal, `<h2>` para seções, etc. |

### 10.3. Tratamento de Erros e Comunicação

Uma estratégia consistente para o tratamento de erros é fundamental para uma boa experiência do usuário. O sistema deve diferenciar claramente entre erros do cliente (validação) e erros inesperados do servidor.

- **Erros de Validação (4xx):** Devem ser exibidos de forma clara e contextual, próximos ao campo que causou o erro. As mensagens devem ser amigáveis e instruir o usuário sobre como corrigir o problema. Ex: "CPF inválido. Por favor, verifique os números digitados."
- **Erros de Servidor (5xx):** Em caso de falhas inesperadas no backend, o usuário não deve ser exposto a detalhes técnicos. Uma mensagem genérica, porém empática, deve ser exibida, juntamente com uma identificação única do erro (Error ID) que possa ser usada pela equipe de suporte para rastrear o problema nos logs.
  - **Exemplo de Mensagem:** "Oops! Algo deu errado. Nossa equipe já foi notificada e está trabalhando para resolver o problema. Por favor, tente novamente mais tarde. (ID do Erro: `xyz-123`)"
- **Notificações:** O sistema deve utilizar um componente de notificação padronizado (ex: "toast" ou "snackbar") para comunicar sucesso, alertas ou informações de forma não-intrusiva.

### 10.4. Catálogo de E-mails Transacionais

Todos os e-mails enviados pela plataforma devem seguir o template visual da Buscou Viajou (logo, cores, footer com links). Cada e-mail deve ter versão HTML e texto puro.

| ID | Evento Disparador | Destinatário | Assunto | Conteúdo Mínimo |
|---|---|---|---|---|
| **EMAIL-001** | Cadastro do cliente | Cliente | "Bem-vindo à Buscou Viajou!" | Nome, confirmação de cadastro, CTA para primeira busca. |
| **EMAIL-002** | Solicitação de reserva criada | Cliente | "Sua solicitação foi enviada" | Rota, datas, veículo, empresa, status "aguardando aprovação", prazo estimado. |
| **EMAIL-003** | Nova solicitação recebida | Admin/Operador Empresa | "Nova solicitação de viagem" | Resumo da viagem, dados do cliente (sem CPF), valor, CTA "Ver no painel". |
| **EMAIL-004** | Reserva aprovada | Cliente | "Sua reserva foi aprovada!" | Detalhes da viagem, motorista designado, valor, CTA "Pagar agora", prazo para pagamento. |
| **EMAIL-005** | Reserva recusada | Cliente | "Atualização sobre sua solicitação" | Motivo (se fornecido), CTA "Buscar outras opções". |
| **EMAIL-006** | Pagamento confirmado | Cliente | "Viagem confirmada! Aqui está seu bilhete" | Bilhete digital em PDF anexo, QR Code inline, todos os detalhes, CTA "Ver no app". |
| **EMAIL-007** | Viagem confirmada | Admin Empresa | "Viagem confirmada — detalhes" | Dados do cliente, rota, veículo, motorista, valor do repasse, data prevista. |
| **EMAIL-008** | Lembrete pré-viagem (24h antes) | Cliente + Empresa | "Sua viagem é amanhã!" | Resumo, horário de embarque, contato do motorista/empresa, link do bilhete. |
| **EMAIL-009** | Viagem concluída | Cliente | "Viagem concluída! Como foi?" | Resumo, CTA "Avaliar viagem", prazo de avaliação. |
| **EMAIL-010** | Solicitação de avaliação (lembrete 48h) | Cliente | "Conta pra gente como foi!" | Lembrete para avaliar, CTA direto para avaliação. |
| **EMAIL-011** | Cancelamento pelo cliente | Cliente | "Reserva cancelada" | Detalhes do cancelamento, política aplicada, valor do reembolso (se houver), prazo. |
| **EMAIL-012** | Cancelamento pela empresa | Cliente | "Sua viagem foi cancelada pela empresa" | Pedido de desculpas, reembolso integral confirmado, veículos alternativos (se disponíveis), CTA "Ver opções". |
| **EMAIL-013** | Repasse agendado | Admin Empresa | "Repasse agendado — R$ X.XXX,XX" | Reserva associada, valor bruto, taxa descontada, valor líquido, data do repasse. |
| **EMAIL-014** | Repasse concluído | Admin Empresa | "Repasse realizado com sucesso" | Confirmação com valor e dados bancários de destino. |
| **EMAIL-015** | Disputa aberta | Admin Empresa | "Uma disputa foi aberta sobre sua viagem" | Categoria, resumo, prazo de 48h para contestar, CTA "Responder no painel". |
| **EMAIL-016** | Disputa resolvida | Cliente + Empresa | "Disputa resolvida" | Decisão, justificativa, ação financeira (reembolso/liberação de repasse). |
| **EMAIL-017** | Documento vencendo (30 dias) | Admin Empresa | "Documento vence em 30 dias" | Documento, veículo/motorista associado, data de vencimento, CTA "Atualizar documento". |
| **EMAIL-018** | Documento vencido | Admin Empresa | "Documento vencido — veículo/motorista bloqueado" | Alerta de bloqueio, impacto operacional, CTA urgente. |
| **EMAIL-019** | Pré-cadastro recebido | Representante Empresa | "Recebemos seu cadastro!" | Confirmação, prazo de análise (48h), próximos passos. |
| **EMAIL-020** | Empresa aprovada | Representante Empresa | "Parabéns! Sua empresa foi aprovada" | Link para definir senha, guia de primeiros passos, taxas definidas. |
| **EMAIL-021** | Empresa recusada | Representante Empresa | "Atualização sobre seu cadastro" | Motivo, CTA "Corrigir e reenviar" (se aplicável). |
| **EMAIL-022** | Solicitação expirada | Cliente | "Sua solicitação expirou" | Explicação, CTA "Buscar novamente". |

### 10.5. Termos Jurídicos e Conformidade

A plataforma deve disponibilizar publicamente os seguintes documentos legais, acessíveis no footer de todas as páginas e no perfil do cliente:

| Documento | Descrição | Onde é Aceito |
|---|---|---|
| **Termos de Uso — Cliente** | Define as responsabilidades do cliente, da plataforma (intermediadora) e da empresa parceira. Inclui: limitação de responsabilidade, política de cancelamento, regras de uso, propriedade intelectual. | Aceite obrigatório no cadastro do cliente (checkbox com link). |
| **Termos de Uso — Empresa Parceira** | Define as obrigações da empresa, taxas, SLAs, penalidades por cancelamento, política de disputas, condições de suspensão/exclusão. | Aceite obrigatório no pré-cadastro da empresa (etapa 3). |
| **Política de Privacidade** | Em conformidade com a LGPD. Define: dados coletados, finalidade, compartilhamento com terceiros (Stripe, Google Maps), tempo de retenção, direitos do titular (acesso, correção, exclusão). | Aceite junto aos Termos de Uso. |
| **Política de Cancelamento e Reembolso** | Versão detalhada e em linguagem acessível das regras RN-FIN-002 e RN-FIN-007. Inclui exemplos práticos e tabela de prazos. | Exibida na tela de cancelamento e referenciada no e-mail de confirmação. |
| **Política de Cookies** | Descrição dos cookies utilizados (essenciais, analytics, marketing), com opção de gerenciamento via banner de consentimento. | Banner de cookies no primeiro acesso. |

### 10.6. SEO (Search Engine Optimization)

Para garantir a descoberta orgânica da plataforma, as seguintes diretrizes de SEO devem ser implementadas:

#### Páginas Públicas (indexáveis)

| Página | URL Pattern | Meta Title | Descrição |
|---|---|---|---|
| **Home** | `/` | "Buscou Viajou — Compare e Reserve Fretamento de Ônibus e Vans" | Landing principal com formulário de busca. |
| **Resultados de Busca** | `/busca?origem=...&destino=...` | "Fretamento São Paulo → Rio de Janeiro — Buscou Viajou" | Página de resultados (server-side rendered para SEO). |
| **Perfil da Empresa** | `/empresa/{slug}` | "{Nome da Empresa} — Fretamento na Buscou Viajou" | Perfil público com avaliações, frota, regiões. |
| **Seja um Parceiro** | `/seja-parceiro` | "Cadastre sua Empresa de Fretamento — Buscou Viajou" | Landing page do formulário de pré-cadastro. |
| **Blog/Conteúdo** | `/blog/{slug}` | Títulos dinâmicos por artigo | Conteúdo sobre turismo, rotas, dicas de viagem (estratégia de conteúdo). |

#### Requisitos Técnicos de SEO

| Requisito | Implementação |
|---|---|
| **Server-Side Rendering (SSR)** | Páginas públicas devem ser renderizadas no servidor (Next.js SSR ou SSG) para indexação correta pelo Google. |
| **Meta tags dinâmicas** | Cada página com `<title>`, `<meta description>`, `<meta og:title>`, `<meta og:description>`, `<meta og:image>` dinâmicos. |
| **Schema.org (Structured Data)** | JSON-LD nas páginas de empresa (`LocalBusiness`), resultados (`Product`), avaliações (`AggregateRating`). |
| **Sitemap XML** | Gerado automaticamente em `/sitemap.xml`. Inclui: home, páginas de empresa, landing de parceiros, blog. Atualizado diariamente. |
| **robots.txt** | Bloquear: painel admin, checkout, APIs. Permitir: páginas públicas, imagens. |
| **URLs amigáveis** | Slugs descritivos: `/empresa/transtur-sp` em vez de `/empresa/uuid-123`. |
| **Canonical tags** | Evitar conteúdo duplicado em resultados de busca com parâmetros diferentes. |
| **Performance (Core Web Vitals)** | LCP < 2.5s, FID < 100ms, CLS < 0.1 — alinhado com NFR-02. |
| **Imagens otimizadas** | Formato WebP, lazy loading, atributos `alt` descritivos (já coberto por a11y). Dimensões explícitas para evitar CLS. |
| **Mobile-first** | Design responsivo é obrigatório. Google indexa versão mobile primeiro. |

### 10.7. Jobs Agendados (Scheduled Tasks)

O sistema depende de tarefas executadas periodicamente para manter a integridade operacional.

| Job | Frequência | Descrição |
|---|---|---|
| **Verificação de Documentos** | Diário (02:00 UTC) | Verifica `documents.expiry_date`. Documentos vencendo em 30 dias: status `EXPIRING_SOON` + EMAIL-017. Documentos vencidos: status `EXPIRED` + bloqueia veículo/motorista (RN-SEC-001) + EMAIL-018. |
| **Expiração de Solicitações** | A cada 15 minutos | Verifica reservas `PENDING_APPROVAL` criadas há mais de X horas (RN-BOOK-002). Atualiza para `EXPIRED` + EMAIL-022. |
| **Expiração de Pagamento** | A cada 15 minutos | Verifica reservas `PENDING_PAYMENT` aprovadas há mais de 24h sem pagamento. Atualiza para `EXPIRED`. |
| **Auto-confirmação de Conclusão** | A cada 1 hora | Verifica reservas `PENDING_COMPLETION` há mais de 24h sem confirmação do cliente (RN-POST-002). Auto-confirma para `COMPLETED`. |
| **Recálculo de Pricing Dinâmico** | A cada 15 minutos | Calcula multiplicador por rota/data. Insere snapshot em `demand_snapshots`. Atualiza `locked_quotes` expiradas. |
| **Agendamento de Repasses** | Diário (06:00 UTC) | Identifica reservas `COMPLETED` sem disputa aberta onde `departure_date + payout_delay_days` ≤ hoje. Agenda transferência via Stripe Connect. |
| **Lembrete Pré-Viagem** | Diário (08:00 local) | Envia EMAIL-008 para reservas `CONFIRMED` com viagem nas próximas 24h. |
| **Lembrete de Avaliação** | Diário (10:00 local) | Envia EMAIL-010 para reservas `COMPLETED` há 48h sem avaliação. |
| **Limpeza de Cotações Travadas** | A cada 1 hora | Remove registros de `locked_quotes` com `locked_until` expirado e `is_used = false`. |
| **Relatório de Disputas** | Semanal (segunda, 08:00) | Envia relatório semanal ao Super Admin: disputas abertas, tempo médio de resolução, taxa de resolução. |

---

## 11. Backlog de Desenvolvimento (Roadmap)

O desenvolvimento do MVP será dividido em **8 sprints de 2 semanas cada**, totalizando **16 semanas**. O escopo inclui todas as funcionalidades especificadas neste PRD.

### Sprint 1: Fundação e Infraestrutura (2 semanas)

- **Épico:** Ambiente, banco de dados e autenticação.
- **User Stories:**
  - Como Super Admin, quero fazer login no painel com e-mail e senha.
  - Como Cliente, quero me cadastrar e fazer login via SMS (OTP).
- **Técnico:**
  - Configurar ambientes de desenvolvimento, staging e produção (AWS/GCP).
  - Implementar schema completo do banco de dados (todas as 27 tabelas).
  - Configurar Stripe Connect (conta master + webhooks).
  - Implementar autenticação JWT (SMS OTP via Twilio + email/senha para admins).
  - Configurar envio de e-mails transacionais (SendGrid/SES) com template base.
  - Configurar armazenamento de arquivos (S3/R2).
  - Implementar jobs agendados (scheduler) com as tarefas iniciais.
- **Entregáveis:** Ambiente rodando, banco criado, login funcional, pipelines CI/CD.

### Sprint 2: Auto-Cadastro de Empresas e Gestão Básica (2 semanas)

- **Épico:** Onboarding self-service de empresas parceiras + painel admin.
- **User Stories:**
  - Como representante de empresa, quero preencher o formulário de pré-cadastro em 3 etapas e enviar para aprovação.
  - Como Super Admin, quero ver a fila de solicitações de parceria e aprovar/recusar com definição de taxas.
  - Como Super Admin, quero solicitar documentos adicionais a uma empresa pendente.
  - Como Admin de Empresa (recém-aprovado), quero definir minha senha e acessar o painel pela primeira vez.
- **Técnico:**
  - Landing page "Seja um Parceiro" com formulário wizard (tela 6.6).
  - Tela de fila de aprovação (tela 6.7).
  - API de auto-cadastro (7.11).
  - Emails: EMAIL-019, EMAIL-020, EMAIL-021.
- **Entregáveis:** Fluxo completo de auto-cadastro → aprovação → acesso ao painel.

### Sprint 3: Gestão de Frota (2 semanas)

- **Épico:** Módulo de gestão de veículos, motoristas, garagens e documentos.
- **User Stories:**
  - Como Admin de Empresa, quero cadastrar garagens com endereço e localização.
  - Como Admin de Empresa, quero cadastrar veículos com fotos, comodidades, preço por KM, custo de saída mínima e opção de pricing dinâmico.
  - Como Admin de Empresa, quero cadastrar motoristas com CNH e documentos.
  - Como Admin de Empresa, quero gerenciar documentos (upload, vencimento, alertas).
  - Como Admin de Empresa, quero configurar adicionais/extras para meus veículos.
- **Técnico:**
  - Tela de cadastro de veículo (tela 6.2) com novos campos.
  - CRUD de garagens, motoristas, documentos, adicionais.
  - Job de verificação diária de documentos vencidos (RN-SEC-001).
  - Emails: EMAIL-017, EMAIL-018.
- **Entregáveis:** Empresa consegue cadastrar toda sua frota com preços.

### Sprint 4: Motor de Busca, Comparação e Pricing Dinâmico (2 semanas)

- **Épico:** Experiência "Trivago" — busca, comparação, pricing dinâmico.
- **User Stories:**
  - Como Cliente, quero preencher o formulário de busca e ver resultados comparáveis.
  - Como Cliente, quero filtrar por tipo de veículo, preço, avaliação e comodidades.
  - Como Cliente, quero ordenar por menor preço, melhor avaliação ou mais relevante.
  - Como Cliente, quero ver claramente quando há alta procura ou promoção no preço.
  - Como Cliente, quero ver a página de detalhes do veículo com fotos, comodidades, avaliações e breakdown de preço.
  - Como Super Admin, quero cadastrar eventos de sazonalidade que afetam o pricing.
- **Técnico:**
  - Integração Google Maps (Places API, Directions API) para cálculo de rotas.
  - Motor de precificação: `MAX(Custo Saída Mínima, KM × Valor/KM) + Adicionais` (RN-PRICE-001).
  - Engine de pricing dinâmico: cálculo de multiplicador, snapshots, travamento de cotação 30min.
  - Tela de resultados de busca (tela 6.10) com filtros, ordenação, cards e indicadores.
  - Tela de detalhes do veículo (tela 6.11) com galeria, preço, comodidades, avaliações, mapa.
  - API de cotação (7.2) e pricing dinâmico (7.13).
  - SSR para SEO nas páginas de resultados e perfil de empresa.
- **Entregáveis:** Cliente busca, compara e vê detalhes. Pricing dinâmico funcional.

### Sprint 5: Reserva, Aprovação e Pagamento (2 semanas)

- **Épico:** Fluxo completo de reserva, do "Solicitar Reserva" ao QR Code.
- **User Stories:**
  - Como Cliente, quero solicitar reserva com adicionais e ser notificado do status.
  - Como Admin/Operador, quero receber notificação, ver detalhes e aprovar/recusar alocando motorista.
  - Como Cliente, quero pagar a reserva aprovada (cartão/Pix) com opção de parcelamento.
  - Como Cliente, quero receber meu bilhete digital (QR Code) após pagamento.
  - Como Cliente, quero ver minhas viagens organizadas por status.
- **Técnico:**
  - Fluxo UC-001 completo com máquina de estados validada.
  - Integração Stripe Checkout (pagamento + pré-autorização caução).
  - Geração de QR Code (bilhete digital) e PDF.
  - Tela "Minhas Viagens" (tela 6.12).
  - Tela de painel de reservas para empresa (tela 6.14).
  - API de reservas completa (7.3) incluindo cancel, approve, reject, pay.
  - API de bilhete digital (7.12).
  - Emails: EMAIL-002 a EMAIL-008, EMAIL-011, EMAIL-022.
  - Jobs: expiração de solicitações e pagamentos.
- **Entregáveis:** Ciclo completo busca → reserva → pagamento → bilhete. Painel da empresa com gestão de reservas.

### Sprint 6: Fluxo Pós-Viagem, QR Code e Repasses (2 semanas)

- **Épico:** Embarque, conclusão, caução, repasses, QR Code validation.
- **User Stories:**
  - Como Motorista/Operador, quero escanear o QR Code do cliente para validar embarque.
  - Como Operador, quero registrar embarque e conclusão da viagem no painel.
  - Como Cliente, quero confirmar a conclusão da viagem ou contestar.
  - Como Admin de Empresa, quero ver meus repasses agendados e recebidos.
  - Como Cliente, quero ver o reembolso da caução após conclusão.
- **Técnico:**
  - Tela de validação QR Code para motorista (tela 6.9).
  - Tela de conclusão de viagem (tela 6.5).
  - Fluxo UC-006 completo: embarque → conclusão → confirmação → caução → repasse.
  - Agendamento de repasses via Stripe Connect.
  - Liberação automática de caução.
  - Emails: EMAIL-009, EMAIL-013, EMAIL-014.
  - Jobs: auto-confirmação de conclusão, agendamento de repasses.
- **Entregáveis:** Fluxo pós-viagem completo. Repasses funcionando.

### Sprint 7: Avaliações, Disputas e Cancelamento Bilateral (2 semanas)

- **Épico:** Confiança e resolução de conflitos.
- **User Stories:**
  - Como Cliente, quero avaliar a viagem com notas por categoria e comentário.
  - Como Admin de Empresa, quero ver e responder avaliações dos clientes.
  - Como Cliente, quero abrir uma disputa sobre uma viagem com evidências.
  - Como Admin de Empresa, quero contestar uma disputa enviando minha versão.
  - Como Super Admin, quero gerenciar disputas e emitir resoluções.
  - Como Cliente, quero ser reembolsado e notificado quando a empresa cancela minha viagem.
- **Técnico:**
  - UC-005 completo: avaliação, resposta, moderação, contestação.
  - UC-004 completo: abertura, contestação, resolução, escalonamento.
  - Cancelamento pela empresa (RN-FIN-007, RN-FIN-008) com reembolso automático.
  - Telas de avaliação (6.4), disputas (6.3).
  - API de avaliações (7.5) e disputas (7.6).
  - Emails: EMAIL-010, EMAIL-012, EMAIL-015, EMAIL-016.
  - Jobs: lembrete de avaliação, relatório semanal de disputas.
- **Entregáveis:** Sistema completo de reputação e resolução de conflitos.

### Sprint 8: Dashboards, Perfil, SEO e Polimento (2 semanas)

- **Épico:** Analytics, perfil do cliente, SEO, termos jurídicos e QA final.
- **User Stories:**
  - Como Super Admin, quero ver o dashboard com GMV, receita, conversão, NPS e mapa de calor.
  - Como Admin de Empresa, quero ver o dashboard com faturamento, ocupação, repasses e avaliações.
  - Como Cliente, quero gerenciar meu perfil, métodos de pagamento e excluir minha conta.
  - Como visitante, quero encontrar a Buscou Viajou no Google ao buscar fretamento.
- **Técnico:**
  - Dashboards (tela 6.15): gráficos, KPIs, funil, mapa de calor.
  - Tela de perfil/minha conta (tela 6.13) com exclusão LGPD.
  - API de dashboards (7.9).
  - SEO: SSR, meta tags dinâmicas, Schema.org, sitemap, robots.txt, URLs amigáveis.
  - Publicação dos termos jurídicos (Termos de Uso, Política de Privacidade, Cookies).
  - Banner de consentimento de cookies.
  - Testes de integração end-to-end em todos os fluxos.
  - Testes de carga para NFR-01/02/03.
  - QA geral, correção de bugs, polimento de UI.
  - Emails: EMAIL-001 (boas-vindas, que é o último restante).
- **Entregáveis:** Plataforma completa pronta para lançamento.

---

## 12. Regras de Negócio Consolidadas

Esta seção consolida todas as regras que governam o comportamento do sistema. Cada regra possui um ID único para rastreabilidade durante o desenvolvimento e testes.

### 12.1. Precificação e Cotação

| ID | Regra | Descrição Detalhada |
|---|---|---|
| **RN-PRICE-001** | Fórmula de Preço Base | O preço base é calculado pela fórmula: `MAX(Custo de Saída Mínima, KM Total × Valor/KM da Empresa) + Σ(Adicionais Selecionados)`. A distância total (KM Total) inclui: Garagem→Cliente + Trajeto Principal + Retorno Garagem. Se o cálculo por KM for inferior ao Custo de Saída Mínima, prevalece o custo de saída, protegendo a empresa em viagens curtas. |
| **RN-PRICE-002** | Pricing Dinâmico | Sobre o preço base, aplica-se um multiplicador dinâmico baseado em oferta e demanda: `Preço Final = Preço Base × Multiplicador`. O multiplicador varia de 0.8x (promoção) a 2.0x (pico), conforme regras RN-DYN-001 a RN-DYN-006. |
| **RN-PRICE-003** | Autonomia de Preço | Cada empresa parceira define seus próprios valores de `Valor/KM`, `Custo de Saída Mínima` e `Adicionais` para cada veículo. A empresa também pode optar por não participar do pricing dinâmico. |
| **RN-PRICE-004** | Paradas Múltiplas | Cada parada adicional informada pelo cliente é somada à rota principal para o cálculo da distância total. |
| **RN-PRICE-005** | Adicionais | Os adicionais podem ser configurados como: valor fixo por item, valor por pessoa, ou pacote pré-definido. |
| **RN-PRICE-006** | Travamento de Preço | O preço apresentado ao cliente na cotação é travado por **30 minutos**. Se a reserva for iniciada dentro desse prazo, o preço não sofre alteração mesmo que o multiplicador dinâmico mude. |

### 12.1.1. Pricing Dinâmico (Oferta e Demanda)

| ID | Regra | Descrição Detalhada |
|---|---|---|
| **RN-DYN-001** | Teto do Multiplicador | O multiplicador máximo é **2.0x**, configurável pelo Super Admin. Nenhum preço pode exceder o dobro do preço base. |
| **RN-DYN-002** | Piso do Multiplicador | O multiplicador mínimo é **0.8x**, garantindo rentabilidade mínima para a empresa parceira. |
| **RN-DYN-003** | Opt-out da Empresa | A empresa parceira pode optar por **não participar** do pricing dinâmico por veículo. Nesse caso, o multiplicador é sempre 1.0x. |
| **RN-DYN-004** | Frequência de Recálculo | O multiplicador é recalculado a cada **15 minutos** com base nos dados de busca e disponibilidade em tempo real. |
| **RN-DYN-005** | Travamento de Cotação | O preço cotado é válido por **30 minutos** a partir do momento da busca. Após esse prazo, o cliente deve realizar nova cotação. |
| **RN-DYN-006** | Eventos e Sazonalidade | Feriados nacionais e eventos regionais cadastrados pelo Super Admin disparam automaticamente o nível "Procura Alta" como piso para as rotas afetadas. |

### 12.2. Reserva e Operação

| ID | Regra | Descrição Detalhada |
|---|---|---|
| **RN-BOOK-001** | Aprovação Manual | Toda nova solicitação de reserva deve ser aprovada manualmente por um `Admin` ou `Operador` da empresa parceira. |
| **RN-BOOK-002** | SLA de Aprovação | A empresa parceira tem um prazo de **24 horas** (configurável pelo Super Admin) para aprovar ou recusar uma solicitação. Após esse prazo, a solicitação é automaticamente expirada. |
| **RN-BOOK-003** | Antecedência Mínima | O cliente só pode solicitar viagens com uma antecedência mínima de **24 horas** (parâmetro configurável pelo Super Admin). |
| **RN-BOOK-004** | Confirmação de Operação | A empresa deve registrar no sistema o início (embarque) e o término da viagem para que o fluxo financeiro seja processado corretamente. |
| **RN-BOOK-005** | Viagem Ida e Volta | Uma viagem de ida e volta é tratada como uma única reserva no sistema. |

### 12.2.1. Máquina de Estados da Reserva (Booking Status)

O enum `booking_status` possui 12 estados possíveis. As transições válidas são:

```
PENDING_APPROVAL ──→ PENDING_PAYMENT      (empresa aprova)
PENDING_APPROVAL ──→ REJECTED             (empresa recusa)
PENDING_APPROVAL ──→ EXPIRED              (SLA de 24h excede)
PENDING_APPROVAL ──→ CANCELLED_BY_CLIENT  (cliente cancela antes da aprovação)

PENDING_PAYMENT  ──→ CONFIRMED            (pagamento + caução ok)
PENDING_PAYMENT  ──→ CANCELLED_BY_CLIENT  (cliente cancela antes de pagar)
PENDING_PAYMENT  ──→ EXPIRED              (não paga em 24h)

CONFIRMED        ──→ IN_PROGRESS          (empresa registra embarque ou QR validado)
CONFIRMED        ──→ CANCELLED_BY_CLIENT  (cliente cancela — aplica RN-FIN-002)
CONFIRMED        ──→ CANCELLED_BY_COMPANY (empresa cancela — aplica RN-FIN-007)
CONFIRMED        ──→ NO_SHOW_CLIENT       (empresa registra no-show do cliente)
CONFIRMED        ──→ NO_SHOW_COMPANY      (cliente reporta no-show da empresa)

IN_PROGRESS      ──→ PENDING_COMPLETION   (empresa registra conclusão)

PENDING_COMPLETION ──→ COMPLETED          (cliente confirma OU auto-confirm após 24h)

— Estados finais (sem transições de saída): —
COMPLETED, CANCELLED_BY_CLIENT, CANCELLED_BY_COMPANY,
REJECTED, EXPIRED, NO_SHOW_CLIENT, NO_SHOW_COMPANY
```

**Transições inválidas (o sistema deve bloquear):** Qualquer transição não listada acima é inválida. Exemplos: `EXPIRED → CONFIRMED`, `REJECTED → PENDING_PAYMENT`, `COMPLETED → CANCELLED_BY_CLIENT`. O backend deve validar a transição antes de atualizar o status e retornar erro `422` se inválida.

### 12.3. Financeiro e Cancelamento

| ID | Regra | Descrição Detalhada |
|---|---|---|
| **RN-FIN-001** | Pagamento 100% Antecipado | A reserva só é confirmada após o pagamento integral do valor pelo cliente na plataforma. |
| **RN-FIN-002** | Política de Cancelamento | Padrão: Cancelamento com mais de 72h de antecedência resulta em 100% de reembolso. Entre 72h e 24h, aplica-se multa de 50%. Com menos de 24h, não há reembolso (100% de multa). |
| **RN-FIN-003** | Política de No-Show | Se o cliente não comparecer no local e horário combinados, a empresa marca a viagem como "no-show". Não há reembolso e a empresa recebe o repasse normalmente. |
| **RN-FIN-004** | Taxas de Parcelamento | As taxas de parcelamento do gateway de pagamento são repassadas integralmente ao cliente. O parcelamento é configurável por empresa. |
| **RN-FIN-005** | Método de Reembolso | Em caso de cancelamento com direito a reembolso, o valor é devolvido para o mesmo método de pagamento utilizado na compra. |
| **RN-FIN-006** | Prazo de Repasse | O repasse para a empresa parceira é realizado após a conclusão da viagem, em um prazo configurável pelo Super Admin (ex: D+15). |
| **RN-FIN-007** | Cancelamento pela Empresa Parceira | Se a empresa cancelar uma viagem confirmada: (a) o cliente recebe **reembolso integral imediato** em todos os cenários; (b) a empresa recebe penalidade financeira progressiva: com mais de 72h de antecedência = advertência; entre 72h e 24h = multa de 20% do valor da viagem; com menos de 24h = multa de 50% do valor + suspensão temporária de 48h na plataforma. O status da reserva é atualizado para `CANCELLED_BY_COMPANY`. |
| **RN-FIN-008** | Plano de Contingência por Cancelamento da Empresa | Quando uma empresa cancela, o sistema automaticamente: (1) reembolsa o cliente; (2) busca veículos alternativos disponíveis de outras empresas para a mesma rota e datas; (3) notifica o cliente com as opções de substituição ou reembolso definitivo. O cliente tem 12 horas para aceitar uma alternativa antes do reembolso ser processado definitivamente. |
| **RN-FIN-009** | Repasse Bloqueado por Disputa | Enquanto houver uma disputa `OPEN` ou `IN_REVIEW` associada a uma reserva, o repasse para a empresa parceira fica bloqueado (`payout_status = BLOCKED`). O repasse é liberado ou cancelado conforme resolução da disputa. |
| **RN-FIN-010** | Cálculo do Depósito Caução | O valor do depósito caução é calculado como **10% do preço total da viagem** (percentual configurável pelo Super Admin via `system_settings.security_deposit_percentage`). O valor mínimo da caução é R$ 100,00 e o máximo é R$ 5.000,00. A caução é cobrada como pré-autorização no cartão (não é debitada), e liberada automaticamente após conclusão da viagem sem disputas (RN-POST-003). |
| **RN-FIN-011** | Parcelamento | O cliente pode parcelar o pagamento em até **12x** no cartão de crédito. O número máximo de parcelas é configurável por empresa parceira (campo `max_installments` na tabela `companies`). Parcelas sem juros são definidas pela empresa; parcelas com juros seguem a taxa do gateway (Stripe). As taxas de parcelamento são sempre de responsabilidade do cliente. |

### 12.4. Segurança e Conformidade

| ID | Regra | Descrição Detalhada |
|---|---|---|
| **RN-SEC-001** | Bloqueio por Documento Vencido | O sistema verifica diariamente a validade dos documentos. Ativos (veículos, motoristas) com documentos vencidos são automaticamente desativados e não podem ser alocados para novas viagens. |
| **RN-SEC-002** | Obrigatoriedade de KYC | Nenhum cliente pode finalizar uma reserva sem antes ter seu status de identidade como `VERIFIED`. |
| **RN-SEC-003** | Obrigatoriedade de Caução | Nenhuma reserva é confirmada sem a pré-autorização bem-sucedida do depósito caução no cartão do cliente. |
| **RN-SEC-004** | Exclusão de Conta (LGPD) | O cliente pode solicitar a exclusão de sua conta e de todos os seus dados pessoais a qualquer momento. |

### 12.5. Disputas e Mediação

| ID | Regra | Descrição Detalhada |
|---|---|---|
| **RN-DISP-001** | Prazo de Abertura | O cliente pode abrir uma disputa em até **72 horas** (configurável pelo Super Admin) após a conclusão da viagem. Após esse prazo, a possibilidade expira. |
| **RN-DISP-002** | Bloqueio de Repasse | Ao abrir uma disputa, o repasse financeiro da reserva associada é automaticamente bloqueado até a resolução. |
| **RN-DISP-003** | Prazo de Contestação da Empresa | A empresa parceira tem **48 horas** para enviar sua contestação com evidências após a abertura de uma disputa. Caso não conteste, o Super Admin pode resolver com base apenas nas evidências do cliente. |
| **RN-DISP-004** | Alçada de Resolução | Apenas o `Super Admin Buscou Viajou` pode resolver disputas. As resoluções possíveis são: Reembolso Total, Reembolso Parcial (percentual configurável), Improcedente (repasse liberado), Penalidade à Empresa (multa financeira + impacto no ranking). |
| **RN-DISP-005** | Impacto no Ranking | Disputas resolvidas a favor do cliente impactam negativamente a nota interna da empresa (não visível ao público, mas afeta posicionamento nos resultados). Mais de 3 disputas procedentes em 30 dias dispara revisão automática da parceria pelo Super Admin. |

### 12.6. Avaliações

| ID | Regra | Descrição Detalhada |
|---|---|---|
| **RN-REV-001** | Elegibilidade para Avaliar | Somente clientes com reservas no status `COMPLETED` podem avaliar. Cada reserva pode ser avaliada uma única vez. |
| **RN-REV-002** | Prazo de Avaliação | O cliente tem **7 dias** após a conclusão da viagem para avaliar. Após esse prazo, a possibilidade expira. O sistema envia lembrete após 48h sem avaliação. |
| **RN-REV-003** | Imutabilidade | Uma avaliação publicada não pode ser editada ou excluída pelo cliente. Apenas o Super Admin pode remover avaliações após moderação. |
| **RN-REV-004** | Moderação | Avaliações que contenham linguagem ofensiva (filtro automático) são retidas para moderação antes da publicação. A empresa pode contestar avaliações que considere falsas ou injustas, encaminhando para revisão do Super Admin. |
| **RN-REV-005** | Cálculo da Nota Média | A nota média da empresa e do veículo é recalculada automaticamente a cada nova avaliação usando média ponderada simples de todas as avaliações com status `PUBLISHED`. A nota é exibida nos resultados de busca e na página de detalhes. |
| **RN-REV-006** | Resposta da Empresa | A empresa pode publicar uma única resposta por avaliação. A resposta é exibida publicamente abaixo do comentário do cliente. A resposta não pode ser editada após publicação (apenas excluída e reescrita). |

### 12.7. Fluxo Pós-Viagem

| ID | Regra | Descrição Detalhada |
|---|---|---|
| **RN-POST-001** | Registro Obrigatório de Embarque e Conclusão | A empresa deve registrar explicitamente o início (embarque) e o fim da viagem no sistema. O registro de embarque atualiza o status para `IN_PROGRESS`. O registro de conclusão atualiza para `PENDING_COMPLETION`. |
| **RN-POST-002** | Confirmação do Cliente | Após a empresa registrar a conclusão, o cliente tem **24 horas** para confirmar ou contestar. Se não responder, a conclusão é confirmada automaticamente pelo sistema. |
| **RN-POST-003** | Liberação de Caução | A pré-autorização do depósito caução é liberada automaticamente quando a reserva atinge o status `COMPLETED` e não há disputa aberta. Se houver disputa, a caução permanece retida até resolução. |
| **RN-POST-004** | Sequência Pós-Conclusão | Após a confirmação de conclusão, o sistema executa em sequência: (1) libera caução; (2) calcula e agenda repasse para empresa; (3) solicita avaliação ao cliente; (4) envia resumo financeiro para a empresa. |
| **RN-POST-005** | Alerta de Não-Registro | Se a empresa não registrar o embarque até 1 hora após o horário programado, o sistema envia alerta automático ao Super Admin e notificação ao cliente perguntando se a viagem ocorreu. |

---

## 13. Integrações Externas

| Serviço | Finalidade | Prioridade |
|---|---|---|
| **Stripe** | Gateway de pagamento (Cartão, Pix, Boleto) e gestão de repasses (Stripe Connect). | Must-Have (MVP) |
| **Google Maps Platform** | Cálculo de rotas, distâncias e autocompletar de endereços (Places API, Directions API). | Must-Have (MVP) |
| **Twilio / Vonage** | Envio de SMS para autenticação de clientes (OTP). | Must-Have (MVP) |
| **SendGrid / AWS SES** | Envio de e-mails transacionais (confirmações, notificações). | Must-Have (MVP) |
| **Amazon S3 / Cloudflare R2** | Armazenamento de arquivos (fotos de veículos, documentos). | Must-Have (MVP) |

---

## 14. Histórico de Revisões

| Versão | Data | Descrição |
|---|---|---|
| 1.0 | 15/02/2026 | Versão inicial do PRD Buscou Viajou. |

---

## 15. Itens Pendentes (Pós-MVP)

> Os itens abaixo foram identificados durante a análise de completude e são recomendados para implementação após o lançamento do MVP. Nenhum deles bloqueia o desenvolvimento ou o go-live.

### 15.1. Definição do Processo de KYC

**Severidade:** 🟡 Importante — Pode lançar com KYC opcional e tornar obrigatório depois.

A regra RN-SEC-002 exige KYC como obrigatório, mas não há definição de como ele funciona. Para o MVP, recomenda-se tornar o KYC opcional ou exigir apenas para reservas acima de um valor (ex: R$ 5.000).

**O que precisa ser definido para pós-MVP:**
- Método de verificação: validação de CPF via Receita Federal? Selfie com documento? Verificação biométrica?
- Integração externa: qual serviço será usado? (ex: idwall, unico, Serpro, AWS Rekognition)
- Fluxo do usuário: em que momento do funil o KYC é solicitado?
- Tratamento de falhas: o que acontece se o KYC falhar ou for rejeitado?
- Tempo de processamento: síncrono (tempo real) ou assíncrono (análise humana)?

### 15.2. Comunicação em Tempo Real e Tracking

**Severidade:** 🟢 Recomendado — O telefone do motorista no bilhete digital + WhatsApp suprem a necessidade inicial.

Para um serviço de transporte, o dia da viagem pode exigir comunicação em tempo real. Porém, plataformas como Trivago e Booking não oferecem chat nativo.

**O que considerar para pós-MVP:**
- Chat in-app entre cliente e empresa/motorista
- Tracking de localização do veículo no dia da viagem
- Push notifications para eventos críticos (veículo a caminho, chegou no ponto)
- Integração com WhatsApp Business API como alternativa ao chat

### 15.3. Prevenção a Fraudes e Chargebacks

**Severidade:** 🟡 Importante — Stripe Radar cobre o básico; aprovação manual de empresas (UC-003) já mitiga empresas fantasma.

**O que considerar para pós-MVP:**
- Regras para detecção de padrões suspeitos (reservas falsas, cartões roubados)
- Limites de reservas por cliente
- Verificação adicional para reservas de alto valor
- Política de chargeback: responsabilidade, processo de contestação
- Monitoramento de fraudes via Stripe Radar

### 15.4. Monitoramento e Observabilidade

**Severidade:** 🟢 Recomendado — Decisão de infraestrutura do time de dev, não do PRD.

**O que considerar:**
- Logging centralizado (ELK Stack, Datadog, AWS CloudWatch)
- APM para monitorar NFR-01 e NFR-02
- Alertas automatizados para falhas críticas
- Health checks para integrações externas
- Status page pública

### 15.5. Onboarding e Primeiro Uso do Cliente

**Severidade:** 🟢 Recomendado — O fluxo atual já é intuitivo (busca → resultado → reserva).

**O que considerar para pós-MVP:**
- Tutorial ou guia interativo no primeiro acesso
- Cadastro progressivo (buscar antes de cadastrar)
- Login social (Google, Apple) como alternativa ao SMS
- Recuperação de carrinho abandonado

---

*Fim do Documento.*

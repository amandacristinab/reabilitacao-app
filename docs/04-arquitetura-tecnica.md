# Arquitetura Tecnica

## Objetivo

Este documento descreve a arquitetura atual do NeurovIvA App e seus limites. Ele deve ajudar novos integrantes do TCC a entender onde cada parte do sistema fica e como evoluir o MVP sem criar acoplamento desnecessario.

## Stack Atual

- React para interface.
- Vite para ambiente de desenvolvimento e build.
- React Router para navegacao.
- CSS Modules para estilos por componente/tela.
- Vitest e Testing Library para testes.
- MediaPipe Tasks Vision para suporte inicial a analise de pose.
- JSON mockado para simular dados vindos de banco/API.
- `localStorage` para persistencia local simulada.

## Organizacao de Pastas

```text
src/
  app/
    layout/          Layout principal com navegacao
    state/           Estados globais simples
    App.jsx          Provedor principal
    routes.jsx       Definicao de rotas

  features/
    auth/            Splash, login, cadastro e sucesso
    dashboard/       Home do usuario
    triagem/         Introducao e perguntas da triagem
    agendamento/     WhatsApp, data e fluxo de agendamento
    exercises/       Lista, detalhe, player e conclusao
    progress/        Indicadores de progresso
    profile/         Perfil do usuario
    assessment/      Avaliacao fisica ou tela relacionada

  shared/
    hooks/           Hooks reutilizaveis
    theme/           Tokens e estilos globais
    ui/              Componentes compartilhados

  mocks/             Dados simulados do sistema
```

## Rotas

As rotas ficam em `src/app/routes.jsx`.

Rotas fora do layout principal:

- `/`: splash;
- `/auth`: escolha entre criar conta e entrar;
- `/register/dados`: cadastro atual;
- `/success`: sucesso;
- `/login`: login.

Rotas dentro do layout principal:

- `/app/dashboard`;
- `/app/triagem`;
- `/app/triagem/perguntas`;
- `/app/avaliacao-fisica`;
- `/app/agendamento/whatsapp`;
- `/app/agendamento/data`;
- `/app/exercises`;
- `/app/exercises/:exerciseId/intro`;
- `/app/exercises/:exerciseId`;
- `/app/exercises/:exerciseId/completed`;
- `/app/progress`;
- `/app/profile`.

Observacao: algumas rotas de triagem, agendamento e execucao aparecem dentro do layout atual, mas conceitualmente podem ocultar a bottom navigation para manter foco.

## Estado Local

O app usa providers simples em React:

- `SessionProvider`: guarda nome e foto do usuario na sessao atual.
- `ActivityProvider`: guarda atividades concluidas e persiste em `localStorage`.

Tambem existem armazenamentos locais especificos:

- respostas da triagem;
- numero de WhatsApp;
- configuracoes de exercicio, como repeticoes e series.

A sessao tambem guarda `activePatientId`, usado para selecionar o paciente mockado ativo durante o MVP. O padrao atual e Dona Cida, porque ela representa o cenario com plano de cuidados ativo.

## Dados Mockados e Persistencia

No MVP, existem dois tipos de dados:

- **Dados do sistema**: simulados por JSON em `src/mocks/`, como pacientes, catalogo minimo de exercicios, planos de cuidado e horarios disponiveis.
- **Dados gerados pelo usuario**: salvos em `localStorage`, como respostas de triagem, telefone, agendamento escolhido, exercicios concluidos e avaliacao pos-exercicio.

Essa separacao aproxima o MVP de uma arquitetura real. O JSON representa o que futuramente viria de uma API/banco. O `localStorage` representa a persistencia local temporaria das acoes feitas durante o uso do prototipo.

Mocks previstos:

- `src/mocks/patients.json`: cenarios de paciente, incluindo Dona Cida com plano ativo e novo paciente sem avaliacao.
- `src/mocks/exercises.json`: catalogo minimo do MVP, contendo apenas o Deslizamento de toalha.
- `src/mocks/scheduleSlots.json`: datas e horarios simulados para teleatendimento.

Estado atual:

- os tres mocks previstos ja existem;
- `src/shared/data/mockData.js` centraliza a leitura inicial de pacientes, exercicios e horarios;
- home, exercicios, progresso e perfil ja consomem o paciente ativo em uma primeira versao;
- algumas telas ainda usam textos fixos, estado local ou importacoes indiretas, entao a integracao dos mocks ainda nao esta completa;
- o agendamento ainda nao consome `scheduleSlots.json` na interface final.

Limites desta abordagem:

- dados ficam apenas no navegador/dispositivo;
- nao existe login real;
- nao existe sincronizacao entre dispositivos;
- nao ha controle de acesso;
- nao deve ser usado como solucao final para dados sensiveis de saude.

Evolucao recomendada:

- evoluir `mockData.js` para uma camada de services com contratos mais proximos de API;
- trocar essa camada por chamadas HTTP quando houver backend;
- evitar que componentes de tela importem diretamente JSONs em etapas futuras;
- conectar cadastro, home por estado e agendamento a essa mesma fonte de dados.

## Exercicios, Camera e MediaPipe

A feature de exercicios possui:

- catalogo minimo com Deslizamento de toalha;
- tela de introducao;
- player com camera;
- contador de tempo, series e repeticoes;
- regras iniciais para verificar se o braco esta no quadro;
- regra especifica para deslizamento de toalha.

No MVP/TCC, duracao, series, repeticoes e horarios prescritos devem vir do plano individual do paciente em `patients.json`, nao do catalogo global de exercicios. Para usuario sem avaliacao, o Deslizamento de toalha pode ser exibido como exercicio demonstrativo liberado.

O MediaPipe deve ser entendido como apoio tecnico inicial. No contexto do TCC/MVP, ele nao deve ser apresentado como ferramenta clinica validada ou diagnostica.

## Design e Estilos

O projeto usa CSS Modules e um arquivo global de tema.

Diretriz recomendada:

- tokens globais ficam em `src/shared/theme/theme.css`;
- componentes reutilizaveis ficam em `src/shared/ui`;
- telas devem consumir tokens e componentes, evitando cores e tamanhos soltos;
- ajustes especificos de layout podem ficar nos CSS Modules das features.

## Testes

Testes atuais cobrem:

- renderizacao inicial;
- navegacao entre telas principais;
- triagem;
- fluxo basico de exercicio;
- regras de pose.

Proximas melhorias:

- reduzir avisos de `act(...)` nos testes do player;
- adicionar testes para cadastro completo;
- adicionar testes para estados da home;
- adicionar testes para agendamento completo;
- adicionar testes para avaliacao pos-exercicio.

## Limites Tecnicos Atuais

- Sem backend.
- Sem autenticacao real.
- Sem banco remoto.
- Sem integracao real com WhatsApp.
- Sem modelo de usuario/paciente persistido de forma robusta.
- Sem controle de permissao por perfil.
- Sem tratamento completo de privacidade/LGPD.
- Sem validacao clinica das regras de movimento.

## Direcao de Evolucao

A evolucao deve acontecer em camadas:

1. Consolidar documentacao e design system.
2. Padronizar componentes.
3. Completar fluxos do MVP com dados locais.
4. Centralizar estado da jornada do paciente.
5. Preparar contratos de dados para backend.
6. Implementar backend e autenticacao real em fase futura.

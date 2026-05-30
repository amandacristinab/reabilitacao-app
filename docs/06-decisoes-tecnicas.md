# Decisoes Tecnicas

## Objetivo

Este documento registra decisoes ja tomadas, justificativas, limites e decisoes pendentes. Ele deve evitar que o time refaca discussoes ou tome decisoes contraditorias ao longo do TCC.

## Decisoes Tomadas

### DT01 - React como biblioteca de interface

Decisao:

- usar React para desenvolver o aplicativo.

Justificativa:

- facilita criacao de componentes reutilizaveis;
- possui ecossistema amplo;
- e adequado para prototipos funcionais e MVPs;
- permite evoluir para uma arquitetura mais robusta depois.

### DT02 - Vite como ferramenta de build

Decisao:

- usar Vite para desenvolvimento e build.

Justificativa:

- configuracao simples;
- servidor local rapido;
- boa integracao com React;
- adequado para projetos academicos e MVPs.

### DT03 - React Router para navegacao

Decisao:

- usar `react-router-dom` para controlar telas e fluxos.

Justificativa:

- deixa a navegacao explicita;
- facilita testes de fluxo;
- permite rotas como `/app/exercises/:exerciseId`;
- aproxima o comportamento de um app real mesmo sendo web.

### DT04 - CSS Modules para estilos

Decisao:

- usar CSS Modules por tela/componente.

Justificativa:

- evita conflito global de classes;
- e simples para alunos entenderem;
- combina bem com componentes React;
- nao exige dependencia adicional de UI.

Diretriz:

- tokens globais devem ficar em `theme.css`;
- componentes compartilhados devem concentrar padroes;
- telas devem evitar cores e medidas soltas sempre que possivel.

### DT05 - JSON mockado para dados do sistema

Decisao:

- usar arquivos JSON em `src/mocks/` para simular dados que futuramente viriam de banco/API.

Justificativa:

- separa dados de referencia das acoes feitas pelo usuario;
- facilita criar cenarios de teste, como Dona Cida com plano ativo e novo paciente sem avaliacao;
- aproxima o MVP de uma futura arquitetura com backend;
- permite que o time valide telas e fluxos com dados consistentes.

Diretriz:

- plano de cuidados deve pertencer a um paciente especifico;
- o catalogo de exercicios do MVP deve conter apenas o Deslizamento de toalha;
- duracao, series, repeticoes, frequencia e horarios devem ficar na prescricao individual do paciente;
- em etapa futura, telas devem ler esses dados por uma camada de service, nao diretamente do JSON.

### DT06 - `localStorage` no MVP

Decisao:

- usar `localStorage` para persistir acoes feitas pelo usuario no MVP.

Justificativa:

- permite validar experiencia sem backend;
- reduz complexidade inicial;
- torna o projeto executavel localmente;
- permite testar respostas de triagem, agendamento escolhido, historico de exercicios, avaliacao pos-exercicio e configuracoes.

Limite:

- nao deve ser usado como solucao final para dados de saude;
- nao oferece seguranca adequada;
- nao sincroniza entre dispositivos;
- nao substitui banco de dados.

### DT07 - MediaPipe para prototipo de camera/pose

Decisao:

- usar MediaPipe Tasks Vision para apoio inicial a leitura de pose.

Justificativa:

- permite demonstrar potencial de acompanhamento visual;
- evita criar algoritmo de visao do zero;
- e suficiente para uma prova tecnica inicial.

Limite:

- nao deve ser apresentado como ferramenta diagnostica;
- regras de movimento precisam de validacao clinica para uso real;
- o MVP deve comunicar apenas apoio visual, nao avaliacao terapeutica automatica.

### DT08 - Mobile-first

Decisao:

- projetar e implementar primeiro para celular.

Justificativa:

- o Figma foi desenhado com largura proxima de 393 px;
- pacientes e cuidadores provavelmente usarao celular;
- a experiencia exige toque confortavel e telas simples.

### DT09 - Documentacao como fonte de verdade

Decisao:

- usar `docs/` como ponte entre Figma, TCC e codigo.

Justificativa:

- facilita orientacao do time;
- registra escopo e prioridades;
- reduz dependencia de interpretacoes individuais do Figma;
- apoia escrita e defesa do TCC.

### DT10 - Escopo de exercicio unico no TCC

Decisao:

- implementar somente o exercicio Deslizamento de toalha no MVP/TCC.

Justificativa:

- reduz escopo e risco clinico;
- permite melhorar orientacao, camera, feedback e progresso de um fluxo completo;
- evita prometer uma biblioteca de exercicios sem validacao suficiente.

Diretriz:

- usuario sem avaliacao pode acessar apenas o Deslizamento de toalha como exercicio demonstrativo;
- paciente com plano ativo pode receber o Deslizamento de toalha com parametros individualizados;
- outros exercicios devem ficar documentados como evolucao futura.

## Decisoes Pendentes

### DP01 - Backend

Ainda definir:

- tecnologia do backend;
- banco de dados;
- modelo de usuario/paciente;
- estrategia de autenticacao;
- hospedagem;
- politicas de seguranca.

Recomendacao:

- adiar ate o MVP local estar navegavel e documentado.

### DP02 - Autenticacao Real

Ainda definir:

- e-mail/senha;
- login social;
- recuperacao de senha;
- perfil paciente/cuidador/profissional;
- armazenamento seguro de sessao.

### DP03 - Integracao com WhatsApp

Ainda definir:

- se sera link manual, API oficial, ferramenta intermediaria ou processo operacional;
- quem recebe as solicitacoes;
- como confirmar agendamentos;
- como registrar alteracoes.

### DP04 - Modelo de Plano de Cuidados

Ainda definir:

- estrutura para multiplos exercicios prescritos em versoes futuras;
- frequencia semanal;
- momentos por dia;
- progresso esperado;
- relacao com profissional responsavel;
- uso de ortese.

### DP05 - LGPD e Dados de Saude

Ainda definir:

- quais dados serao coletados;
- base legal;
- consentimento;
- exclusao de dados;
- controle de acesso;
- logs;
- politica de privacidade final.

### DP06 - Validacao Clinica

Ainda definir:

- quais textos precisam de revisao profissional;
- quais exercicios futuros poderao ser incluidos com seguranca;
- quais alertas devem aparecer;
- quais limites a camera/pose deve comunicar.

## O Que Nao Sera Feito no MVP

Para manter o escopo viavel, o MVP nao deve incluir:

- backend de producao;
- autenticacao real;
- painel profissional completo;
- prescricao clinica real;
- envio real e automatico de WhatsApp;
- notificacoes push reais;
- relatorios clinicos;
- novos exercicios alem do Deslizamento de toalha;
- decisao terapeutica automatizada;
- IA generativa para recomendacao de tratamento;
- armazenamento definitivo de dados sensiveis;
- conformidade completa de producao com LGPD.

## Regras de Evolucao

Ao adicionar nova funcionalidade:

- verificar se ela esta no roadmap;
- preferir componente reutilizavel quando houver repeticao;
- seguir tokens do design system;
- manter linguagem simples;
- evitar promessas clinicas indevidas;
- adicionar teste quando o fluxo for critico;
- registrar decisao tecnica se mudar arquitetura, dados ou escopo.

## Riscos Atuais

- Divergencia visual entre Figma, design system e telas implementadas.
- Cadastro atual diferente dos requisitos.
- Home ainda nao representa corretamente os estados do paciente.
- Agendamento incompleto.
- Uso de `localStorage` para dados que futuramente serao sensiveis.
- Testes passam, mas alguns geram avisos de ambiente/`act(...)`.
- Dados mockados ainda nao estao conectados as telas.

## Diretriz Para o TCC

O projeto deve ser apresentado como MVP/prototipo funcional de apoio a reabilitacao, nao como produto clinico final. A contribuicao principal esta em organizar a experiencia do paciente/cuidador, demonstrar fluxos de acompanhamento e preparar base tecnica para evolucoes futuras.

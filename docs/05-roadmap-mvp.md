# Roadmap do MVP

## Objetivo

Este roadmap divide o desenvolvimento do NeurovIvA App em fases pequenas, implementaveis por alunos e faceis de validar. A proposta e evitar tentar corrigir tudo de uma vez.

Cada fase deve gerar uma versao navegavel e testavel do app.

## Fase 1 - Documentacao e Alinhamento

Objetivo:

- transformar Figma, escopo e codigo atual em uma base documentada para o TCC.

Entregaveis:

- README atualizado;
- visao geral;
- requisitos;
- fluxos;
- design system;
- arquitetura tecnica;
- roadmap;
- decisoes tecnicas.

Criterio de aceite:

- todos os arquivos em `docs/` possuem conteudo util;
- README aponta para a documentacao;
- roadmap reflete o estado real do codigo.

Status:

- concluida como base documental inicial.

## Fase 2 - Dados Mockados Estruturados

Objetivo:

- separar dados simulados do sistema das acoes feitas pelo usuario durante o uso do MVP.

Entregaveis:

- `src/mocks/patients.json` com Dona Cida e novo paciente;
- `src/mocks/exercises.json` com catalogo minimo contendo apenas Deslizamento de toalha;
- `src/mocks/scheduleSlots.json` com datas e horarios simulados;
- documentacao explicando JSON mockado versus `localStorage`;
- definicao de que plano de cuidados pertence a um paciente especifico.
- definicao de que duracao, series, repeticoes e horarios ficam na prescricao individual do paciente.

Criterio de aceite:

- JSONs sao sintaticamente validos;
- Dona Cida representa paciente com plano ativo e ortese;
- novo paciente representa usuario sem avaliacao;
- o MVP nao promete outros exercicios alem do Deslizamento de toalha;
- docs explicam como esses mocks serao substituidos por API no futuro.

Status:

- parcialmente concluida.
- Os arquivos `patients.json`, `exercises.json` e `scheduleSlots.json` ja existem.
- Existe uma camada simples de leitura dos mocks em `src/shared/data/mockData.js`.
- Home, exercicios, progresso e perfil ja consomem o paciente ativo em uma primeira versao.
- Ainda falta completar a integracao dos mocks em cadastro, estados da jornada, agendamento e futura camada de services mais robusta.

## Fase 3 - Design System no Codigo

Objetivo:

- alinhar a base visual do app ao design system documentado.

Entregaveis:

- tokens atualizados em `theme.css`;
- botoes com tamanho, cor e raio corretos;
- inputs padronizados;
- `IconButton` com toque minimo de 50 px;
- `AppHeader` reutilizavel;
- `BottomNavigation` revisada;
- `Accordion` reutilizavel;
- remocao gradual de cores soltas nas telas.

Criterio de aceite:

- telas principais usam tokens do design system;
- botoes principais tem pelo menos 50 px de area de toque;
- app continua responsivo em largura proxima de 393 px;
- build e testes passam.

## Fase 4 - Cadastro e Login

Objetivo:

- ajustar o fluxo inicial para bater com os requisitos do MVP.

Entregaveis:

- cadastro em etapas;
- e-mail, senha e confirmacao de senha;
- aceite de Termos de Uso e Politica de Privacidade;
- dados pessoais: nome, tipo de conta, genero e data de nascimento;
- login simulado revisado;
- validacoes de campos obrigatorios;
- telas alinhadas ao design system.

Criterio de aceite:

- botao de cadastro fica desabilitado ate o formulario estar valido;
- senhas precisam coincidir;
- termos precisam estar aceitos;
- usuario consegue concluir cadastro e chegar na jornada inicial.

## Fase 5 - Home por Estado do Paciente

Objetivo:

- tornar a home coerente com a etapa real da jornada.

Entregaveis:

- estado local da jornada do paciente;
- home sem triagem;
- home com triagem realizada;
- home com avaliacao agendada;
- home com plano ativo simulado;
- card de avaliacao como acordeao real;
- card de teleatendimento agendado;
- acesso a exercicios apenas quando fizer sentido para o estado escolhido.

Criterio de aceite:

- home nao mostra plano prescrito antes da hora;
- cada estado tem uma acao principal clara;
- navegacao para triagem, agendamento e exercicios funciona.

## Fase 6 - Agendamento

Objetivo:

- completar o fluxo de teleatendimento simulado.

Entregaveis:

- tela de WhatsApp com mascara e validacao;
- calendario responsivo;
- selecao de horario;
- tela de confirmacao;
- persistencia local do agendamento;
- exibicao do agendamento na home.

Criterio de aceite:

- usuario consegue escolher telefone, data e horario;
- resumo final mostra dados corretos;
- home reflete o agendamento ativo.

## Fase 7 - Exercicios e Pos-Exercicio

Objetivo:

- completar a jornada de treino, da preparacao ao registro de percepcao.

Entregaveis:

- Deslizamento de toalha por periodo do dia, quando prescrito;
- acordeoes de rotina, resumo do caso e seguranca;
- detalhe do exercicio revisado;
- player com interface alinhada ao design system;
- tela de conclusao;
- avaliacao pos-exercicio;
- registro local de humor/cansaco junto ao treino.

Criterio de aceite:

- usuario consegue iniciar e concluir exercicio;
- atividade fica registrada;
- avaliacao pos-exercicio e salva;
- progresso consegue ler os dados registrados.

Observacao:

- novos exercicios ficam fora do MVP/TCC e devem ser planejados apenas em fase posterior.

## Fase 8 - Progresso e Perfil

Objetivo:

- tornar progresso e perfil mais uteis para paciente/cuidador.

Entregaveis:

- progresso semanal;
- meta da semana;
- series realizadas e faltantes;
- historico recente;
- percepcao pos-exercicio;
- perfil com dados resumidos;
- acesso a teleatendimento;
- resumo do plano/cuidados quando houver.

Criterio de aceite:

- progresso reflete atividades locais;
- mensagens tem tom de apoio;
- perfil mostra informacoes coerentes com o estado do paciente.

## Fase 9 - Preparacao para Backend

Objetivo:

- preparar o MVP para evoluir sem reescrever a interface.

Entregaveis:

- modelos de dados documentados;
- contratos de API propostos;
- separacao entre armazenamento local e camada de servico;
- lista de requisitos de seguranca e LGPD;
- estrategia de autenticacao futura;
- planejamento do painel profissional.

Criterio de aceite:

- equipe sabe quais dados serao enviados ao backend;
- telas nao dependem diretamente de `localStorage`;
- ha plano claro para autenticacao real e banco remoto.

## Priorizacao Recomendada

Ordem recomendada para os proximos ciclos:

1. Concluir Fase 2: conectar mocks e paciente ativo a todos os fluxos navegaveis.
2. Fase 3: design system no codigo.
3. Fase 4: cadastro/login.
4. Fase 5: home por estado.
5. Fase 6: agendamento.
6. Fase 7: pos-exercicio.

Essa ordem reduz retrabalho, porque primeiro consolida os dados de demonstracao como fonte unica e depois estabelece padroes visuais e componentes compartilhados.

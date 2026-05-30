# Visao Geral do NeurovIvA App

## Contexto

O NeurovIvA App e um aplicativo mobile-first desenvolvido como parte de um TCC. O projeto nasceu a partir de um prototipo no Figma e tem como objetivo validar uma experiencia digital de apoio ao acompanhamento domiciliar de pacientes em reabilitacao pos-AVC.

A documentacao nesta pasta transforma o Figma em orientacoes tecnicas, funcionais e visuais para o time de desenvolvimento. A partir deste ponto, o Figma continua sendo a referencia visual, mas os documentos passam a ser a fonte de verdade para escopo, prioridades, decisoes tecnicas e roadmap.

## Problema

Pacientes em reabilitacao pos-AVC podem ter dificuldade para manter continuidade do cuidado fora do ambiente clinico. Tambem podem depender de cuidadores, ter baixa familiaridade digital, fadiga, limitacao motora, dor, espasticidade ou dificuldade de realizar movimentos com precisao.

O aplicativo busca apoiar essa jornada com orientacoes simples, exercicios guiados, registro de progresso e acesso a avaliacao/teleatendimento.

## Publico-Alvo

O publico principal do app e composto por:

- pacientes pos-AVC em reabilitacao de membro superior;
- cuidadores ou familiares que auxiliam o paciente;
- profissionais de saude que futuramente poderao acompanhar prescricoes e progresso.

Nesta primeira versao, o foco de implementacao esta no aplicativo do paciente/cuidador.

## Objetivo do MVP

O MVP deve validar a navegacao e a experiencia principal do app, sem depender de backend real. O foco inicial e permitir que o usuario:

- acesse o app por login/cadastro simulado;
- realize uma triagem inicial;
- solicite ou simule um agendamento de teleatendimento;
- visualize o Deslizamento de toalha quando liberado ou prescrito;
- execute o Deslizamento de toalha com apoio da camera;
- registre conclusao de treino;
- acompanhe progresso basico;
- consulte informacoes resumidas de perfil/plano.

## Fora do Escopo do MVP

Os itens abaixo sao importantes para o produto, mas devem ser tratados como evolucao futura:

- autenticacao real;
- banco de dados remoto;
- painel do profissional de saude;
- envio real de mensagens pelo WhatsApp;
- integracao com prontuario ou sistemas externos;
- prescricao clinica real;
- analise de movimento com finalidade diagnostica;
- recomendacoes automaticas de tratamento;
- adequacao completa a LGPD e seguranca de producao.

## Relacao Entre Figma, Docs e Codigo

- O Figma define a referencia visual e a experiencia desejada.
- Os documentos em `docs/` traduzem essa referencia em requisitos, fluxos, tokens, componentes e prioridades.
- O codigo implementa o MVP de forma incremental, seguindo os docs e evitando decisoes visuais isoladas em cada tela.

Quando houver divergencia entre codigo atual e documentacao, a documentacao deve orientar a proxima etapa de refatoracao, desde que ainda esteja coerente com o Figma e com o escopo do TCC.

## Principios do Produto

- Simplicidade antes de complexidade.
- Poucas acoes por tela.
- Botao principal sempre claro.
- Linguagem curta e acessivel.
- Area de toque confortavel.
- Interface adequada para pacientes com limitacao motora.
- Feedback visual claro.
- Nenhuma promessa de diagnostico ou substituicao de profissional de saude.

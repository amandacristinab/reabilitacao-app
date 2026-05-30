# Requisitos do NeurovIvA App

## Objetivo

Este documento descreve os requisitos funcionais e nao funcionais do MVP do NeurovIvA App. Ele tambem indica o estado atual da implementacao para ajudar o time a priorizar as proximas etapas.

Legenda de status:

- **Implementado**: existe no codigo e possui fluxo navegavel.
- **Parcial**: existe uma versao inicial, mas falta comportamento, acabamento ou regra importante.
- **Pendente**: ainda precisa ser implementado.
- **Futuro**: nao faz parte do MVP imediato.

## Requisitos Funcionais

| ID | Requisito | Status | Observacoes |
| --- | --- | --- | --- |
| RF01 | Splash e acesso inicial | Implementado | Tela inicial com identidade visual e acesso ao fluxo de autenticacao. |
| RF02 | Criacao de conta | Parcial | Existe cadastro simplificado, mas faltam senha, confirmacao de senha, termos, politica de privacidade, tipo de conta e data de nascimento conforme escopo. |
| RF03 | Login | Parcial | Login simulado por e-mail e senha. Nao ha autenticacao real. |
| RF04 | Confirmacao de cadastro | Implementado | Tela de sucesso apos cadastro simulado. |
| RF05 | Home do paciente | Parcial | Existe dashboard, mas os estados da jornada ainda nao estao separados corretamente. |
| RF06 | Questionario de triagem | Implementado | Fluxo com perguntas e persistencia local. Pode ser refinado para bater exatamente com o roteiro clinico desejado. |
| RF07 | Agendamento de teleatendimento | Parcial | Tela de WhatsApp existe. Selecao de data, horario e confirmacao ainda precisam ser completadas. |
| RF08 | Navegacao principal | Implementado | Bottom navigation entre Inicio, Exercicios, Progresso e Perfil. |
| RF09 | Exercicios e plano de cuidados | Parcial | Lista de exercicios existe, mas plano, periodos do dia e acordeoes precisam amadurecer. |
| RF10 | Detalhamento do exercicio | Implementado | Tela de introducao com midia e informacoes basicas. |
| RF11 | Execucao com camera | Implementado | Player com camera, temporizador, series, repeticoes e regras iniciais de pose. |
| RF12 | Conclusao de exercicio | Implementado | Tela de conclusao e registro local de atividade. |
| RF13 | Avaliacao pos-exercicio | Pendente | Deve registrar percepcao do paciente apos o treino. |
| RF14 | Progresso | Parcial | Existe tela e historico local, mas faltam indicadores mais completos e ligacao com avaliacao pos-exercicio. |
| RF15 | Perfil | Parcial | Existe tela inicial, mas precisa refletir melhor plano, resumo do caso e acoes. |

## Detalhamento dos Requisitos

### RF01 - Splash e Acesso Inicial

O app deve apresentar uma tela inicial com identidade NeurovIvA e direcionar o usuario para criar conta ou entrar.

Critérios:

- exibir logotipo;
- apresentar chamada inicial simples;
- oferecer acao clara para comecar;
- direcionar para escolha entre cadastro e login.

### RF02 - Criacao de Conta

O app deve permitir criar conta em etapas simples.

Campos minimos para o MVP:

- e-mail;
- senha;
- confirmacao de senha;
- aceite dos Termos de Uso;
- aceite da Politica de Privacidade;
- nome completo;
- tipo de conta;
- genero;
- data de nascimento.

O botao principal deve permanecer desabilitado ate que os campos obrigatorios estejam validos.

### RF03 - Login

O app deve permitir entrada simulada com e-mail e senha no MVP.

Em versao futura, o login deve ser substituido por autenticacao real com backend.

### RF04 - Confirmacao de Cadastro

Apos concluir o cadastro, o app deve informar que a conta foi criada e permitir seguir para a jornada inicial.

### RF05 - Home do Paciente

A home deve variar conforme o estado da jornada:

- usuario novo sem triagem;
- usuario com triagem realizada e sem avaliacao agendada;
- usuario com teleatendimento agendado;
- usuario com plano de cuidados ativo;
- usuario com historico de exercicios.

A home nao deve mostrar rotina prescrita como se ela existisse antes da avaliacao/plano.

### RF06 - Questionario de Triagem

A triagem deve coletar informacoes iniciais sobre o perfil clinico e funcional do paciente. Ela deve apoiar a jornada do app, sem substituir avaliacao profissional.

Perguntas previstas:

- ocorrencia ou quantidade de AVCs;
- tempo desde o ultimo AVC;
- tipo de AVC, quando conhecido;
- lado afetado;
- lado dominante ou informacoes funcionais relevantes;
- presenca de dor;
- existencia de cuidador;
- acompanhamento profissional;
- modalidade de reabilitacao atual.

### RF07 - Agendamento de Teleatendimento

O fluxo de agendamento deve permitir:

- informar ou confirmar WhatsApp;
- escolher data disponivel;
- escolher horario disponivel;
- confirmar agendamento;
- visualizar resumo do agendamento;
- revisar ou corrigir telefone.

No MVP, o agendamento pode ser simulado localmente.

### RF08 - Navegacao Principal

A navegacao principal deve conter:

- Inicio;
- Exercicios;
- Progresso;
- Perfil.

Ela deve aparecer nas telas principais e ficar oculta em fluxos focados, como login, cadastro, triagem, agendamento e execucao ativa do exercicio.

### RF09 - Exercicios e Plano de Cuidados

A area de exercicios deve apresentar rotina prescrita, objetivo terapeutico, resumo do caso e exercicios por periodo do dia.

No MVP, os dados podem ser simulados.

### RF10 - Detalhamento do Exercicio

Cada exercicio deve ter uma tela de preparacao com:

- nome;
- objetivo;
- imagem ou video demonstrativo;
- itens necessarios;
- instrucoes de posicionamento;
- orientacoes de seguranca;
- repeticoes, series e duracao sugeridas.

### RF11 - Execucao com Camera

O app deve permitir que o usuario ative a camera e acompanhe a propria execucao.

O player deve mostrar:

- botao de iniciar/pausar;
- tempo;
- repeticoes sugeridas;
- series feitas;
- controles de camera;
- feedback simples de posicionamento/movimento quando disponivel.

### RF12 - Conclusao de Exercicio

A conclusao deve registrar a atividade localmente e apresentar resumo simples do treino.

### RF13 - Avaliacao Pos-Exercicio

Apos concluir o exercicio, o usuario deve registrar como se sentiu.

Opcoes previstas:

- muito bem;
- bem;
- neutro;
- cansado;
- muito cansado.

Esse registro deve alimentar a tela de progresso em uma etapa posterior.

### RF14 - Progresso

A tela de progresso deve mostrar indicadores simples, sem gerar culpabilizacao do paciente.

Indicadores previstos:

- treinos realizados na semana;
- meta semanal;
- series realizadas;
- series faltantes;
- historico recente;
- percepcao pos-exercicio.

### RF15 - Perfil

O perfil deve reunir informacoes resumidas e acoes relevantes:

- nome do usuario;
- objetivo terapeutico;
- resumo do caso;
- rotina prescrita;
- agendar teleatendimento;
- solicitar ajuste do plano, em versao futura.

## Requisitos Nao Funcionais

| ID | Requisito | Diretriz |
| --- | --- | --- |
| RNF01 | Acessibilidade | Textos legiveis, botoes grandes, contraste adequado e area de toque confortavel. |
| RNF02 | Usabilidade | Interface simples para pacientes e cuidadores com baixa familiaridade digital. |
| RNF03 | Responsividade | Layout mobile-first, inspirado no Figma de 393 px, mas adaptavel a celulares diferentes. |
| RNF04 | Consistencia visual | Implementacao deve seguir o design system documentado. |
| RNF05 | Clareza clinica | O app deve informar que nao substitui avaliacao profissional. |
| RNF06 | Privacidade | Dados sensiveis devem ser tratados com cuidado. LGPD completa e backend seguro sao etapas futuras. |
| RNF07 | Evolutividade | Arquitetura deve permitir backend, painel profissional, sensores e IA no futuro. |

## Recursos Futuros

Ficam fora do MVP imediato:

- backend e banco de dados remoto;
- autenticacao real;
- integracao real com WhatsApp;
- painel profissional;
- notificacoes reais;
- prescricoes feitas por profissional dentro do sistema;
- relatorios clinicos;
- IA com decisao terapeutica;
- analise de movimento validada clinicamente.

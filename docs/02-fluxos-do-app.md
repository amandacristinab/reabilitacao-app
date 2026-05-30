# Fluxos do NeurovIvA App

## Objetivo

Este documento organiza os fluxos principais do aplicativo por jornada do usuario. Ele deve orientar a implementacao das telas, navegacao, estados e condicoes do MVP.

## Convencoes Gerais

### Cabecalho

Telas internas devem usar cabecalho com:

- botao de voltar ou sair, conforme contexto;
- logotipo NeurovIvA centralizado;
- botao de ajuda quando fizer sentido.

O botao de ajuda pode abrir uma mensagem simples no MVP e uma central de orientacao em versoes futuras.

### Navegacao Inferior

A navegacao inferior deve aparecer em:

- Inicio;
- Exercicios;
- Progresso;
- Perfil.

A navegacao inferior nao deve aparecer em:

- splash;
- login;
- cadastro;
- sucesso de cadastro;
- triagem;
- agendamento;
- execucao ativa do exercicio;
- telas de foco ou confirmacao temporaria.

### Acordeoes

Acordeoes devem ser usados para organizar informacoes que nao precisam ficar sempre abertas.

Usos previstos:

- avaliacao gratuita na home;
- teleatendimento agendado;
- resumo do caso;
- periodos de exercicio;
- frequencia semanal;
- rotina prescrita;
- dicas de seguranca;
- plano de uso da ortese.

## Estados da Jornada do Paciente

O app deve considerar os seguintes estados:

| Estado | Descricao | Home esperada |
| --- | --- | --- |
| Novo sem triagem | Usuario entrou, mas ainda nao respondeu triagem. | Chamada para iniciar triagem. |
| Triagem feita | Usuario respondeu triagem, mas nao agendou avaliacao. | Chamada para agendar avaliacao gratuita. |
| Avaliacao agendada | Usuario possui teleatendimento simulado. | Card de agendamento com detalhes. |
| Plano ativo | Usuario possui rotina prescrita simulada. | Acesso rapido a exercicios, progresso e plano. |
| Exercicio concluido | Usuario ja completou ao menos um treino. | Historico e progresso semanal. |

## Jornada 1 - Acesso

### Fluxo 1.1 - Splash

1. Usuario abre o app.
2. App exibe identidade NeurovIvA.
3. Usuario toca em "Comecar".
4. App direciona para escolha entre criar conta e entrar.

### Fluxo 1.2 - Escolha de Acesso

1. Usuario visualiza duas acoes principais.
2. Se tocar em "Criar minha conta", vai para cadastro.
3. Se tocar em "Entrar", vai para login.

### Fluxo 1.3 - Login

1. Usuario informa e-mail.
2. Usuario informa senha.
3. Botao "Entrar" habilita quando os campos estao preenchidos.
4. App entra de forma simulada e direciona para a home.

### Fluxo 1.4 - Cadastro

1. Usuario informa e-mail, senha e confirmacao.
2. Usuario aceita Termos de Uso e Politica de Privacidade.
3. Usuario informa dados pessoais basicos.
4. App valida dados obrigatorios.
5. App exibe tela de sucesso.
6. Usuario segue para a jornada inicial.

No codigo atual, o cadastro ainda precisa ser ajustado para seguir esta sequencia.

## Jornada 2 - Triagem

### Fluxo 2.1 - Introducao

1. Usuario acessa triagem pela home ou pelo fluxo inicial.
2. App apresenta personagem/orientacao.
3. Usuario escolhe comecar ou pular para agendamento, se a regra permitir.

### Fluxo 2.2 - Perguntas

1. App apresenta uma pergunta por etapa.
2. Usuario seleciona uma resposta.
3. Botao "Continuar" habilita somente apos selecao.
4. App salva resposta localmente.
5. App avanca ate a ultima pergunta.
6. Ao finalizar, direciona para agendamento ou home, conforme decisao de produto.

### Regras

- Perguntas devem usar linguagem simples.
- Deve haver opcao como "Nao responder" quando aplicavel.
- A triagem nao deve ser apresentada como diagnostico.

## Jornada 3 - Agendamento

### Fluxo 3.1 - WhatsApp

1. Usuario informa ou confirma numero de WhatsApp.
2. App aplica mascara de telefone.
3. Botao principal habilita quando o numero e valido para o MVP.
4. Usuario segue para selecao de data.

### Fluxo 3.2 - Data

1. App exibe calendario responsivo.
2. Usuario escolhe uma data disponivel.
3. Botao principal habilita.
4. Usuario segue para selecao de horario.

### Fluxo 3.3 - Horario

1. App exibe horarios disponiveis.
2. Usuario escolhe um horario.
3. Usuario confirma agendamento.

### Fluxo 3.4 - Confirmacao

1. App exibe resumo do teleatendimento.
2. Resumo deve conter data, horario, duracao e canal.
3. App informa que o contato sera feito via WhatsApp.
4. Usuario retorna para a home.
5. Home passa a exibir card de teleatendimento agendado.

No MVP, todo o agendamento pode ser simulado em estado local/localStorage.

## Jornada 4 - Home

### Home Sem Triagem

Deve orientar o usuario a iniciar a triagem. O objetivo e mostrar o proximo passo sem sobrecarregar a tela.

### Home Com Triagem e Sem Agendamento

Deve destacar a avaliacao gratuita e permitir expandir o card para explicar o beneficio.

### Home Com Agendamento

Deve mostrar um card de teleatendimento agendado, com estado fechado e aberto.

### Home Com Plano Ativo

Deve mostrar:

- saudacao personalizada;
- botao para fazer exercicio;
- resumo da rotina;
- progresso semanal;
- ultimo treino.

## Jornada 5 - Exercicios

### Fluxo 5.1 - Lista de Exercicios

1. Usuario acessa aba Exercicios.
2. App mostra rotina prescrita e objetivo.
3. Usuario pode abrir resumo do caso.
4. Usuario pode abrir periodos do dia.
5. Usuario escolhe exercicio.

### Fluxo 5.2 - Detalhe do Exercicio

1. App mostra nome e objetivo.
2. App apresenta imagem ou video demonstrativo.
3. App lista itens necessarios.
4. App mostra orientacoes de posicionamento e seguranca.
5. Usuario toca em iniciar.

### Fluxo 5.3 - Execucao

1. App abre tela focada no exercicio.
2. Usuario pode ativar camera.
3. Usuario inicia ou pausa treino.
4. App mostra tempo, series e repeticoes.
5. Ao finalizar as series, app registra atividade e vai para conclusao.

### Fluxo 5.4 - Conclusao

1. App exibe resumo do treino.
2. Usuario segue para avaliacao pos-exercicio.
3. Apos avaliar, usuario retorna para home, exercicios ou progresso.

## Jornada 6 - Progresso

1. Usuario acessa aba Progresso.
2. App calcula historico local.
3. App mostra treinos feitos na semana.
4. App mostra meta semanal e series realizadas.
5. App mostra percepcao pos-exercicio quando existir.

O tom deve ser de apoio, evitando mensagens que culpabilizem o paciente por baixa adesao.

## Jornada 7 - Perfil

1. Usuario acessa aba Perfil.
2. App mostra dados resumidos do usuario.
3. App mostra objetivo terapeutico/plano, quando houver.
4. Usuario pode acessar agendamento.
5. Futuramente, usuario podera solicitar ajuste de plano.

## Fluxos Futuros

Devem ser planejados apos o MVP:

- autenticacao real;
- painel profissional;
- prescricao real de exercicios;
- notificacoes;
- integracao com WhatsApp;
- relatorios;
- analise de movimento validada.

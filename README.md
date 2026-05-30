# NeurovIvA App

Aplicativo web mobile-first para apoio ao acompanhamento domiciliar de pacientes em reabilitacao pos-AVC. O projeto faz parte de um TCC e esta sendo desenvolvido a partir de um prototipo no Figma, agora complementado por documentacao tecnica em `docs/`.

## Objetivo

O NeurovIvA App busca organizar a jornada do paciente/cuidador em uma experiencia simples, acessivel e adequada ao uso em celular. O MVP deve validar os principais fluxos de interface: acesso, triagem, agendamento, exercicios, execucao guiada, progresso e perfil.

O aplicativo nao substitui avaliacao profissional, diagnostico, prescricao terapeutica ou atendimento de urgencia.

## Stack

- React
- Vite
- React Router
- CSS Modules
- Vitest e Testing Library
- MediaPipe Tasks Vision para suporte inicial a analise de postura/movimento
- `localStorage` para dados simulados do MVP

## Como Rodar

Instale as dependencias:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Gere o build de producao:

```bash
npm run build
```

Visualize o build localmente:

```bash
npm run preview
```

Rode os testes:

```bash
npm test
```

## Estrutura

```text
src/
  app/              Rotas, layout e estados globais simples
  features/         Telas e fluxos por area do produto
  shared/           Componentes, hooks e tema compartilhados
assets/             Imagens e midias usadas na interface
public/             Arquivos publicos do app
docs/               Documentacao do TCC e do MVP
```

## Status Atual do MVP

Implementado ou parcialmente implementado:

- splash e escolha entre criar conta/entrar;
- login e cadastro simulados;
- tela inicial do paciente;
- triagem inicial;
- inicio do fluxo de agendamento por WhatsApp;
- lista, detalhe, execucao e conclusao de exercicio;
- player com camera e regras iniciais de movimento;
- historico local de exercicios;
- progresso e perfil em versao inicial;
- testes automatizados para fluxos principais e regras de pose.

Pendente ou incompleto:

- cadastro completo com senha, confirmacao e aceite de termos;
- estados reais da jornada do paciente na home;
- calendario, horario e confirmacao do agendamento;
- avaliacao pos-exercicio;
- maior alinhamento visual ao design system;
- backend, autenticacao real, banco de dados e integracao real com WhatsApp.

## Documentacao

- [Visao geral](docs/00-visao-geral.md)
- [Requisitos](docs/01-requisitos.md)
- [Fluxos do app](docs/02-fluxos-do-app.md)
- [Design system](docs/03-design-system.md)
- [Arquitetura tecnica](docs/04-arquitetura-tecnica.md)
- [Roadmap do MVP](docs/05-roadmap-mvp.md)
- [Decisoes tecnicas](docs/06-decisoes-tecnicas.md)

## Proximos Passos Recomendados

1. Alinhar o tema global e componentes-base ao design system.
2. Corrigir o fluxo de cadastro conforme requisitos.
3. Implementar os estados da home por etapa da jornada.
4. Completar o fluxo de agendamento.
5. Adicionar avaliacao pos-exercicio e conectar ao progresso.
6. Preparar arquitetura para backend em uma etapa futura.

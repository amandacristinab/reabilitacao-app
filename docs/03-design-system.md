# Design System do NeurovIvA App

## Objetivo

Este documento traduz o Figma do NeurovIvA em regras praticas para implementacao em React e CSS. Ele deve orientar cores, tipografia, componentes, responsividade e acessibilidade motora.

O app sera usado por pacientes pos-AVC, cuidadores e profissionais de saude. Por isso, a interface deve ser simples, legivel, previsivel e confortavel para toque.

## Principios

- Poucos elementos por tela.
- Texto curto e direto.
- Botao principal facil de localizar.
- Area de toque grande.
- Alto contraste entre texto e fundo.
- Feedback visual claro.
- Evitar gestos complexos.
- Evitar depender apenas de cor para comunicar estado.

## Base de Layout

O Figma usa como referencia uma largura proxima a 393 px, semelhante ao iPhone 16. A implementacao deve ser responsiva, sem copiar medidas fixas de forma rigida.

Regras:

- usar layout mobile-first;
- limitar conteudo principal a aproximadamente `330px` quando fizer sentido;
- manter margem lateral proxima de `32px` na largura base;
- permitir rolagem vertical;
- respeitar `env(safe-area-inset-top)` e `env(safe-area-inset-bottom)`;
- garantir que botoes importantes nao fiquem atras da navegacao inferior.

Tokens recomendados:

```css
:root {
  --color-primary-text: #0E1E35;
  --color-coral: #F04D4F;
  --color-turquoise: #3BB7A2;
  --color-background: #F9F8F4;
  --color-orange: #FFA62B;
  --color-white: #FFFFFF;
  --color-light-turquoise: #EAF9F6;
  --color-gray: #AAAAAA;
  --color-border: #D9D9D9;
  --color-placeholder: #A7AAB0;
  --color-blue: #1597E5;

  --font-title: "Montserrat", sans-serif;
  --font-body: "DM Sans", sans-serif;

  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-round: 32px;
  --radius-pill: 999px;

  --layout-content-max: 330px;
  --layout-screen-padding: 32px;
  --touch-target: 50px;
  --bottom-nav-height: 100px;
}
```

## Cores

| Token | Cor | Uso |
| --- | --- | --- |
| `primaryText` | `#0E1E35` | Textos principais, icones, cards escuros |
| `coral` | `#F04D4F` | Alertas, cancelamentos e atencao |
| `turquoise` | `#3BB7A2` | Acoes principais e destaques positivos |
| `background` | `#F9F8F4` | Fundo principal |
| `orange` | `#FFA62B` | Avaliacao, teleatendimento e avisos leves |
| `white` | `#FFFFFF` | Cards claros |
| `lightTurquoise` | `#EAF9F6` | Fundos selecionados e botoes secundarios |
| `gray` | `#AAAAAA` | Estados desabilitados |
| `border` | `#D9D9D9` | Bordas |
| `placeholder` | `#A7AAB0` | Placeholders e textos de apoio |
| `blue` | `#1597E5` | Graficos e progresso |

## Tipografia

| Uso | Fonte |
| --- | --- |
| Titulos | Montserrat |
| Textos | DM Sans |

Escala de referencia:

| Tipo | Tamanho | Peso | Entrelinha |
| --- | ---: | --- | ---: |
| H1 | 52 px | Bold | 160% |
| H2 | 40 px | Medium | 160% |
| H3 | 32 px | Bold | 160% |
| H4 | 26 px | Bold | 160% |
| H5 | 20 px | Bold | 160% |
| Texto grande | 20 px | Regular | 160% |
| Corpo | 16 px | Regular | 160% |
| Corpo bold | 16 px | Bold | 160% |
| Pequeno | 14 px | Regular | 160% |
| Legenda | 12 px | Regular | 160% |
| Legenda menor | 10 px | Regular | 160% |

No mobile real, titulos podem usar tamanhos menores que a escala maxima quando necessario, desde que mantenham hierarquia e legibilidade.

## Componentes Prioritarios

### Botao Primario

Uso:

- Criar conta;
- Entrar;
- Comecar;
- Continuar;
- Salvar;
- Agendar avaliacao;
- Fazer um exercicio.

CSS de referencia:

```css
.primaryButton {
  width: 100%;
  max-width: 330px;
  min-height: 72px;
  padding: 16px;
  border: 0;
  border-radius: 16px;
  background: radial-gradient(50% 50% at 50% 50%, #57EBD2 49%, #3BB7A2 100%);
  color: #0E1E35;
  font-family: var(--font-body);
  font-weight: 700;
}
```

### Botao Secundario

Uso:

- Entrar quando a acao principal for criar conta;
- Voltar;
- Reenviar;
- Tirar novamente.

Referencia:

```css
.secondaryButton {
  width: 100%;
  max-width: 330px;
  min-height: 72px;
  padding: 16px;
  border-radius: 16px;
  border: 3px solid #3BB7A2;
  background: #EAF9F6;
  color: #0E1E35;
  font-weight: 700;
}
```

### Botao Desabilitado

Regras:

- usar `#AAAAAA`;
- nao parecer clicavel;
- manter texto legivel;
- ser usado ate os campos obrigatorios estarem validos.

### Botao de Icone

Uso:

- voltar;
- sair;
- ajuda;
- mostrar senha;
- calendario;
- camera.

Referencia:

```css
.iconButton {
  width: 50px;
  height: 50px;
  border-radius: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

### Input

Campos de texto devem ter:

- label acima;
- altura confortavel;
- placeholder cinza;
- borda clara;
- foco visivel;
- validacao antes de habilitar o botao principal.

Referencia:

```css
.input {
  width: 100%;
  max-width: 330px;
  min-height: 72px;
  padding: 16px;
  border-radius: 16px;
  border: 2px solid #D9D9D9;
  background: #F9F8F4;
  color: #0E1E35;
}
```

### AppHeader

Deve conter:

- acao esquerda: voltar ou sair;
- logotipo centralizado;
- acao direita: ajuda ou espaco reservado.

Regras:

- altura minima aproximada de `88px`;
- respeitar safe area;
- icones com area minima de `50px`;
- logotipo visualmente centralizado.

### BottomNavigation

Itens:

- Inicio;
- Exercicios;
- Progresso;
- Perfil.

Regras:

- fixa na parte inferior;
- respeita safe area;
- icone e texto em cada item;
- estado ativo nao deve depender somente da cor;
- area de toque ampla.

### Accordion

Deve ter:

- titulo;
- resumo opcional;
- icone de expandir/recolher;
- estado aberto e fechado;
- conteudo objetivo;
- area de toque confortavel no cabecalho.

### Cards

Cards devem usar:

- fundo branco ou cor de destaque prevista;
- borda ou sombra sutil;
- cantos arredondados;
- textos curtos;
- icone de apoio quando util;
- padding consistente.

## Checklist de Acessibilidade Motora

Antes de considerar uma tela pronta, verificar:

- botoes principais tem pelo menos `50px` de area de toque;
- a acao principal esta clara;
- controles proximos tem espaco suficiente;
- nao ha dependencia de gesto complexo;
- inputs e botoes nao ficam escondidos pela bottom nav;
- textos sao legiveis sem zoom;
- estados desabilitados sao claros;
- feedback de erro nao usa somente cor;
- a tela funciona com uma mao e toque impreciso;
- conteudo excedente pode rolar verticalmente.

## Prioridade de Implementacao

1. Atualizar tokens em `theme.css`.
2. Padronizar `Button`, `TextField`, `IconButton`, `AppHeader` e `BottomNavigation`.
3. Criar `Accordion` reutilizavel.
4. Aplicar componentes nas telas de login/cadastro/home.
5. Ajustar telas restantes por fluxo.

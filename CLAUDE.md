# Kana Sensei

App web para aprender hiragana e katakana, com repetição espaçada que se
adapta ao aluno. Está virando também um app de frases, a partir do material
do curso de japonês do Lucas.

- **Dono:** Lucas Nicolov. Projeto pessoal, dentro do `caveira_lab`.
- **Público:** quem está aprendendo kana do zero, começando pelo próprio Lucas.
- **Objetivo:** aprender kana e frases sem precisar de disciplina — o app
  decide o que mostrar e quando, e o aluno só responde.

## Onde mora

| Coisa | Lugar |
| --- | --- |
| Código | `lucasnicolov/kanasensei` no GitHub |
| No ar | https://lucasnicolov.github.io/kanasensei/ |
| Pasta local | `~/caveira_lab/kanasensei` (clone do GitHub Desktop) |
| Desenho | Figma, arquivo `Jx8sngEi8Sdtiwfy29oKqV` |

## Como é feito

HTML, CSS e JavaScript puros. **Sem framework, sem build, sem dependência
externa.** O app abre com dois cliques num arquivo e funciona offline.

| Arquivo | O que é |
| --- | --- |
| `index.html` | a página inteira, com o mascote embutido em SVG |
| `estilo.css` | todo o visual |
| `script.js` | o motor: memória, exercícios, telas |
| `caminhos.js` | os traços de cada kana, para a tela de desenhar |
| `audio/` | as gravações de voz (471 arquivos) |

A memória do aluno fica no `localStorage`, na chave `kana-sensei-v3`.
O histórico diário fica em `kana-sensei-historico-v1`.

## Fluxo de trabalho

1. A direção visual é decidida no Figma, numa rodada (ver a skill
   `rodada-de-direcao`).
2. O Lucas escolhe. A decisão vai para o `docs/decisoes.md`.
3. A máquina entrega os arquivos prontos **para substituir inteiros** —
   nunca um pedaço para colar no meio.
4. O Lucas testa em `localhost:8000` e no iPhone.
5. Publica pelo GitHub Desktop.

## Regras visuais

As cores vivem como variáveis no `estilo.css`. Não use valor solto.

| Variável | Valor | Para quê |
| --- | --- | --- |
| `--papel` | `#0E1424` | fundo |
| `--papel-2` | `#161E33` | caixas e cartões |
| `--tinta` | `#F2EFE6` | texto |
| `--azul` | `#2E6FE8` | o enunciado, a placa |
| `--lima` | `#D9F23C` | acerto, destaque, o que está ativo |
| `--rosa` | `#FF3B9A` | erro, e os detalhes do gato |
| `--raio` / `--raio-g` / `--raio-pil` | `16px` / `28px` / `999px` | cantos |

O tema claro vive em `html[data-visual="claro"]`. Nada de
`@media (prefers-color-scheme)` — o aluno escolhe.

**Tipografia:** Archivo Black (marca e botões), Archivo (texto corrido),
Space Mono (rótulos miúdos, sempre em maiúscula com espaçamento aberto),
Zen Kaku Gothic New (todo o japonês).

**Proibido:**
- borda creme larga em caixa (sobra do desenho antigo, já varrida);
- lima sobre lima, ou qualquer cor sobre ela mesma;
- flash de tela inteira no acerto — a cor inunda só o painel;
- texto abaixo de 4.5:1 de contraste.

**O mascote:** é o gato M2, de frente na capa e espiando por baixo durante
o estudo. Ele reage ao que acontece (olhando, acertou). Tem
`pointer-events: none` e **nunca pode ficar por cima de um botão**.

## Regras gerais

- **G1.** Português simples, sem jargão, mensagens curtas. O Lucas abre e
  olha por conta própria — não precisa de descrição longa da tela.
- **G2.** Nunca usar `l`, `I` ou `O` como nome de variável.
- **G3.** Ao mandar um trecho dentro de uma função: primeiro a linha que
  muda ou nasce, logo em seguida o bloco inteiro.
- **G4.** Substituir função inteira, nunca recortar um pedaço do meio.
- **G5.** Nomes de variável e função em português.
- **G6.** Sem framework, sem build, sem CDN. Tem que funcionar offline.
- **G7.** Conferir a diagramação antes de entregar, com o
  `conferir-layout.mjs`. Não mostrar nada quebrado.
- **G8.** Nada do material do curso dentro do repositório público.
- **G9.** Antes de mexer na memória, fazer backup no console:
  `copy(localStorage.getItem("kana-sensei-v3"))`
- **G10.** Testar em `localhost:8000` e no iPhone antes de publicar.

## Checklist de conferência

- [ ] o detector de diagramação passa limpo (11 cenas × 6 larguras). Ele
      roda do lado da máquina, com Playwright — não está no repositório
      porque pediria instalação aqui
- [ ] celular 390px e desktop 1300px
- [ ] sem sobreposição, sem texto cortado, sem rolagem para o lado
- [ ] sem erro no console
- [ ] contraste de 4.5:1 em todo texto
- [ ] no iPhone, o campo de digitar termina antes de 457px (o teclado
      começa em 516px)
- [ ] a tela de desenhar cabe nos 852px sem rolagem
- [ ] o gato não está por cima de nenhum botão
- [ ] rolando até embaixo, nenhum botão fica preso atrás da barra de abas

## Privacidade e dados sensíveis

- **A chave do ElevenLabs apareceu num print e precisa ser revogada.**
- `.elevenlabs.json` guarda a chave da API. Fica no `.gitignore`, nunca no
  repositório.
- `.gitignore` tem: `.elevenlabs.json`, `backup/`, `.DS_Store`,
  `node_modules/`, `falhas.json`.
- O conteúdo do PDF do curso é da **@onigiri nihongo**. Serve para o estudo
  do Lucas. **O app não pode ser publicado com esse material dentro.** A
  estrutura é nossa; o conteúdo é pessoal. O app deve deixar cada pessoa
  colocar o próprio material.

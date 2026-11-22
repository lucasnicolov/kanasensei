# Decisões

Uma entrada por decisão: o que estava em jogo, a escolha, o porquê, e o que
foi descartado. O descarte também é direção.

---

## 2026-11-22 · Estrutura · R4 — dois módulos e os modos de carta

**Em jogo:** como separar o silabário das cartas, já que tudo cabia numa
tela só de abertura e estava virando lista sem fim.

**Opções:** A duas placas (uma tela para escolher, depois entra no módulo) ·
B abas no topo (a chave fica à vista, tudo numa tela) · C trilhas (uma
lista que cresce com os baralhos) · D a pilha de hoje (o app monta e você
tira o que não quer — a diferentona).

**Escolhido:** **A · Duas placas.** "eu gosto mais da opção A das duas
placas".

**Descartado:** B apertava quando os ajustes crescessem; C era a que mais
escalava mas mudava demais a cara da abertura; D invertia o controle, que
é justamente o que ele queria mais, não menos.

**O que mudou junto:**
- a tela Aprender tem três estados: módulos, Silabários e Cartas;
- a escolha de recorte (silabário, parte, habilidade) saiu dos três
  `<select>` de Praticar e virou botões na tela Silabários;
- "Misturar os dois" continua existindo, como um botão abaixo das placas;
- modos de carta: **Cartas**, **Quiz** (escolhe entre quatro, metade das
  vezes de trás para frente) e **Escrever** (digita em romaji, o app
  mostra virando em kana). Pesos 0.5, 0.7 e 1.2.

**Sobre o texto colado:** fica onde está. Uma carta tem dois lados; o texto
não tem verso, ele é material de leitura de onde saem kana e trechos.

**Bug corrigido na mesma rodada:** com o foco em katakana o app só servia a
letra ア. O limite de coisas novas no ar era contado no app inteiro e a
letra nova era procurada só dentro do foco — quem estava no meio do
hiragana nunca destravava um katakana novo. Agora o limite é contado
dentro do foco.

**Ainda por fazer:** o modo **Combinar** (ligar os pares contra o relógio).

---

## 2026-11-04 · Frases · R3 — o verso e o baralho

**Em jogo:** dois pontos que o Lucas apontou depois de rodar a carta rápida.

**1. O verso mostra a leitura.** O japonês volta no verso com o romaji
embaixo de cada kana, para conferir se leu certo. Os pares vão agrupados
por palavra, senão a frase quebra no meio de 「たべます」. O っ pega a
consoante do kana seguinte, o ー estica a vogal de antes, e a pontuação
viaja junto com o kana anterior em vez de cair sozinha na linha de baixo.

**2. A lista virou baralho.** Com 163 cartas a tela virava rolagem sem fim.
Agora a tela mostra só a capa — o total, quantas pedem revisão, a média de
memória — e as cartas ficam dentro, em página de 25, com busca. Abrir uma
carta mostra Editar e Remover. Editar é novo: dá para arrumar os três
campos sem apagar e colar de novo, e a memória da carta continua.

**Palavras do Lucas:** "fica a carta embaixo da outra, daqui a pouco com
200 cartas vai ficar rolagem infinita, precisa ser um deck".

---

## 2026-11-04 · Frases · R2 — a carta rápida em código

**Em jogo:** de onde vem o conteúdo das cartas, já que o material do curso
não pode ir junto com o app.

**Escolhido:** o baralho é do aluno. O app não vem com carta nenhuma; na
tela Praticar existe um campo para colar as suas, uma por linha:

    japonês = português | nota

**Por quê:** resolve a regra G8 sem abrir mão de nada. O Lucas cola o curso
dele e estuda; outra pessoa cola o material dela. Segue o mesmo caminho que
o app já usava para os textos colados.

**Peso:** a carta vale 0.5 contra 1.0 de uma pergunta de escolha e 1.5 de
uma digitada. Olhar e lembrar é mais fácil do que escrever, então a
meia-vida cresce menos. A memória é a mesma: a carta tem ficha em
`progresso` com id `c:1`, na direção "ler".

**Descartado:** embutir as cartas num arquivo do repositório, e um app
separado só de cartas (decidido antes — o motor é o mesmo).

---

## 2026-11-04 · Frases · R1 — o exercício de montar

**Em jogo:** como o aluno treina uma frase inteira, agora que o curso virou
material do app.

**Opções:**
- **A · Bandeja** — peças na bandeja, toca na ordem. Veio do próprio app (o
  montar palavra). Testa a ordem inteira da frase.
- **B · Lacuna** — a frase quase pronta, falta uma peça, escolhe entre três.
  Veio da frase de exemplo do PDF. Testa só a partícula.
- **C · Ditado** — escreve a frase toda em kana. Veio da linha em branco do
  "Monta essas frases". Junta kana e gramática.
- **D · Molde** (a diferentona) — preenche as vagas do padrão `S を V ます`,
  com S e V marcados. Veio da notação da própria apostila.

**Escolhido:** **A · Bandeja** e **C · Ditado**, os dois.

**Por quê (palavras do Lucas):** "bandeja e ditado sao os q mais gostei".
Eles cobrem as duas pontas: a bandeja dá a ordem da frase sem exigir
escrever, o ditado cobra tudo junto. Convivem como tipos de exercício, do
mesmo jeito que escolher, digitar e desenhar já convivem no kana.

**Descartado:**
- **B · Lacuna** — testava pouco de cada vez. Fica guardada como possível
  exercício de aquecimento se o ditado se mostrar duro demais no começo.
- **D · Molde** — ensinava a gramática na abstração, longe da frase. Boa
  ideia, mas é outro tipo de estudo; não é treino de frase.

**Também aprovado na mesma rodada:** o fluxo inteiro ("fila 1 eu gostei de
tudo") — a tela de escolher o que estudar (Kana / Frases / Tudo, e repassar
ou treinar), a carta de frente, a carta de verso com ESCAPOU / LEMBREI, e a
tela de montar.

---

## Decisões anteriores

Registradas de uma vez em 2026-11-04, de memória das conversas. As datas
exatas não ficaram anotadas na época.

### A direção de arte — o gato

**Em jogo:** o app tinha um visual preto sobre papel que não agradava mais.

**Caminho:** duas variantes sóbrias de CSS foram feitas e **rejeitadas** —
"não gostei, esquece essa estrutura não fique presa nela". Então três
direções novas no Figma: **V1 Hinomaru** (tradicional japonês moderno),
**V2 Riso** (contraste alto, personagem, neon), **V3 Painel** (painel de
controle antigo).

**Escolhido:** **V2 Riso.** "gostei muito da do gato a V2."

**Depois:** quatro mascotes (M1 low-poly, M2 gato sério, M3 carinhas tipo
Bomberman, M4 só a cabeça espiando). Escolhidos **M2 e M4** — e virou um só:
o M2 espiando, igual ao enquadramento do M4.

**Ajuste pedido:** o olho neutro do M2 parecia triste. Duas correções: a
barriga do olho ficou redonda em vez de reta, e a inclinação virou ao
contrário, com o canto de fora mais alto que o de dentro.

**Descartado:** V1 e V3 inteiras; M1 e M3.

### Cards tipo Anki: módulo dentro, não app separado

**Em jogo:** "to aqui em 5 minutos de pausa, jogar uma rodada so com os
cards" — valia fazer outro app?

**Escolhido:** módulo dentro do Kana Sensei.

**Por quê:** o motor de memória já é genérico. `lembranca(memoria)` só
precisa de `{meiaVida, ultimaVez}`, e `fichaDe(id)` cria ficha para
qualquer texto de id. O `peso` no `anotar()` é o que deixa os dois modos
dividirem a mesma memória: a carta rápida vale menos que o exercício
inteiro, mas conta na mesma ficha.

**Palavras do Lucas:** "eu acho q uma coisa não elimina a outra."

### A escada do curso

**Escolhido:** seguir a ordem das unidades do curso, em vez de inventar uma
progressão.

**Como:** o `extrair-curso.py` lê o PDF e gera o `padroes.json` — 29
unidades, 266 exemplos, 163 enunciados, 220 gabaritos. A quebra de unidade é
a página MEMO. Cada exemplo já vem com os `pedacos` (as palavras separadas,
de graça, porque o material usa espaço largo). 188 das 266 frases têm de 3 a
5 peças, que é o tamanho bom para montar.

**Limite:** o conteúdo é da @onigiri nihongo e **não vai para o repositório
público** (ver G8).

### As gravações de voz

**Escolhido:** nas sequências, tocar um arquivo de kana atrás do outro, na
voz gravada, em vez de uma gravação da sequência inteira.

**Depois:** as gravações foram **desligadas por enquanto** (o Lucas está
refazendo sons e palavras), mas a pasta continua no git. O app cai na voz do
sistema sozinho.

### O flash de acerto

**Escolhido:** a cor inunda só o painel, não a tela inteira.

**Por quê:** foi escolha da máquina, avisada na hora. Vinte flashes de tela
cheia por sessão é problema de acessibilidade. Fica a oferta de voltar atrás
se o Lucas quiser.

# Onde paramos

Atualizado em 2026-11-22.

## Aprovado e no ar

O app de kana inteiro, já na direção nova (gato, fundo escuro, lima e rosa):
capa, aprender, praticar, progresso, e os exercícios de escolher, digitar e
desenhar. As gravações de voz estão desligadas, caindo na voz do sistema.

## Feito, esperando teste

A **estrutura de dois módulos** (opção A, duas placas) e os modos **Quiz** e
**Escrever** nas cartas. O painel de foco antigo saiu de Praticar: agora o
recorte se escolhe em botões, na tela Silabários.

Também corrigido: com o foco em katakana o app só servia a letra ア.

## Feito antes, já no ar

A **carta rápida**, em código, nos três arquivos do app:

- o baralho é colado pelo aluno na tela Praticar (`japonês = português | nota`);
- a tela de abertura ganhou **O que estudar**: Kana, Cartas ou Tudo, e ela
  só aparece quando existe baralho;
- a carta vira no toque e responde com **Escapou** / **Lembrei**;
- no teclado: espaço vira, 1 escapou, 2 lembrei;
- o verso mostra o kana de novo com o romaji embaixo de cada um;
- o baralho tem capa, busca, página de 25, editar e remover.

Falta o Lucas testar em `localhost:8000` e no iPhone, e publicar.

## Aprovado e ainda por fazer

O modo **Combinar** das cartas (ligar os pares contra o relógio), e os dois
exercícios de montar escolhidos na R1: **Bandeja** e **Ditado**. O desenho está no Figma, na seção
"Frases — R1 · o fluxo inteiro e as opções de montar".

## Pronto para usar

- `padroes.json` — o curso inteiro extraído do PDF: 29 unidades, 266
  exemplos, 163 enunciados, 220 gabaritos, com as frases já separadas em
  peças. **Fica fora do repositório público.**
- `cartas-do-curso.txt` — as 163 frases do curso já no formato de colar.
  **Também fica fora do repositório.**
- `conferir-layout.mjs` — o detector de diagramação.

## Próximos passos, em ordem

1. Testar os dois módulos e publicar.
2. O modo **Combinar**.
3. A **Bandeja** em código, depois o **Ditado**.
3. Os pontos de melhoria que o Lucas ainda tem para passar, um por um — ele
   está mexendo nos textos.

## Ideias que já apareceram

- Os traços de katakana no `caminhos.js` (hoje só tem hiragana).
- Um servidor com conta, para a memória acompanhar entre o computador e o
  iPhone. Virou necessidade dos dois módulos, não só de um.
- A **Lacuna** (a frase com uma peça faltando) como aquecimento, se o ditado
  se mostrar duro demais no começo.

## Para retomar

É só dizer: **vamos continuar o Kana Sensei**.

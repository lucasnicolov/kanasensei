// ===== REDE DE SEGURANCA =====

// o caminhos.js e um arquivo separado. se ele faltar ou falhar em carregar,
// o app inteiro morria aqui. agora ele so perde o tracado e segue vivo,
// exatamente como ja acontece com o katakana, que ainda nao tem tracos.
if (typeof CAMINHOS === "undefined") {
    window.CAMINHOS = {};
    console.warn("caminhos.js nao carregou: o exercicio de escrever fica de fora.");
}

// ===== OS DADOS =====

const LINHAS = [
    { id: "a", sons: "a i u e o", kana: "あいうえお" },
    { id: "k", sons: "ka ki ku ke ko", kana: "かきくけこ" },
    { id: "s", sons: "sa shi su se so", kana: "さしすせそ" },
    { id: "t", sons: "ta chi tsu te to", kana: "たちつてと" },
    { id: "n", sons: "na ni nu ne no", kana: "なにぬねの" },
    { id: "h", sons: "ha hi fu he ho", kana: "はひふへほ" },
    { id: "m", sons: "ma mi mu me mo", kana: "まみむめも" },
    { id: "y", sons: "ya yu yo", kana: "やゆよ" },
    { id: "r", sons: "ra ri ru re ro", kana: "らりるれろ" },
    { id: "w", sons: "wa wo n", kana: "わをん" }
];

const DAKUTEN = [
    { id: "g", sons: "ga gi gu ge go", kana: "がぎぐげご" },
    { id: "z", sons: "za ji zu ze zo", kana: "ざじずぜぞ" },
    { id: "d", sons: "da dji dzu de do", kana: "だぢづでど" },
    { id: "b", sons: "ba bi bu be bo", kana: "ばびぶべぼ" },
    { id: "p", sons: "pa pi pu pe po", kana: "ぱぴぷぺぽ" }
];

const YOON = [
    { id: "ky", sons: "kya kyu kyo", kana: "きゃきゅきょ" },
    { id: "sy", sons: "sha shu sho", kana: "しゃしゅしょ" },
    { id: "ty", sons: "cha chu cho", kana: "ちゃちゅちょ" },
    { id: "ny", sons: "nya nyu nyo", kana: "にゃにゅにょ" },
    { id: "hy", sons: "hya hyu hyo", kana: "ひゃひゅひょ" },
    { id: "my", sons: "mya myu myo", kana: "みゃみゅみょ" },
    { id: "ry", sons: "rya ryu ryo", kana: "りゃりゅりょ" },
    { id: "gy", sons: "gya gyu gyo", kana: "ぎゃぎゅぎょ" },
    { id: "jy", sons: "ja ju jo", kana: "じゃじゅじょ" },
    { id: "by", sons: "bya byu byo", kana: "びゃびゅびょ" },
    { id: "py", sons: "pya pyu pyo", kana: "ぴゃぴゅぴょ" }
];

const GRAFIAS = {
    shi: "si", chi: "ti", tsu: "tu", fu: "hu", wo: "o", n: "nn",
    ji: "zi", dji: "di ji", dzu: "du zu",
    sha: "sya", shu: "syu", sho: "syo",
    cha: "tya cya", chu: "tyu cyu", cho: "tyo cyo",
    ja: "jya zya", ju: "jyu zyu", jo: "jyo zyo"
};

const PEQUENOS = "ゃゅょャュョ";
const MARCAS = "っッー";
const DESLOCAMENTO_KATAKANA = 0x60;

function dividirEmKanas(texto) {
    const unidades = [];

    for (const caractere of texto) {
        if (PEQUENOS.includes(caractere) && unidades.length > 0) {
            unidades[unidades.length - 1] = unidades[unidades.length - 1] + caractere;
        } else {
            unidades.push(caractere);
        }
    }

    return unidades;
}

function paraKatakana(texto) {
    let saida = "";

    for (const caractere of texto) {
        saida = saida + String.fromCodePoint(caractere.codePointAt(0) + DESLOCAMENTO_KATAKANA);
    }

    return saida;
}

function paraHiragana(texto) {
    let saida = "";

    for (const caractere of texto) {
        const ponto = caractere.codePointAt(0);
        const eKatakana = ponto >= 0x30A1 && ponto <= 0x30F6;

        saida = saida + (eKatakana ? String.fromCodePoint(ponto - DESLOCAMENTO_KATAKANA) : caractere);
    }

    return saida;
}

const SILABARIOS = [
    { id: "h", nome: "Hiragana", rotulo: "ひらがな", vira: false },
    { id: "k", nome: "Katakana", rotulo: "カタカナ", vira: true }
];

const GRUPOS = [
    { id: "basico", nome: "Básico", linhas: LINHAS },
    { id: "dakuten", nome: "Dakuten", linhas: DAKUTEN },
    { id: "yoon", nome: "Yōon", linhas: YOON }
];

const CARACTERES = [];

for (const silabario of SILABARIOS) {
    for (const grupo of GRUPOS) {
        for (const linha of grupo.linhas) {
            const sons = linha.sons.split(" ");
            const kanas = dividirEmKanas(linha.kana);

            for (let i = 0; i < sons.length; i++) {
                const som = sons[i];
                const extras = GRAFIAS[som] === undefined ? [] : GRAFIAS[som].split(" ");

                CARACTERES.push({
                    id: silabario.id + ":" + som,
                    som: som,
                    kana: silabario.vira ? paraKatakana(kanas[i]) : kanas[i],
                    silabario: silabario.id,
                    grupo: grupo.id,
                    linha: linha.id,
                    grafias: [som, ...extras]
                });
            }
        }
    }
}

const SILABAS = {};

for (const caractere of CARACTERES) {
    if (caractere.silabario !== "h") {
        continue;
    }

    for (const grafia of caractere.grafias) {
        if (SILABAS[grafia] === undefined) {
            SILABAS[grafia] = caractere.kana;
        }
    }
}

const PALAVRAS_BRUTAS = [
    ["あい", "amor"], ["あお", "azul"], ["あか", "vermelho"],
    ["あき", "outono"], ["あさ", "manhã"], ["あし", "pé, perna"],
    ["あした", "amanhã"], ["あたま", "cabeça"], ["あと", "depois"],
    ["あな", "buraco"], ["あなた", "você"], ["あに", "irmão mais velho"],
    ["あね", "irmã mais velha"], ["あめ", "chuva"], ["あらし", "tempestade"],
    ["あり", "formiga"], ["いえ", "casa"], ["いか", "lula"],
    ["いけ", "lago"], ["いし", "pedra"], ["いす", "cadeira"],
    ["いち", "um"], ["いつ", "quando"], ["いぬ", "cachorro"],
    ["いま", "agora"], ["いもうと", "irmã mais nova"], ["いろ", "cor"],
    ["うえ", "em cima"], ["うし", "vaca"], ["うそ", "mentira"],
    ["うた", "canção"], ["うち", "casa, lar"], ["うみ", "mar"],
    ["うら", "verso, atrás"], ["えき", "estação"], ["おかね", "dinheiro"],
    ["おと", "som"], ["おとこ", "homem"], ["おなか", "barriga"],
    ["おに", "ogro, demônio"], ["おもい", "pesado"], ["おわり", "fim"],
    ["かお", "rosto"], ["かさ", "guarda-chuva"], ["かたな", "espada"],
    ["かみ", "papel; cabelo"], ["かわ", "rio"], ["かんたん", "fácil, simples"],
    ["きた", "norte"], ["きって", "selo"], ["きのう", "ontem"],
    ["きもの", "quimono"], ["きらい", "não gostar"], ["くち", "boca"],
    ["くつ", "sapato"], ["くも", "nuvem"], ["くるま", "carro"],
    ["くろ", "preto"], ["けさ", "esta manhã"], ["こえ", "voz"],
    ["ここ", "aqui"], ["こころ", "coração"], ["ことし", "este ano"],
    ["こめ", "arroz cru"], ["さかな", "peixe"], ["さくら", "cerejeira"],
    ["さとう", "açúcar"], ["さむい", "frio"], ["さん", "três"],
    ["しあわせ", "felicidade"], ["しお", "sal"], ["しか", "cervo"],
    ["しろ", "branco"], ["すいか", "melancia"], ["すこし", "um pouco"],
    ["すし", "sushi"], ["すな", "areia"], ["せかい", "mundo"],
    ["せなか", "costas"], ["せまい", "estreito"], ["そと", "fora"],
    ["そら", "céu"], ["たいせつ", "importante"], ["たかい", "alto; caro"],
    ["たけ", "bambu"], ["たな", "prateleira"], ["ちいさい", "pequeno"],
    ["ちかてつ", "metrô"], ["ちから", "força"], ["つき", "lua"],
    ["つくえ", "escrivaninha"], ["つち", "terra, solo"], ["つめたい", "gelado"],
    ["て", "mão"], ["てら", "templo"], ["てんき", "tempo, clima"],
    ["とおい", "longe"], ["とけい", "relógio"], ["とし", "ano; idade"],
    ["とり", "pássaro"], ["なか", "dentro"], ["なつ", "verão"],
    ["なに", "o quê"], ["なまえ", "nome"], ["なみ", "onda"],
    ["にく", "carne"], ["にし", "oeste"], ["にわ", "jardim"],
    ["ぬの", "tecido"], ["ねこ", "gato"], ["ねつ", "febre"],
    ["ねむい", "com sono"], ["のはら", "campo"], ["は", "dente"],
    ["はこ", "caixa"], ["はし", "ponte; hashi"], ["はたけ", "roça, horta"],
    ["はな", "flor; nariz"], ["はやい", "rápido"], ["はる", "primavera"],
    ["はれ", "céu limpo"], ["ひかり", "luz"], ["ひこうき", "avião"],
    ["ひと", "pessoa"], ["ひとつ", "uma unidade"], ["ひる", "meio-dia"],
    ["ふく", "roupa"], ["ふたつ", "duas unidades"], ["ふね", "barco"],
    ["ふゆ", "inverno"], ["へた", "desajeitado"], ["へや", "quarto"],
    ["ほし", "estrela"], ["ほそい", "fino"], ["ほん", "livro"],
    ["まえ", "frente"], ["まくら", "travesseiro"], ["まち", "cidade"],
    ["まつ", "pinheiro; esperar"], ["まる", "círculo"], ["みせ", "loja"],
    ["みち", "caminho"], ["みなみ", "sul"], ["みみ", "orelha"],
    ["みる", "ver"], ["むし", "inseto"], ["むすこ", "filho"],
    ["め", "olho"], ["もち", "bolinho de arroz"], ["もの", "coisa"],
    ["もり", "floresta"], ["もん", "portão"], ["やさい", "legume"],
    ["やすみ", "descanso, folga"], ["やま", "montanha"], ["ゆか", "chão"],
    ["ゆき", "neve"], ["ゆめ", "sonho"], ["よこ", "lado"],
    ["よむ", "ler"], ["よる", "noite"], ["らいねん", "ano que vem"],
    ["りす", "esquilo"], ["るす", "ausente de casa"], ["れきし", "história"],
    ["ろく", "seis"], ["わかい", "jovem"], ["わたし", "eu"],
    ["わに", "crocodilo"], ["ぬま", "pântano"], ["ぬるい", "morno"],
    ["へそ", "umbigo"], ["へいわ", "paz"], ["ほね", "osso"],
    ["ほのお", "chama"], ["よっつ", "quatro unidades"], ["おはよう", "bom dia"],
    ["これ", "isto"], ["それ", "isso"], ["きれい", "bonito, limpo"],
    ["ほんをよむ", "ler um livro"], ["うたをうたう", "cantar uma canção"], ["やまをみる", "ver a montanha"],
    ["ふくをきる", "vestir a roupa"], ["さけ", "saquê"], ["すもう", "sumô"],
    ["ちり", "poeira"], ["ゆうひ", "sol poente"], ["おおきい", "grande"],
    ["すくない", "pouco"], ["おおい", "muito, numeroso"], ["かぞく", "família"],
    ["でんわ", "telefone"], ["がっこう", "escola"], ["じかん", "hora, tempo"],
    ["しんぶん", "jornal"], ["たべもの", "comida"], ["でぐち", "saída"],
    ["どうぞ", "por favor"], ["げんき", "bem, disposto"], ["ぎんこう", "banco"],
    ["でんしゃ", "trem"], ["かぎ", "chave"], ["かぜ", "vento; resfriado"],
    ["みず", "água"], ["たまご", "ovo"], ["ともだち", "amigo"],
    ["にほんご", "japonês"], ["えいご", "inglês"], ["ごはん", "arroz; refeição"],
    ["かばん", "bolsa"], ["ぼうし", "chapéu"], ["くだもの", "fruta"],
    ["でんき", "luz, eletricidade"], ["まど", "janela"], ["ぶんか", "cultura"],
    ["おんがく", "música"], ["どようび", "sábado"], ["じしょ", "dicionário"],
    ["ざっし", "revista"], ["ちず", "mapa"], ["はなび", "fogos de artifício"],
    ["せんせい", "professor"], ["がくせい", "estudante"], ["だいがく", "universidade"],
    ["どうぶつ", "animal"], ["ぜんぶ", "tudo"], ["はんぶん", "metade"],
    ["じぶん", "si mesmo"], ["にほん", "Japão"], ["あぶない", "perigoso"],
    ["しずか", "quieto"], ["さんぽ", "passeio"], ["かんじ", "kanji"],
    ["ひらがな", "hiragana"], ["ぶた", "porco"], ["うで", "braço"],
    ["ゆび", "dedo"], ["あたらしい", "novo"], ["きょう", "hoje"],
    ["べんきょう", "estudo"], ["じてんしゃ", "bicicleta"], ["かいしゃ", "empresa"],
    ["しゅくだい", "dever de casa"], ["りょこう", "viagem"], ["じゅぎょう", "aula"],
    ["おちゃ", "chá"], ["しゃしん", "foto"], ["ひゃく", "cem"],
    ["ちょっと", "um pouco"], ["びょういん", "hospital"], ["ばしょ", "lugar"],
    ["りょうり", "culinária"], ["やきゅう", "beisebol"], ["じゅう", "dez"],
    ["きゅう", "nove"], ["とうきょう", "Tóquio"], ["しゃちょう", "presidente da empresa"],
    ["おきゃく", "cliente"], ["ちゃいろ", "marrom"], ["しゅみ", "hobby"],
    ["じょうず", "habilidoso"], ["りゅう", "dragão"], ["コーヒー", "café"],
    ["テレビ", "televisão"], ["パン", "pão"], ["ノート", "caderno"],
    ["カメラ", "câmera"], ["ホテル", "hotel"], ["タクシー", "táxi"],
    ["ビール", "cerveja"], ["ケーキ", "bolo"], ["バス", "ônibus"],
    ["ペン", "caneta"], ["ドア", "porta"], ["テスト", "prova"],
    ["ミルク", "leite"], ["サラダ", "salada"], ["スープ", "sopa"],
    ["ラジオ", "rádio"], ["ギター", "violão"], ["ピアノ", "piano"],
    ["アメリカ", "Estados Unidos"], ["ブラジル", "Brasil"], ["メール", "e-mail"],
    ["パソコン", "computador"], ["チョコレート", "chocolate"], ["アニメ", "anime"],
    ["ゲーム", "jogo"], ["シャツ", "camisa"], ["スポーツ", "esporte"],
    ["レストラン", "restaurante"], ["カレー", "curry"], ["ジュース", "suco"],
    ["アイス", "sorvete"], ["ボール", "bola"], ["ネクタイ", "gravata"],
    ["スカート", "saia"], ["カード", "cartão"], ["ニュース", "notícias"],
    ["クラス", "turma"], ["ページ", "página"], ["ポケット", "bolso"],
    ["セーター", "suéter"], ["トイレ", "banheiro"], ["ナイフ", "faca"],
    ["スプーン", "colher"], ["コップ", "copo"], ["ベッド", "cama"],
    ["シャワー", "chuveiro"], ["タオル", "toalha"], ["バナナ", "banana"],
    ["オレンジ", "laranja"], ["トマト", "tomate"], ["レモン", "limão"],
    ["メロン", "melão"], ["カラオケ", "caraoquê"], ["サッカー", "futebol"],
    ["テニス", "tênis"], ["ズボン", "calça"], ["コート", "casaco"],
    ["ピザ", "pizza"], ["チーズ", "queijo"], ["ワイン", "vinho"],
    ["バター", "manteiga"], ["ヨーグルト", "iogurte"], ["ドラマ", "novela"],
    ["モデル", "modelo"], ["カレンダー", "calendário"], ["プレゼント", "presente"],
    ["ビデオ", "vídeo"], ["スマホ", "celular"], ["シャンプー", "xampu"],
    ["ハンバーガー", "hambúrguer"], ["サンドイッチ", "sanduíche"], ["かんぱい", "um brinde"],
    ["えんぴつ", "lápis"], ["てんぷら", "tempurá"], ["いっぱい", "cheio, muito"],
    ["ちゅうい", "atenção"], ["ぎゅうにゅう", "leite"], ["じゃがいも", "batata"],
    ["じゃま", "estorvo"], ["ぎゃく", "o contrário"], ["ひょう", "tabela"],
    ["みょうじ", "sobrenome"], ["にゅうがく", "ingresso na escola"], ["ウイスキー", "uísque"],
    ["エレベーター", "elevador"], ["ヌードル", "macarrão"], ["ヘルメット", "capacete"],
    ["タイヤ", "pneu"], ["ユーモア", "humor"], ["ゴルフ", "golfe"],
    ["ゴミ", "lixo"], ["リゾート", "resort"], ["キャンプ", "acampamento"],
    ["キャベツ", "repolho"], ["ショップ", "loja"], ["チャンス", "chance"],
    ["チューリップ", "tulipa"], ["リュック", "mochila"], ["ジョギング", "corrida"],
    ["ギョーザ", "guioza"], ["ミュージック", "música"], ["シュート", "chute"],
    ["キョリ", "distância"]
];

const PALAVRAS = [];

for (const bruta of PALAVRAS_BRUTAS) {
    const unidades = dividirEmKanas(bruta[0]);
    const kanas = unidades.filter(u => !MARCAS.includes(u));

    PALAVRAS.push({
        kana: bruta[0],
        significado: bruta[1],
        unidades: unidades,
        kanas: kanas,
        silabario: bruta[0].codePointAt(0) >= 0x30A1 ? "k" : "h"
    });
}

const SEMELHANTES = [
    "ぬめの", "ねれわ", "はほけ", "さちき", "いりこ", "るろそ",
    "まもほ", "たなに", "くへ", "しつもう", "すむお", "うらつ",
    "ゆよ", "てそ", "みめ", "をと", "あお", "にこ",
    "シツソン", "ノメヌス", "クタワケ", "ラテチ", "マムア",
    "ルレノ", "コユエ", "セヒ", "オホ", "ニミ",
    "ウワフヲ", "リハソ", "キサ", "ヨヲ", "トイ", "ンレ",
    "へヘ", "りリ", "かカ", "やヤ", "せセ", "もモ"
];

const PARECIDOS = {};

for (const grupo of SEMELHANTES) {
    for (const caractere of grupo) {
        if (PARECIDOS[caractere] === undefined) {
            PARECIDOS[caractere] = [];
        }

        for (const outro of grupo) {
            if (outro !== caractere && !PARECIDOS[caractere].includes(outro)) {
                PARECIDOS[caractere].push(outro);
            }
        }
    }
}

const DICAS = {
    "ぬめ": "ぬ termina com um laço; め não tem laço.",
    "ぬの": "の é um traço só, em espiral; ぬ tem dois e termina em laço.",
    "めの": "の é um traço só; め são dois traços cruzados.",
    "ねれ": "ね termina em laço; れ termina com uma perninha pra fora.",
    "ねわ": "ね termina em laço; わ fecha numa curva sem laço.",
    "れわ": "れ vira pra fora no fim; わ vira pra dentro.",
    "はほ": "ほ tem um traço horizontal a mais no alto da parte direita.",
    "はけ": "は tem um laço embaixo à direita; け não.",
    "さち": "São espelhados: a curva de さ abre pra direita, a de ち pra esquerda.",
    "さき": "き tem dois traços horizontais; さ tem um só.",
    "いり": "Em い o traço da esquerda é o longo; em り é o da direita.",
    "るろ": "る termina em laço; ろ termina aberto.",
    "まも": "ま termina em laço; も termina num gancho aberto.",
    "たな": "た tem dois tracinhos à direita; な tem um traço que desce e faz laço.",
    "くへ": "く é um “<” em pé; へ é um “^” deitado.",
    "しつ": "し desce e curva pra direita; つ vai pra direita e curva pra baixo.",
    "すむ": "す tem laço no traço vertical; む tem laço à esquerda e um tracinho extra.",
    "うら": "Em う o traço de baixo começa horizontal; em ら ele desce na vertical.",
    "ゆよ": "ゆ tem um laço grande à esquerda; よ tem um laço pequeno embaixo.",
    "あお": "あ tem o traço vertical cruzando; お tem um pontinho no canto de cima.",
    "をと": "を tem três traços em zigue-zague; と tem dois.",

    "シツ": "シ: os dois tracinhos entram quase deitados, da esquerda. ツ: entram quase em pé, de cima.",
    "ソン": "ソ: o tracinho é quase vertical, de cima pra baixo. ン: é quase horizontal, de baixo pra cima.",
    "シソ": "シ tem dois tracinhos; ソ tem um só.",
    "ツン": "ツ tem dois tracinhos; ン tem um só.",
    "シン": "シ tem dois tracinhos; ン tem um só. Os dois entram deitados.",
    "ツソ": "Os dois têm o traço em pé, mas ツ tem dois tracinhos e ソ tem um.",
    "ノメ": "メ é um X com dois traços; ノ é um traço só.",
    "ノヌ": "ヌ tem um traço horizontal por cima; ノ não tem.",
    "スヌ": "ヌ tem o traço horizontal atravessando o topo; ス não.",
    "クタ": "タ tem um tracinho a mais atravessando por dentro.",
    "クワ": "ク tem o canto de cima anguloso; ワ é arredondada e larga.",
    "ワウ": "ウ tem o tracinho vertical no topo; ワ não tem.",
    "ラウ": "ウ tem o tracinho vertical no topo; ラ tem só o gancho.",
    "ラテ": "テ tem dois traços horizontais; ラ tem um e o gancho desce.",
    "チテ": "チ tem o traço diagonal cortando; テ tem dois horizontais paralelos.",
    "コユ": "ユ tem um traço vertical descendo do meio; コ é só o gancho.",
    "ルレ": "ル tem dois traços separados; レ tem um só.",
    "ニミ": "ミ tem três traços; ニ tem dois.",
    "オホ": "ホ tem dois pezinhos embaixo; オ tem um gancho só.",
    "アマ": "ア tem um tracinho curto na diagonal; マ desce num traço longo.",
    "マム": "ム é aberto embaixo; マ tem o gancho fechado em cima.",
    "セヒ": "セ tem o traço horizontal cruzando por cima; ヒ tem embaixo.",
    "キサ": "キ tem dois horizontais cortados por um vertical; サ tem o vertical descendo pela direita.",
    "リハ": "リ tem os dois traços curvando pra dentro; ハ abre pra fora.",
    "へヘ": "São quase idênticos: へ é hiragana e ヘ é katakana. O contexto é quem diz qual é.",
    "りリ": "り é mais curvo e os traços se aproximam; リ é mais reto e reto pra baixo.",
    "かカ": "か tem o tracinho extra à direita; カ não tem.",
    "やヤ": "や tem a curva à esquerda; ヤ é feito de traços retos.",
    "せセ": "せ tem o traço vertical cruzando e a curva final; セ é só o gancho.",
    "もモ": "も tem o gancho grande descendo; モ é todo reto."
};

function dicaPara(a, b) {
    return DICAS[a + b] || DICAS[b + a] || null;
}

const TRACOS = {
    "あ": 3, "い": 2, "う": 2, "え": 2, "お": 3, "か": 3, "き": 4, "く": 1, "け": 3, "こ": 2,
    "さ": 3, "し": 1, "す": 2, "せ": 3, "そ": 1, "た": 4, "ち": 2, "つ": 1, "て": 1, "と": 2,
    "な": 4, "に": 3, "ぬ": 2, "ね": 2, "の": 1, "は": 3, "ひ": 1, "ふ": 4, "へ": 1, "ほ": 4,
    "ま": 3, "み": 2, "む": 3, "め": 2, "も": 3, "や": 3, "ゆ": 2, "よ": 2, "ら": 2, "り": 2,
    "る": 1, "れ": 2, "ろ": 1, "わ": 2, "を": 3, "ん": 1
};

const HABILIDADES = {
    ler: { nome: "Reconhecer", descricao: "ver o caractere e dizer o som" },
    escrever: { nome: "Identificar", descricao: "ver o som e achar o caractere" },
    ouvir: { nome: "Ouvir", descricao: "ouvir e achar o caractere" },
    desenhar: { nome: "Escrever", descricao: "traçar na ordem certa" }
};

const FORMATOS = {
    "ler|escolha": "Reconhecer (escolha)",
    "ler|digitar": "Digitar o som",
    "ler|palavra": "Ler palavras",
    "ler|sequencia": "Leitura rápida",
    "ler|trecho": "Ler um trecho do seu texto",
    "ouvir|trecho": "Ditado de um trecho",
    "escrever|lacuna": "Completar a lacuna",
    "escrever|escolha": "Som → caractere",
    "escrever|montar": "Montar a palavra",
    "ouvir|escolha": "Ouvir e escolher",
    "ouvir|sequencia": "Ditado",
    "desenhar|escolha": "Traçar o caractere"
};

const NAO_EM_SEQUENCIA = "をヲ";

// ===== AJUSTES =====

const PAUSA_ACERTO = 700;
const PAUSA_ACERTO_COM_SOM = 1200;

const MINUTO = 60 * 1000;

const MEIA_VIDA_INICIAL = 5;
const MEIA_VIDA_MAXIMA = 60 * 24 * 180;
const GANHO_MINIMO = 1.3;
const GANHO_EXTRA = 1.7;
const PERDA_ERRO = 0.4;

const PRIORIDADE_NOVO = 0.45;
const BONUS_FRAGIL = 0.5;
const BONUS_ERRO = 0.6;
const QUANTOS_CANDIDATOS = 5;

const DIRECOES = ["ler", "escrever", "ouvir", "desenhar"];
const PRIORIDADE_DIRECAO_NOVA = 0.5;
const VELOCIDADE_FALA = 0.8;

const TOLERANCIA_FORMA = 16;
const TOLERANCIA_POSICAO = 22;
const ERROS_ATE_AJUDA = 2;

const CHANCE_DIGITAR = 0.6;
const PESO_ESCOLHA = 1;
const PESO_DIGITAR = 1.5;

const MEIA_VIDA_APRENDIDO = 8;
const HISTORICO_RECENTE = 10;
const LIMITES = [
    { acerto: 0.75, limite: 8 },
    { acerto: 0.60, limite: 5 },
    { acerto: 0.00, limite: 3 }
];
const PENALIDADES = [0.05, 0.3, 0.6, 0.8];

const CHANCE_PALAVRA = 0.45;
const PESO_PALAVRA = 0.4;

const CHANCE_SEQUENCIA = 0.28;
const CHANCE_DITADO = 0.6;
const PESO_SEQUENCIA = 0.5;
const MINIMO_PARA_SEQUENCIA = 4;
const TENTATIVAS_DE_SEQUENCIA = 30;
const VELOCIDADE_DITADO = 0.65;
const TAMANHOS = [
    { conhecidos: 30, tamanho: 8 },
    { conhecidos: 20, tamanho: 6 },
    { conhecidos: 12, tamanho: 4 },
    { conhecidos: 0, tamanho: 3 }
];
const TAMANHO_MAXIMO_DITADO = 4;

const CHANCE_MONTAR = 0.45;
const TIPOS_DE_CONTEXTO = ["palavra", "montar", "sequencia", "trecho", "lacuna"];
const PESO_MONTAR = 0.5;
const MAXIMO_NA_MONTAGEM = 5;
const PECAS_EXTRAS = 4;
const MAXIMO_DE_PECAS = 10;
const PAUSA_ENTRE_KANAS = 420;

const CHAVE_TEXTOS = "kana-sensei-textos-v1";
const FIM_DE_FRASE = "。！？!?";
const PAUSA_NO_TEXTO = "、,";
const MAXIMO_NO_TRECHO = 14;
const MINIMO_NO_TRECHO = 2;
const PONTUACAO = "。、！？!?…「」『』（）()・～　 ,.;:";
const CHANCE_TRECHO = 0.55;
const PESO_TRECHO = 0.5;
const PESO_LACUNA = 0.6;
const MINIMO_PARA_LACUNA = 3;
const DUAS_LACUNAS_A_PARTIR_DE = 8;

const DURACAO_DO_TRACO = 0.6;
const INTERVALO_ENTRE_TRACOS = 0.75;

const CHAVE_HISTORICO = "kana-sensei-historico-v1";
const CHAVE_FORMATOS = "kana-sensei-formatos-v1";
const MINIMO_PARA_RANKING = 3;
const QUANTOS_NO_RANKING = 6;
const DIAS_NO_HISTORICO = 14;

const MINUTOS_FIRME = 60 * 24;
const MINUTOS_DOMINADO = 60 * 24 * 7;

const CHAVE_CONFUSOES = "kana-sensei-confusoes-v1";
const MEIA_VIDA_CONFUSAO = 14;
const PESO_CONFUSAO_MINIMO = 0.8;

// ===== ESTADO =====

let exercicio = null;
let respondido = false;
let botaoCerto = null;
let temporizador = null;
let total = 0;
let acertos = 0;
let ultimos = [];
let recentes = [];
let escolhida = null;
let confusoes = {};
let historico = {};
let formatos = {};
let textos = [];
let foco = { silabario: "", conjunto: "", direcao: "", texto: "" };
let posicaoNaFita = 0;
let errosNaFita = [];
let abaDoPainel = "resumo";
let abertos = { silabario: "h", grupo: "basico", linha: "" };

// ===== A MEMÓRIA =====

const CHAVE = "kana-sensei-v3";

let progresso = {};

function novaMemoria() {
    return {
        acertos: 0,
        erros: 0,
        ultimaVez: 0,
        meiaVida: 0,
        errouNaUltima: false
    };
}

function fichaDe(id) {
    if (progresso[id] === undefined) {
        progresso[id] = {};

        for (const direcao of DIRECOES) {
            progresso[id][direcao] = novaMemoria();
        }
    }

    return progresso[id];
}

function memoriaDe(id, direcao) {
    const ficha = progresso[id];

    if (ficha === undefined) {
        return null;
    }

    return ficha[direcao];
}

function foiApresentado(caractere) {
    return progresso[caractere.id] !== undefined;
}

function lembranca(memoria) {
    if (!memoria || memoria.meiaVida === 0) {
        return 0;
    }

    const minutos = (Date.now() - memoria.ultimaVez) / MINUTO;

    return Math.pow(2, -minutos / memoria.meiaVida);
}

function anotar(id, direcao, acertou, peso) {
    const memoria = fichaDe(id)[direcao];
    const lembrava = lembranca(memoria);

    if (acertou) {
        memoria.acertos = memoria.acertos + 1;

        if (memoria.meiaVida === 0) {
            memoria.meiaVida = MEIA_VIDA_INICIAL * peso;
        } else {
            const ganho = GANHO_MINIMO + GANHO_EXTRA * (1 - lembrava);
            memoria.meiaVida = memoria.meiaVida * Math.pow(ganho, peso);
        }
    } else {
        memoria.erros = memoria.erros + 1;
        memoria.meiaVida = Math.max(1, memoria.meiaVida * PERDA_ERRO);
    }

    memoria.meiaVida = Math.min(memoria.meiaVida, MEIA_VIDA_MAXIMA);
    memoria.errouNaUltima = !acertou;
    memoria.ultimaVez = Date.now();
    salvar();
}

function salvar() {
    localStorage.setItem(CHAVE, JSON.stringify(progresso));
}

function migrarIds() {
    const novoProgresso = {};
    let mudou = false;

    for (const id in progresso) {
        if (id.includes(":")) {
            novoProgresso[id] = progresso[id];
        } else {
            novoProgresso["h:" + id] = progresso[id];
            mudou = true;
        }
    }

    const novasConfusoes = {};

    for (const chave in confusoes) {
        const partes = chave.split(">");

        if (partes[0].includes(":")) {
            novasConfusoes[chave] = confusoes[chave];
        } else {
            novasConfusoes["h:" + partes[0] + ">h:" + partes[1]] = confusoes[chave];
            mudou = true;
        }
    }

    if (mudou) {
        progresso = novoProgresso;
        confusoes = novasConfusoes;
        localStorage.setItem(CHAVE, JSON.stringify(progresso));
        localStorage.setItem(CHAVE_CONFUSOES, JSON.stringify(confusoes));
    }
}

function carregar() {
    const texto = localStorage.getItem(CHAVE);

    if (texto !== null) {
        progresso = JSON.parse(texto);
    }

    for (const id in progresso) {
        for (const direcao of DIRECOES) {
            if (progresso[id][direcao] === undefined) {
                progresso[id][direcao] = novaMemoria();
            }
        }
    }

    const textoConfusoes = localStorage.getItem(CHAVE_CONFUSOES);

    if (textoConfusoes !== null) {
        confusoes = JSON.parse(textoConfusoes);
    }

    const textoHistorico = localStorage.getItem(CHAVE_HISTORICO);

    if (textoHistorico !== null) {
        historico = JSON.parse(textoHistorico);
    }

    const textoFormatos = localStorage.getItem(CHAVE_FORMATOS);

    if (textoFormatos !== null) {
        formatos = JSON.parse(textoFormatos);
    }

    const guardados = localStorage.getItem(CHAVE_TEXTOS);

    if (guardados !== null) {
        textos = JSON.parse(guardados);
    }

    migrarIds();
}

function reiniciar() {
    progresso = {};
    confusoes = {};
    historico = {};
    formatos = {};
    localStorage.removeItem(CHAVE);
    localStorage.removeItem(CHAVE_CONFUSOES);
    localStorage.removeItem(CHAVE_HISTORICO);
    localStorage.removeItem(CHAVE_FORMATOS);
    mostrarPainel();
}

// ===== AS CONFUSÕES =====

function anotarConfusao(alvoId, escolhidoId) {
    if (alvoId === escolhidoId) {
        return;
    }

    const chave = alvoId + ">" + escolhidoId;
    const registro = confusoes[chave] || { vezes: 0, ultimaVez: 0 };

    registro.vezes = registro.vezes + 1;
    registro.ultimaVez = Date.now();
    confusoes[chave] = registro;

    localStorage.setItem(CHAVE_CONFUSOES, JSON.stringify(confusoes));
}

function pesoConfusao(registro) {
    const dias = (Date.now() - registro.ultimaVez) / (24 * 60 * MINUTO);

    return registro.vezes * Math.pow(0.5, dias / MEIA_VIDA_CONFUSAO);
}

function confusoesDe(id) {
    const soma = {};

    for (const chave in confusoes) {
        const partes = chave.split(">");
        const peso = pesoConfusao(confusoes[chave]);

        if (partes[0] === id) {
            soma[partes[1]] = (soma[partes[1]] || 0) + peso;
        } else if (partes[1] === id) {
            soma[partes[0]] = (soma[partes[0]] || 0) + peso * 0.7;
        }
    }

    const lista = [];

    for (const outro in soma) {
        lista.push({ id: outro, peso: soma[outro] });
    }

    lista.sort((a, b) => b.peso - a.peso);

    return lista;
}

function viajar(horas) {
    for (const id in progresso) {
        for (const direcao of DIRECOES) {
            const memoria = progresso[id][direcao];
            memoria.ultimaVez = memoria.ultimaVez - horas * 60 * MINUTO;
        }
    }

    salvar();
    mostrarPainel();
}

// ===== O SOM =====

let vozJaponesa = null;

const VOZES_PREFERIDAS = ["Google 日本語", "Kyoko", "O-ren", "Otoya", "Hattori", "Nanami", "Haruka"];

function escolherVoz() {
    const japonesas = window.speechSynthesis.getVoices().filter(voz => voz.lang.startsWith("ja"));

    for (const nome of VOZES_PREFERIDAS) {
        const achada = japonesas.find(voz => voz.name.includes(nome));

        if (achada !== undefined) {
            vozJaponesa = achada;
            return;
        }
    }

    vozJaponesa = japonesas[0] || null;
}

function listarVozes() {
    return window.speechSynthesis.getVoices()
        .filter(voz => voz.lang.startsWith("ja"))
        .map(voz => voz.name);
}

function usarVoz(nome) {
    const achada = window.speechSynthesis.getVoices().find(voz => voz.name.includes(nome));

    if (achada !== undefined) {
        vozJaponesa = achada;
        falar("こんにちは");
    }

    return vozJaponesa === null ? null : vozJaponesa.name;
}

function temVoz() {
    return vozJaponesa !== null;
}

function falar(texto, velocidade) {
    if (!temVoz()) {
        return;
    }

    window.speechSynthesis.cancel();

    const fala = new SpeechSynthesisUtterance(texto);
    fala.voice = vozJaponesa;
    fala.lang = "ja-JP";
    fala.rate = velocidade === undefined ? VELOCIDADE_FALA : velocidade;

    window.speechSynthesis.speak(fala);
}

function falarEmPartes(kanas) {
    if (!temVoz()) {
        return;
    }

    window.speechSynthesis.cancel();

    let i = 0;

    function proximaParte() {
        if (i >= kanas.length) {
            return;
        }

        const fala = new SpeechSynthesisUtterance(kanas[i]);
        fala.voice = vozJaponesa;
        fala.lang = "ja-JP";
        fala.rate = VELOCIDADE_DITADO;

        fala.onend = function () {
            i = i + 1;
            setTimeout(proximaParte, PAUSA_ENTRE_KANAS);
        };

        window.speechSynthesis.speak(fala);
    }

    proximaParte();
}

// ===== FERRAMENTAS =====

function sortear(lista) {
    const posicao = Math.floor(Math.random() * lista.length);
    return lista[posicao];
}

function semRepetir(lista) {
    const saida = [];

    for (const item of lista) {
        if (!saida.includes(item)) {
            saida.push(item);
        }
    }

    return saida;
}

function embaralhar(lista) {
    const copia = [...lista];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const guardado = copia[i];
        copia[i] = copia[j];
        copia[j] = guardado;
    }

    return copia;
}

// ===== CONFERIR O QUE FOI DIGITADO =====

function limpar(texto) {
    return texto.trim().toLowerCase().replace(/\s+/g, "");
}

function romajiParaKana(texto) {
    const s = limpar(texto);
    let saida = "";
    let i = 0;

    while (i < s.length) {
        const atual = s[i];
        const proximo = s[i + 1];

        if (atual === "-") {
            saida = saida + "ー";
            i = i + 1;
            continue;
        }

        if (atual === "n") {
            if (proximo === "n") {
                const depois = s[i + 2];

                saida = saida + "ん";

                if (depois !== undefined && "aeiouy".includes(depois)) {
                    i = i + 1;
                } else {
                    i = i + 2;
                }

                continue;
            }

            if (proximo === undefined || !"aeiouy".includes(proximo)) {
                saida = saida + "ん";
                i = i + 1;
                continue;
            }
        }

        if (atual === "t" && s.substring(i + 1, i + 3) === "ch") {
            saida = saida + "っ";
            i = i + 1;
            continue;
        }

        if (proximo === atual && !"aeiou".includes(atual)) {
            saida = saida + "っ";
            i = i + 1;
            continue;
        }

        let achou = false;

        for (let tamanho = 3; tamanho >= 1; tamanho = tamanho - 1) {
            const pedaco = s.substring(i, i + tamanho);

            if (SILABAS[pedaco] !== undefined) {
                saida = saida + SILABAS[pedaco];
                i = i + tamanho;
                achou = true;
                break;
            }
        }

        if (!achou) {
            saida = saida + "?";
            i = i + 1;
        }
    }

    return saida;
}

function kanaParaRomaji(texto) {
    const unidades = dividirEmKanas(texto);
    let saida = "";

    for (let i = 0; i < unidades.length; i++) {
        const atual = unidades[i];

        if (atual === "っ" || atual === "ッ") {
            const proximo = porKana(unidades[i + 1]);

            if (proximo !== null) {
                saida = saida + (proximo.som[0] === "c" ? "t" : proximo.som[0]);
            }

            continue;
        }

        if (atual === "ー") {
            saida = saida + saida[saida.length - 1];
            continue;
        }

        const caractere = porKana(atual);
        saida = saida + (caractere === null ? atual : caractere.som);
    }

    return saida;
}

function normalizarKana(texto) {
    let saida = "";

    for (const unidade of dividirEmKanas(texto)) {
        if (unidade === "ー") {
            const romaji = kanaParaRomaji(saida);
            const vogal = romaji[romaji.length - 1];

            saida = saida + (SILABAS[vogal] || "");
            continue;
        }

        saida = saida + paraHiragana(unidade);
    }

    return saida;
}

function mesmaLeitura(digitado, esperado) {
    return normalizarKana(romajiParaKana(digitado)) === normalizarKana(esperado);
}

function conferir(texto, caractere) {
    const limpo = limpar(texto);

    return caractere.grafias.includes(limpo) || mesmaLeitura(limpo, caractere.kana);
}

// ===== OS TEXTOS =====

function salvarTextos() {
    localStorage.setItem(CHAVE_TEXTOS, JSON.stringify(textos));
}

function dividirEmTrechos(conteudo) {
    const brutos = [];
    let atual = "";

    for (const caractere of conteudo) {
        if (caractere === "\n") {
            brutos.push(atual);
            atual = "";
            continue;
        }

        atual = atual + caractere;

        if (FIM_DE_FRASE.includes(caractere)) {
            brutos.push(atual);
            atual = "";
        }
    }

    brutos.push(atual);

    const trechos = [];

    for (const bruto of brutos) {
        for (const pedaco of quebrarSeLongo(bruto.trim())) {
            if (unidadesPraticaveis(pedaco).length >= MINIMO_NO_TRECHO) {
                trechos.push(pedaco);
            }
        }
    }

    return trechos;
}

function ehCorte(caractere) {
    return caractere === " " || caractere === "\u3000" || PAUSA_NO_TEXTO.includes(caractere);
}

function blocosDoTrecho(trecho) {
    const blocos = [];
    let atual = "";

    for (const caractere of trecho) {
        atual = atual + caractere;

        if (ehCorte(caractere)) {
            blocos.push(atual);
            atual = "";
        }
    }

    if (atual !== "") {
        blocos.push(atual);
    }

    return blocos;
}

function juntarCurtos(pedacos) {
    const saida = [];

    for (const pedaco of pedacos) {
        const curto = unidadesPraticaveis(pedaco).length < MINIMO_NO_TRECHO;

        if (curto && saida.length > 0) {
            saida[saida.length - 1] = (saida[saida.length - 1] + " " + pedaco).trim();
        } else {
            saida.push(pedaco);
        }
    }

    return saida;
}

function quebrarSeLongo(trecho) {
    if (dividirEmKanas(trecho).length <= MAXIMO_NO_TRECHO) {
        return [trecho];
    }

    const pedacos = [];
    let atual = "";

    for (const bloco of blocosDoTrecho(trecho)) {
        const juntos = atual + bloco;

        if (atual !== "" && dividirEmKanas(juntos).length > MAXIMO_NO_TRECHO) {
            pedacos.push(atual.trim());
            atual = bloco;
        } else {
            atual = juntos;
        }
    }

    if (atual.trim() !== "") {
        pedacos.push(atual.trim());
    }

    return juntarCurtos(pedacos);
}

function podeSerPai(caractere) {
    return porKana(caractere) === null
        && !PONTUACAO.includes(caractere)
        && !MARCAS.includes(caractere)
        && caractere !== "\n";
}

function analisarTexto(conteudo) {
    const itens = [];
    let i = 0;

    while (i < conteudo.length) {
        const caractere = conteudo[i];

        if (caractere === "[" || caractere === "［") {
            const fim = procurarFecha(conteudo, i);

            if (fim === -1) {
                itens.push({ tipo: "fixo", kana: caractere });
                i = i + 1;
                continue;
            }

            const leitura = dividirEmKanas(conteudo.slice(i + 1, fim))
                .filter(u => porKana(u) !== null);
            const pai = [];

            while (itens.length > 0
                && itens[itens.length - 1].tipo === "fixo"
                && podeSerPai(itens[itens.length - 1].kana)) {
                pai.unshift(itens.pop().kana);
            }

            if (pai.length === 0 || leitura.length === 0) {
                for (const parte of pai) {
                    itens.push({ tipo: "fixo", kana: parte });
                }

                for (const parte of dividirEmKanas(conteudo.slice(i, fim + 1))) {
                    itens.push({ tipo: "fixo", kana: parte });
                }
            } else {
                itens.push({ tipo: "furigana", pai: pai.join(""), leitura: leitura });
            }

            i = fim + 1;
            continue;
        }

        const unidade = dividirEmKanas(conteudo.slice(i, i + 2))[0];

        itens.push(porKana(unidade) === null
            ? { tipo: "fixo", kana: unidade }
            : { tipo: "kana", kana: unidade });

        i = i + unidade.length;
    }

    return itens;
}

function procurarFecha(conteudo, inicio) {
    for (let i = inicio + 1; i < conteudo.length; i++) {
        if (conteudo[i] === "]" || conteudo[i] === "］") {
            return i;
        }

        if (conteudo[i] === "\n") {
            return -1;
        }
    }

    return -1;
}

function unidadesPraticaveis(conteudo) {
    const praticaveis = [];

    for (const item of analisarTexto(conteudo)) {
        if (item.tipo === "kana") {
            praticaveis.push(item.kana);
        } else if (item.tipo === "furigana") {
            for (const kana of item.leitura) {
                praticaveis.push(kana);
            }
        }
    }

    return praticaveis;
}

function kanjiSemLeitura(conteudo) {
    const soltos = [];

    for (const item of analisarTexto(conteudo)) {
        if (item.tipo === "fixo" && podeSerPai(item.kana) && !soltos.includes(item.kana)) {
            soltos.push(item.kana);
        }
    }

    return soltos;
}

function comRuby(conteudo) {
    let html = "";

    for (const item of analisarTexto(conteudo)) {
        if (item.tipo === "furigana") {
            html += "<ruby>" + item.pai + "<rt>" + item.leitura.join("") + "</rt></ruby>";
        } else {
            html += item.kana === "\n" ? " " : item.kana;
        }
    }

    return html;
}

function novoIdDeTexto() {
    let tentativa = 0;

    while (true) {
        const id = "t" + Date.now().toString(36) + "-" + tentativa.toString(36);

        if (textos.every(t => t.id !== id)) {
            return id;
        }

        tentativa = tentativa + 1;
    }
}

function guardarTexto(titulo, conteudo) {
    const limpo = conteudo.trim();

    if (limpo === "") {
        return null;
    }

    const texto = {
        id: novoIdDeTexto(),
        titulo: titulo.trim() === "" ? "Sem título" : titulo.trim(),
        conteudo: limpo,
        criadoEm: Date.now()
    };

    textos.push(texto);
    salvarTextos();

    return texto;
}

function removerTexto(id) {
    textos = textos.filter(t => t.id !== id);

    if (foco.texto === id) {
        foco.texto = "";
    }

    salvarTextos();
}

function textoPorId(id) {
    return textos.find(t => t.id === id) || null;
}

function coberturaDe(texto) {
    const unicos = semRepetir(unidadesPraticaveis(texto.conteudo));
    const faltam = unicos.filter(u => !foiApresentado(porKana(u)));

    return {
        total: unicos.length,
        conhecidos: unicos.length - faltam.length,
        faltam: faltam,
        unicos: unicos
    };
}

function caracteresDoTexto(texto) {
    const unicos = semRepetir(unidadesPraticaveis(texto.conteudo));

    return unicos.map(porKana);
}

function trechoPronto(trecho) {
    const unidades = unidadesPraticaveis(trecho);

    return unidades.length >= MINIMO_NO_TRECHO
        && unidades.every(u => noDegrau(porKana(u), "identificar"));
}

function trechosProntos(texto) {
    return dividirEmTrechos(texto.conteudo).filter(trechoPronto);
}

function escolherTrecho(prontos) {
    const pontuados = [];

    for (const trecho of prontos) {
        const unidades = unidadesPraticaveis(trecho);
        let soma = 0;

        for (const unidade of unidades) {
            soma = soma + (1 - lembranca(memoriaDe(porKana(unidade).id, "ler")));
        }

        pontuados.push({
            trecho: trecho,
            valor: soma / unidades.length + Math.random() * 0.4
        });
    }

    pontuados.sort((a, b) => b.valor - a.valor);

    return pontuados[0].trecho;
}

function criarTrecho(texto, direcao) {
    const prontos = trechosProntos(texto);

    if (prontos.length === 0) {
        return null;
    }

    const escolhido = escolherTrecho(prontos);
    const sequencia = montarSequenciaDoTrecho(escolhido);

    return {
        correto: sequencia.find(item => item.fixo !== true),
        direcao: direcao,
        tipo: "trecho",
        peso: PESO_TRECHO,
        sequencia: sequencia,
        kana: escolhido,
        motivo: direcao === "ouvir"
            ? "Ditado do seu texto: " + texto.titulo
            : "Do seu texto: " + texto.titulo,
        opcoes: []
    };
}

function montarSequenciaDoTrecho(trecho) {
    const sequencia = [];
    let ruby = 0;

    for (const item of analisarTexto(trecho)) {
        if (item.tipo === "furigana") {
            ruby = ruby + 1;

            for (let i = 0; i < item.leitura.length; i++) {
                const caractere = porKana(item.leitura[i]);

                sequencia.push(Object.assign({}, caractere, {
                    ruby: ruby,
                    pai: i === 0 ? item.pai : null
                }));
            }

            continue;
        }

        if (item.tipo === "kana") {
            sequencia.push(porKana(item.kana));
        } else {
            sequencia.push({ kana: item.kana, fixo: true });
        }
    }

    return sequencia;
}

function escolherLacunas(posicoes, unidades, quantas) {
    const pontuadas = [];

    for (const posicao of posicoes) {
        const caractere = porKana(unidades[posicao]);
        const aparece = unidades.filter(u => u === unidades[posicao]).length;

        pontuadas.push({
            posicao: posicao,
            valor: (1 - lembranca(memoriaDe(caractere.id, "escrever")))
                + (aparece === 1 ? 0.5 : 0)
                + Math.random() * 0.4
        });
    }

    pontuadas.sort((a, b) => b.valor - a.valor);

    return pontuadas.slice(0, quantas).map(p => p.posicao);
}

function criarLacuna(texto) {
    const prontos = trechosProntos(texto);

    if (prontos.length === 0) {
        return null;
    }

    const escolhido = escolherTrecho(prontos);
    const completa = montarSequenciaDoTrecho(escolhido);
    const unidades = completa.map(item => item.kana);
    const possiveis = [];

    for (let i = 0; i < completa.length; i++) {
        if (completa[i].fixo !== true) {
            possiveis.push(i);
        }
    }

    if (possiveis.length < MINIMO_PARA_LACUNA) {
        return null;
    }

    const quantas = possiveis.length >= DUAS_LACUNAS_A_PARTIR_DE ? 2 : 1;
    const buracos = escolherLacunas(possiveis, unidades, quantas);
    const sequencia = [];

    for (let i = 0; i < completa.length; i++) {
        if (buracos.includes(i)) {
            sequencia.push(completa[i]);
        } else {
            sequencia.push(Object.assign({}, completa[i], { fixo: true }));
        }
    }

    return {
        correto: sequencia.find(item => item.fixo !== true),
        direcao: "escrever",
        tipo: "lacuna",
        peso: PESO_LACUNA,
        sequencia: sequencia,
        kana: escolhido,
        motivo: "Complete o trecho de “" + texto.titulo + "”",
        opcoes: []
    };
}

function criarExercicioDeTexto(texto, direcao) {
    if (direcao === "ler") {
        return criarTrecho(texto, "ler");
    }

    if (direcao === "ouvir") {
        return criarTrecho(texto, "ouvir");
    }

    if (direcao === "escrever") {
        return criarLacuna(texto);
    }

    return null;
}

// ===== O FOCO =====

function focoAtivo() {
    return foco.silabario !== "" || foco.conjunto !== ""
        || foco.direcao !== "" || foco.texto !== "";
}

function textoEmFoco() {
    return foco.texto === "" ? null : textoPorId(foco.texto);
}

function caracteresNoFoco() {
    const texto = textoEmFoco();
    const doTexto = texto === null ? null : new Set(caracteresDoTexto(texto).map(c => c.id));

    return CARACTERES.filter(function (caractere) {
        if (doTexto !== null && !doTexto.has(caractere.id)) {
            return false;
        }

        if (foco.silabario !== "" && caractere.silabario !== foco.silabario) {
            return false;
        }

        if (foco.conjunto !== "") {
            const partes = foco.conjunto.split(":");

            if (partes[0] === "grupo" && caractere.grupo !== partes[1]) {
                return false;
            }

            if (partes[0] === "linha" && caractere.linha !== partes[1]) {
                return false;
            }
        }

        return true;
    });
}

function direcoesNoFoco(caractere) {
    const liberadas = direcoesLiberadas(caractere);

    if (foco.direcao === "") {
        return liberadas;
    }

    return liberadas.filter(d => d === foco.direcao);
}

function podeApresentarNovo() {
    return foco.direcao === "" || foco.direcao === "ler";
}

function descricaoDoFoco() {
    const partes = [];
    const texto = textoEmFoco();

    if (texto !== null) {
        partes.push("texto “" + texto.titulo + "”");
    }

    if (foco.silabario !== "") {
        partes.push(SILABARIOS.find(s => s.id === foco.silabario).nome);
    }

    if (foco.conjunto !== "") {
        const pedacos = foco.conjunto.split(":");

        if (pedacos[0] === "grupo") {
            partes.push(GRUPOS.find(g => g.id === pedacos[1]).nome);
        } else {
            partes.push("linha " + kanasDaLinha(pedacos[1]));
        }
    }

    if (foco.direcao !== "") {
        partes.push(HABILIDADES[foco.direcao].nome.toLowerCase());
    }

    return partes.join(" · ");
}

function kanasDaLinha(linhaId) {
    for (const grupo of GRUPOS) {
        const linha = grupo.linhas.find(l => l.id === linhaId);

        if (linha !== undefined) {
            return rotuloDaLinha(linha);
        }
    }

    return linhaId;
}

function rotuloDaLinha(linha) {
    return foco.silabario === "k" ? paraKatakana(linha.kana) : linha.kana;
}

function limparFoco() {
    foco = { silabario: "", conjunto: "", direcao: "", texto: "" };
    montarControlesDoFoco();
    mostrarTextos();

    if (emSessao()) {
        proximo();
    }
}

function estudarTexto(id) {
    foco = { silabario: "", conjunto: "", direcao: "", texto: id };
    montarControlesDoFoco();
    mostrarTextos();

    if (emSessao()) {
        proximo();
    }

    irParaOExercicio();
}

function irParaOExercicio() {
    mostrarTela("aprender");
}

// ===== A ESCADA DO CARACTERE NOVO =====

// Um caractere recém-apresentado não cai direto numa palavra. Ele sobe uma
// escada, e cada degrau cobra uma forma de lembrar mais difícil que a anterior:
//
//   1. Reconhecer   ver o caractere e escolher o som        reconhecimento
//   2. Identificar  ver o som e escolher o caractere        reconhecimento invertido
//   3. Digitar      ver o caractere e escrever o som        evocação livre
//   4. Ouvir        ouvir o som e achar o caractere         canal novo
//   5. Traçar       produzir a forma à mão                  produção
//   6. Contexto     palavras, sequências, montagem, textos
//
// Cada degrau cobra acertos do degrau anterior, então a escada é encadeada:
// não basta acumular acertos numa habilidade só.

const ESCADA = [
    { id: "reconhecer", nome: "Reconhecer", ler: 0, escrever: 0, ouvir: 0 },
    { id: "identificar", nome: "Identificar", ler: 2, escrever: 0, ouvir: 0 },
    { id: "digitar", nome: "Digitar o som", ler: 3, escrever: 1, ouvir: 0 },
    { id: "ouvir", nome: "Ouvir", ler: 4, escrever: 1, ouvir: 0 },
    { id: "tracar", nome: "Traçar", ler: 5, escrever: 2, ouvir: 1 },
    { id: "contexto", nome: "Palavras", ler: 6, escrever: 2, ouvir: 1 }
];

function acertosEm(caractere, direcao) {
    const memoria = memoriaDe(caractere.id, direcao);

    return memoria === null ? -1 : memoria.acertos;
}

function alcancou(caractere, degrau) {
    // sem voz no aparelho o degrau de ouvir nunca seria cumprido,
    // e a escada travaria para sempre. então ele deixa de ser cobrado.
    const pedeOuvir = temVoz() ? degrau.ouvir : 0;

    return acertosEm(caractere, "ler") >= degrau.ler
        && acertosEm(caractere, "escrever") >= degrau.escrever
        && acertosEm(caractere, "ouvir") >= pedeOuvir;
}

function degrauDe(caractere) {
    if (!foiApresentado(caractere)) {
        return -1;
    }

    let alto = 0;

    for (let i = 0; i < ESCADA.length; i++) {
        if (alcancou(caractere, ESCADA[i])) {
            alto = i;
        }
    }

    return alto;
}

function indiceDoDegrau(id) {
    return ESCADA.findIndex(degrau => degrau.id === id);
}

function noDegrau(caractere, id) {
    return degrauDe(caractere) >= indiceDoDegrau(id);
}

function firme(caractere) {
    const ler = memoriaDe(caractere.id, "ler");

    return ler !== null && !ler.errouNaUltima;
}

// ===== ESCOLHER O QUE PRATICAR =====

function forcaDe(caractere) {
    const liberadas = direcoesLiberadas(caractere);
    let soma = 0;

    for (const direcao of liberadas) {
        soma = soma + lembranca(memoriaDe(caractere.id, direcao));
    }

    return soma / liberadas.length;
}

function prioridade(caractere, direcao) {
    const memoria = memoriaDe(caractere.id, direcao);

    if (memoria.meiaVida === 0) {
        return PRIORIDADE_DIRECAO_NOVA;
    }

    let valor = 1 - lembranca(memoria);

    if (memoria.meiaVida <= MEIA_VIDA_INICIAL) {
        valor = valor + BONUS_FRAGIL;
    }

    if (memoria.errouNaUltima) {
        valor = valor + BONUS_ERRO;
    }

    return valor;
}

function penalidade(id) {
    const posicao = ultimos.indexOf(id);

    if (posicao === -1) {
        return 1;
    }

    return PENALIDADES[posicao];
}

function sortearComPeso(candidatos) {
    let soma = 0;

    for (const candidato of candidatos) {
        soma = soma + candidato.valor;
    }

    let sorteio = Math.random() * soma;

    for (const candidato of candidatos) {
        sorteio = sorteio - candidato.valor;

        if (sorteio <= 0) {
            return candidato;
        }
    }

    return candidatos[0];
}

function podeEscrever(caractere) {
    return noDegrau(caractere, "identificar") && firme(caractere);
}

function podeOuvir(caractere) {
    return temVoz() && noDegrau(caractere, "ouvir") && firme(caractere);
}

function podeDesenhar(caractere) {
    if (CAMINHOS[caractere.kana] === undefined) {
        return false;
    }

    return noDegrau(caractere, "tracar") && firme(caractere);
}

function direcoesLiberadas(caractere) {
    const lista = ["ler"];

    if (podeEscrever(caractere)) {
        lista.push("escrever");
    }

    if (podeOuvir(caractere)) {
        lista.push("ouvir");
    }

    if (podeDesenhar(caractere)) {
        lista.push("desenhar");
    }

    return lista;
}

function estaAprendendo(caractere) {
    if (!foiApresentado(caractere)) {
        return false;
    }

    for (const direcao of direcoesLiberadas(caractere)) {
        const memoria = memoriaDe(caractere.id, direcao);

        if (memoria.meiaVida === 0 || memoria.errouNaUltima) {
            return true;
        }

        if (memoria.meiaVida <= MEIA_VIDA_APRENDIDO) {
            return true;
        }
    }

    return false;
}

function quantosAprendendo() {
    return CARACTERES.filter(estaAprendendo).length;
}

function desempenhoRecente() {
    if (recentes.length < 4) {
        return 1;
    }

    let soma = 0;

    for (const resultado of recentes) {
        soma = soma + resultado;
    }

    return soma / recentes.length;
}

function limiteDeAprendizado() {
    const taxa = desempenhoRecente();

    for (const faixa of LIMITES) {
        if (taxa >= faixa.acerto) {
            return faixa.limite;
        }
    }

    return LIMITES[LIMITES.length - 1].limite;
}

function proximoNovo() {
    if (!podeApresentarNovo()) {
        return null;
    }

    for (const caractere of caracteresNoFoco()) {
        if (!foiApresentado(caractere)) {
            return caractere;
        }
    }

    return null;
}

function escolherAlvo() {
    const candidatos = [];

    for (const caractere of caracteresNoFoco()) {
        if (!foiApresentado(caractere)) {
            continue;
        }

        for (const direcao of direcoesNoFoco(caractere)) {
            candidatos.push({
                caractere: caractere,
                direcao: direcao,
                valor: prioridade(caractere, direcao) * penalidade(caractere.id) * (0.9 + Math.random() * 0.2)
            });
        }
    }

    if (quantosAprendendo() < limiteDeAprendizado()) {
        const novo = proximoNovo();

        if (novo !== null) {
            candidatos.push({ caractere: novo, direcao: "ler", valor: PRIORIDADE_NOVO });
        }
    }

    if (candidatos.length === 0) {
        const novo = proximoNovo() || primeiroNaoVistoNoFoco();

        if (novo === null) {
            return null;
        }

        return { caractere: novo, direcao: "ler" };
    }

    candidatos.sort((a, b) => b.valor - a.valor);

    return sortearComPeso(candidatos.slice(0, QUANTOS_CANDIDATOS));
}

function primeiroNaoVistoNoFoco() {
    if (!podeApresentarNovo()) {
        return null;
    }

    for (const caractere of caracteresNoFoco()) {
        if (!foiApresentado(caractere)) {
            return caractere;
        }
    }

    return null;
}

function motivoDe(caractere, direcao) {
    if (!foiApresentado(caractere)) {
        return "Caractere novo";
    }

    const mostra = direcao === "ler"
        ? caractere.kana
        : (direcao === "ouvir" ? "este som" : "“" + caractere.som + "”");

    const memoria = memoriaDe(caractere.id, direcao);

    if (memoria.meiaVida === 0) {
        if (direcao === "escrever") {
            return "Agora ao contrário: do som para o caractere";
        }

        if (direcao === "ouvir") {
            return "Agora de ouvido: qual caractere é este som?";
        }

        return "Fixando " + mostra;
    }

    if (memoria.errouNaUltima) {
        return "Reforço: você errou " + mostra + " há pouco";
    }

    if (memoria.meiaVida <= MEIA_VIDA_INICIAL) {
        return "Fixando " + mostra;
    }

    if (lembranca(memoria) < 0.5) {
        return "Revisão: você estava esquecendo " + mostra;
    }

    return "Mantendo " + mostra + " na memória";
}

// ===== AS SEQUÊNCIAS =====

function conhecidosParaSequencia(silabario) {
    return CARACTERES.filter(function (caractere) {
        if (caractere.silabario !== silabario) {
            return false;
        }

        if (NAO_EM_SEQUENCIA.includes(caractere.kana)) {
            return false;
        }

        return noDegrau(caractere, "identificar");
    });
}

function tamanhoDaSequencia(quantos) {
    for (const faixa of TAMANHOS) {
        if (quantos >= faixa.conhecidos) {
            return faixa.tamanho;
        }
    }

    return TAMANHOS[TAMANHOS.length - 1].tamanho;
}

function sequenciaValida(kanas) {
    for (let i = 0; i < kanas.length; i++) {
        if ((kanas[i] === "ん" || kanas[i] === "ン") && i !== kanas.length - 1) {
            return false;
        }

        if (i > 0 && kanas[i - 1] === kanas[i]) {
            return false;
        }
    }

    return true;
}

function sortearFraco(lista) {
    const pontuados = [];

    for (const caractere of lista) {
        pontuados.push({
            caractere: caractere,
            valor: 0.25 + (1 - lembranca(memoriaDe(caractere.id, "ler")))
        });
    }

    return sortearComPeso(pontuados).caractere;
}

function montarSequencia(alvo, limite) {
    const disponiveis = conhecidosParaSequencia(alvo.silabario);

    if (disponiveis.length < MINIMO_PARA_SEQUENCIA) {
        return null;
    }

    let tamanho = tamanhoDaSequencia(disponiveis.length);

    if (limite !== undefined && tamanho > limite) {
        tamanho = limite;
    }
    const alvoEntra = !NAO_EM_SEQUENCIA.includes(alvo.kana)
        && disponiveis.some(c => c.id === alvo.id);

    for (let tentativa = 0; tentativa < TENTATIVAS_DE_SEQUENCIA; tentativa++) {
        const escolhidos = [];
        const posicaoDoAlvo = Math.floor(Math.random() * tamanho);

        for (let i = 0; i < tamanho; i++) {
            if (i === posicaoDoAlvo && alvoEntra) {
                escolhidos.push(alvo);
            } else {
                escolhidos.push(sortearFraco(disponiveis));
            }
        }

        if (sequenciaValida(escolhidos.map(c => c.kana))) {
            return escolhidos;
        }
    }

    return null;
}

function criarSequencia(correto, direcao) {
    const ditado = direcao === "ouvir";
    const sequencia = montarSequencia(correto, ditado ? TAMANHO_MAXIMO_DITADO : undefined);

    if (sequencia === null) {
        return null;
    }

    return {
        correto: correto,
        direcao: direcao,
        tipo: "sequencia",
        peso: PESO_SEQUENCIA,
        sequencia: sequencia,
        kana: sequencia.map(c => c.kana).join(""),
        motivo: ditado
            ? "Ditado: escreva cada som que ouvir"
            : "Leitura rápida: leia em sequência",
        opcoes: []
    };
}

// ===== A MONTAGEM =====

function palavrasParaMontar(caractere) {
    return PALAVRAS.filter(function (palavra) {
        if (palavra.kanas.length > MAXIMO_NA_MONTAGEM) {
            return false;
        }

        if (palavra.unidades.length !== palavra.kanas.length) {
            return false;
        }

        if (!palavra.kanas.includes(caractere.kana)) {
            return false;
        }

        return palavra.kanas.every(function (kana) {
            const outro = porKana(kana);

            if (outro === null) {
                return false;
            }

            return noDegrau(outro, "digitar");
        });
    });
}

function montarBandeja(sequencia) {
    const pecas = [];

    for (const caractere of sequencia) {
        if (!pecas.includes(caractere.kana)) {
            pecas.push(caractere.kana);
        }
    }

    const quantas = Math.min(MAXIMO_DE_PECAS, pecas.length + PECAS_EXTRAS);

    function tentar(kana) {
        if (pecas.length < quantas && !pecas.includes(kana)) {
            pecas.push(kana);
        }
    }

    for (const caractere of sequencia) {
        for (const kana of PARECIDOS[caractere.kana] || []) {
            if (foiApresentado(porKana(kana))) {
                tentar(kana);
            }
        }
    }

    const doMesmo = CARACTERES.filter(c => c.silabario === sequencia[0].silabario);

    for (const outro of embaralhar(doMesmo)) {
        if (foiApresentado(outro)) {
            tentar(outro.kana);
        }
    }

    for (const outro of embaralhar(doMesmo)) {
        tentar(outro.kana);
    }

    return embaralhar(pecas);
}

function criarMontagem(correto) {
    const candidatas = palavrasParaMontar(correto);

    if (candidatas.length === 0) {
        return null;
    }

    const palavra = escolherPalavra(candidatas, "escrever");
    const sequencia = palavra.kanas.map(porKana);

    return {
        correto: correto,
        direcao: "escrever",
        tipo: "montar",
        peso: PESO_MONTAR,
        palavra: palavra,
        sequencia: sequencia,
        kana: palavra.kana,
        bandeja: montarBandeja(sequencia),
        motivo: "Monte a palavra em kana",
        opcoes: []
    };
}

// ===== A APRESENTAÇÃO =====

function irmaoDe(caractere) {
    const outro = caractere.silabario === "h" ? "k" : "h";

    return CARACTERES.find(c => c.silabario === outro && c.som === caractere.som) || null;
}

function nomeDoSilabario(caractere) {
    return SILABARIOS.find(s => s.id === caractere.silabario).nome;
}

function nomeDoGrupo(caractere) {
    return GRUPOS.find(g => g.id === caractere.grupo).nome;
}

function temTracos(caractere) {
    return CAMINHOS[caractere.kana] !== undefined;
}

function svgDosTracos(kana, animado) {
    const caminhos = CAMINHOS[kana];

    if (caminhos === undefined) {
        return "";
    }

    let corpo = '<line class="guia" x1="' + (LADO_ORIGINAL / 2) + '" y1="4"'
        + ' x2="' + (LADO_ORIGINAL / 2) + '" y2="' + (LADO_ORIGINAL - 4) + '"/>'
        + '<line class="guia" x1="4" y1="' + (LADO_ORIGINAL / 2) + '"'
        + ' x2="' + (LADO_ORIGINAL - 4) + '" y2="' + (LADO_ORIGINAL / 2) + '"/>';

    for (let i = 0; i < caminhos.length; i++) {
        const comprimento = amostrarCaminho(caminhos[i]).comprimento;
        let estilo = "";

        if (animado) {
            estilo = 'stroke-dasharray:' + comprimento.toFixed(1)
                + ';stroke-dashoffset:' + comprimento.toFixed(1)
                + ';animation:tracar ' + DURACAO_DO_TRACO + 's ease forwards'
                + ';animation-delay:' + (i * INTERVALO_ENTRE_TRACOS).toFixed(2) + 's';
        }

        corpo += '<path class="traco" d="' + caminhos[i] + '" style="' + estilo + '"/>';
    }

    for (let i = 0; i < caminhos.length; i++) {
        const inicio = amostrarCaminho(caminhos[i]).pontos[0];
        let estilo = "";

        if (animado) {
            estilo = 'opacity:0;animation:aparecer .25s ease forwards'
                + ';animation-delay:' + (i * INTERVALO_ENTRE_TRACOS).toFixed(2) + 's';
        }

        corpo += '<g style="' + estilo + '">'
            + '<circle class="bolha" cx="' + inicio.x.toFixed(1) + '" cy="' + inicio.y.toFixed(1) + '" r="8"/>'
            + '<text class="ordem" x="' + inicio.x.toFixed(1) + '" y="' + (inicio.y + 3.5).toFixed(1) + '">'
            + (i + 1) + '</text></g>';
    }

    return '<svg class="tracado" viewBox="0 0 ' + LADO_ORIGINAL + ' ' + LADO_ORIGINAL + '">'
        + corpo + '</svg>';
}

function criarApresentacao(caractere) {
    return {
        correto: caractere,
        direcao: "ler",
        tipo: "apresentacao",
        peso: 0,
        motivo: "",
        opcoes: []
    };
}

function mostrarApresentacao() {
    const caractere = exercicio.correto;
    const irmao = irmaoDe(caractere);
    const desenho = svgDosTracos(caractere.kana, true);

    let corpo = '<span class="etiqueta">Caractere novo</span>'
        + '<div class="novo-topo">'
        + '<div class="novo-figura">'
        + (desenho === "" ? '<span class="kana-enorme">' + caractere.kana + '</span>' : desenho)
        + '</div>'
        + '<div class="novo-info">'
        + '<strong class="som-novo">' + caractere.som + '</strong>'
        + '<span class="sub">' + nomeDoSilabario(caractere) + ' · ' + nomeDoGrupo(caractere) + '</span>'
        + '<button class="som" id="ouvir-novo">🔊</button>'
        + '</div></div>';

    if (irmao !== null && foiApresentado(irmao)) {
        corpo += '<p class="ponte">Mesmo som de <b class="kana-linha">' + irmao.kana + '</b>,'
            + ' que você já estuda. A forma muda, o som não.</p>';
    }

    const parecidos = (PARECIDOS[caractere.kana] || [])
        .filter(k => porKana(k) !== null && foiApresentado(porKana(k)));

    if (parecidos.length > 0) {
        const dica = dicaPara(caractere.kana, parecidos[0]);

        corpo += '<p class="aviso">Parece com <b class="kana-linha">'
            + parecidos.slice(0, 3).join(" ") + '</b>'
            + (dica === null ? "." : ". " + dica) + '</p>';
    }

    if (desenho !== "") {
        corpo += '<p class="nota">Os números mostram por onde cada traço começa.</p>';
    }

    corpo += '<p class="nota">Você vai reencontrar este caractere de vários jeitos'
        + ' — reconhecer, identificar, escrever o som, ouvir, traçar — antes que ele'
        + ' comece a aparecer dentro de palavras.</p>';

    corpo += '<div class="acoes-novo">'
        + (desenho === "" ? "" : '<button class="acao" id="rever-tracos">Ver de novo</button>')
        + '<button class="acao principal" id="entendi">Entendi, vamos praticar</button>'
        + '</div>';

    areaApresentacao.innerHTML = corpo;
    falar(caractere.kana);
}

function mostrarFocoVazio() {
    const lista = caracteresNoFoco();
    const vistos = lista.filter(foiApresentado).length;

    let explica = "Não há nada para praticar neste recorte agora.";

    if (lista.length === 0) {
        explica = "Este recorte não tem nenhum caractere.";
    } else if (vistos === 0) {
        explica = "Você ainda não começou nenhum caractere deste recorte,"
            + " e a habilidade escolhida só é praticada depois da leitura.";
    } else if (foco.direcao !== "") {
        explica = "Nenhum caractere deste recorte liberou a habilidade "
            + HABILIDADES[foco.direcao].nome.toLowerCase() + " ainda."
            + " Ela abre depois de alguns acertos na leitura.";
    }

    areaApresentacao.innerHTML = '<span class="etiqueta cinza">Recorte vazio</span>'
        + '<p class="ponte">' + explica + '</p>'
        + '<div class="acoes-novo">'
        + '<button class="acao principal" id="sair-do-foco">Voltar ao automático</button>'
        + '</div>';
}

function reverTracos() {
    const figura = areaApresentacao.querySelector(".novo-figura");

    if (figura !== null) {
        figura.innerHTML = svgDosTracos(exercicio.correto.kana, true);
    }
}

function concluirApresentacao() {
    if (exercicio.tipo !== "apresentacao") {
        return;
    }

    const caractere = exercicio.correto;

    fichaDe(caractere.id);
    salvar();

    if (sessao !== null) {
        sessao.novos = sessao.novos + 1;
    }

    exercicio = criarExercicioSobre(caractere, "ler");
    mostrarExercicio();
    mostrarPainel();
}

// ===== CRIAR O EXERCÍCIO =====

function escolherTipo(caractere, direcao) {
    if (direcao !== "ler") {
        return "escolha";
    }

    const memoria = memoriaDe(caractere.id, direcao);

    if (memoria === null || memoria.errouNaUltima) {
        return "escolha";
    }

    if (!noDegrau(caractere, "digitar")) {
        return "escolha";
    }

    if (Math.random() < CHANCE_DIGITAR) {
        return "digitar";
    }

    return "escolha";
}

function porId(id) {
    return CARACTERES.find(c => c.id === id) || null;
}

function porKana(kana) {
    return CARACTERES.find(c => c.kana === kana) || null;
}

function distratores(caractere, quantos) {
    const escolhidos = [];

    function tentar(outro) {
        if (outro === null || outro === undefined) {
            return;
        }

        if (outro.id === caractere.id || escolhidos.includes(outro)) {
            return;
        }

        if (escolhidos.length < quantos) {
            escolhidos.push(outro);
        }
    }

    for (const confusao of confusoesDe(caractere.id)) {
        if (confusao.peso >= PESO_CONFUSAO_MINIMO) {
            tentar(porId(confusao.id));
        }
    }

    const parecidos = PARECIDOS[caractere.kana] || [];

    for (const kana of embaralhar(parecidos)) {
        const outro = porKana(kana);

        if (outro !== null && foiApresentado(outro)) {
            tentar(outro);
        }
    }

    const doMesmo = CARACTERES.filter(c => c.silabario === caractere.silabario);

    for (const outro of embaralhar(doMesmo)) {
        if (foiApresentado(outro) && outro.grupo === caractere.grupo) {
            tentar(outro);
        }
    }

    for (const outro of embaralhar(doMesmo)) {
        if (foiApresentado(outro)) {
            tentar(outro);
        }
    }

    for (const outro of embaralhar(doMesmo)) {
        tentar(outro);
    }

    return escolhidos;
}

function palavrasCom(caractere) {
    return PALAVRAS.filter(function (palavra) {
        if (!palavra.kanas.includes(caractere.kana)) {
            return false;
        }

        // os outros kanas da palavra também precisam estar de pé:
        // um caractere de ontem não pode ser arrastado para dentro de uma frase
        return palavra.kanas.every(function (kana) {
            const outro = porKana(kana);
            return outro !== null && noDegrau(outro, "identificar");
        });
    });
}

function escolherPalavra(candidatas, direcao) {
    const qual = direcao === undefined ? "ler" : direcao;
    const pontuadas = [];

    for (const palavra of candidatas) {
        let soma = 0;

        for (const kana of palavra.kanas) {
            soma = soma + (1 - lembranca(memoriaDe(porKana(kana).id, qual)));
        }

        const fraqueza = soma / palavra.kanas.length;
        const tamanho = 0.09 * palavra.kanas.length;

        pontuadas.push({ palavra: palavra, valor: fraqueza + tamanho + Math.random() * 0.35 });
    }

    pontuadas.sort((a, b) => b.valor - a.valor);

    return pontuadas[0].palavra;
}

function criarExercicio() {
    const alvo = escolherAlvo();

    if (alvo === null) {
        return { correto: null, direcao: "ler", tipo: "vazio", peso: 0, motivo: "", opcoes: [] };
    }

    if (!foiApresentado(alvo.caractere)) {
        return criarApresentacao(alvo.caractere);
    }

    const texto = textoEmFoco();

    if (texto !== null && Math.random() < CHANCE_TRECHO) {
        const doTexto = criarExercicioDeTexto(texto, alvo.direcao);

        if (doTexto !== null) {
            return doTexto;
        }
    }

    return criarExercicioSobre(alvo.caractere, alvo.direcao);
}

function criarExercicioSobre(correto, direcao) {
    const alvo = { caractere: correto, direcao: direcao };

    // o portão: um caractere só entra em palavra, montagem ou sequência
    // depois de se sustentar sozinho. senão a frase carrega ele no colo
    // e a memória nunca é cobrada de verdade.
    const emContexto = noDegrau(correto, "contexto");

    if (emContexto && alvo.direcao === "ler" && Math.random() < CHANCE_PALAVRA) {
        const candidatas = palavrasCom(correto);

        if (candidatas.length > 0) {
            return {
                correto: correto,
                direcao: "ler",
                tipo: "palavra",
                peso: PESO_PALAVRA,
                palavra: escolherPalavra(candidatas),
                motivo: "Lendo uma palavra de verdade",
                opcoes: []
            };
        }
    }

    if (emContexto && alvo.direcao === "escrever" && Math.random() < CHANCE_MONTAR) {
        const montagem = criarMontagem(correto);

        if (montagem !== null) {
            return montagem;
        }
    }

    const podeSequencia = emContexto && (alvo.direcao === "ler"
        || (alvo.direcao === "ouvir" && Math.random() < CHANCE_DITADO));

    if (podeSequencia && Math.random() < CHANCE_SEQUENCIA) {
        const sequencia = criarSequencia(correto, alvo.direcao);

        if (sequencia !== null) {
            return sequencia;
        }
    }

    const tipo = escolherTipo(correto, alvo.direcao);
    const erradas = distratores(correto, 2);

    return {
        correto: correto,
        direcao: alvo.direcao,
        tipo: tipo,
        peso: tipo === "digitar" ? PESO_DIGITAR : PESO_ESCOLHA,
        motivo: motivoDe(correto, alvo.direcao),
        opcoes: embaralhar([correto, ...erradas])
    };
}

// ===== GEOMETRIA DOS TRAÇOS =====

const PONTOS_POR_TRACO = 24;
const LADO_ORIGINAL = 109;

const svgAuxiliar = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svgAuxiliar.style.position = "absolute";
svgAuxiliar.style.visibility = "hidden";
svgAuxiliar.setAttribute("width", "0");
svgAuxiliar.setAttribute("height", "0");
document.body.appendChild(svgAuxiliar);

const amostrasGuardadas = {};

function amostrarCaminho(caminho) {
    if (amostrasGuardadas[caminho] !== undefined) {
        return amostrasGuardadas[caminho];
    }

    const traco = document.createElementNS("http://www.w3.org/2000/svg", "path");
    traco.setAttribute("d", caminho);
    svgAuxiliar.appendChild(traco);

    const comprimento = traco.getTotalLength();
    const pontos = [];

    for (let i = 0; i < PONTOS_POR_TRACO; i++) {
        const posicao = traco.getPointAtLength(comprimento * i / (PONTOS_POR_TRACO - 1));
        pontos.push({ x: posicao.x, y: posicao.y });
    }

    svgAuxiliar.removeChild(traco);

    amostrasGuardadas[caminho] = { pontos: pontos, comprimento: comprimento };

    return amostrasGuardadas[caminho];
}

function comprimentoDaLinha(pontos) {
    let total = 0;

    for (let i = 1; i < pontos.length; i++) {
        total = total + distancia(pontos[i - 1], pontos[i]);
    }

    return total;
}

function distancia(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function reamostrar(pontos, quantidade) {
    if (pontos.length === 1) {
        return new Array(quantidade).fill(pontos[0]);
    }

    const total = comprimentoDaLinha(pontos);
    const passo = total / (quantidade - 1);
    const saida = [pontos[0]];

    let anterior = pontos[0];
    let acumulado = 0;
    let i = 1;

    while (saida.length < quantidade - 1 && i < pontos.length) {
        const atual = pontos[i];
        const trecho = distancia(anterior, atual);

        if (acumulado + trecho >= passo && trecho > 0) {
            const fracao = (passo - acumulado) / trecho;
            const novo = {
                x: anterior.x + fracao * (atual.x - anterior.x),
                y: anterior.y + fracao * (atual.y - anterior.y)
            };

            saida.push(novo);
            anterior = novo;
            acumulado = 0;
        } else {
            acumulado = acumulado + trecho;
            anterior = atual;
            i = i + 1;
        }
    }

    while (saida.length < quantidade) {
        saida.push(pontos[pontos.length - 1]);
    }

    return saida;
}

function centro(pontos) {
    let somaX = 0;
    let somaY = 0;

    for (const ponto of pontos) {
        somaX = somaX + ponto.x;
        somaY = somaY + ponto.y;
    }

    return { x: somaX / pontos.length, y: somaY / pontos.length };
}

function compararTraco(meus, oficial) {
    const eu = reamostrar(meus, PONTOS_POR_TRACO);
    const ele = oficial.pontos;

    const meuCentro = centro(eu);
    const centroOficial = centro(ele);
    const erroDePosicao = distancia(meuCentro, centroOficial);

    let somaNormal = 0;
    let somaInvertida = 0;

    for (let i = 0; i < PONTOS_POR_TRACO; i++) {
        const invertido = eu[PONTOS_POR_TRACO - 1 - i];

        somaNormal = somaNormal + distancia(eu[i], ele[i]);
        somaInvertida = somaInvertida + distancia(invertido, ele[i]);
    }

    const erroNormal = somaNormal / PONTOS_POR_TRACO;
    const erroInvertido = somaInvertida / PONTOS_POR_TRACO;
    const proporcao = comprimentoDaLinha(eu) / oficial.comprimento;

    return {
        combina: erroNormal < TOLERANCIA_FORMA && erroDePosicao < TOLERANCIA_POSICAO
            && proporcao > 0.35 && proporcao < 2.8,
        invertido: erroInvertido < erroNormal && erroInvertido < TOLERANCIA_FORMA
    };
}

// ===== O QUADRO =====

const quadro = document.getElementById("quadro");
const pincel = quadro.getContext("2d");

// o canvas nao entende variavel de css: a gente le a cor e guarda
let coresGuardadas = {};

function corDoTema(nome, alternativa) {
    if (coresGuardadas[nome] === undefined) {
        const valor = getComputedStyle(document.documentElement)
            .getPropertyValue(nome).trim();

        coresGuardadas[nome] = valor === "" ? alternativa : valor;
    }

    return coresGuardadas[nome];
}

function esquecerCores() {
    coresGuardadas = {};
}

let desenhando = false;
let pontosDoTraco = [];
let tracoAtual = 0;
let errosNoDesenho = 0;
let errosNoTracoAtual = 0;
let mostrarAjuda = false;

function caminhosDoExercicio() {
    // na tela de abertura não existe exercício: o quadro desenha o vazio
    if (exercicio === null) {
        return [];
    }

    return CAMINHOS[exercicio.correto.kana] || [];
}

function prepararQuadro() {
    const lado = quadro.clientWidth;
    const densidade = window.devicePixelRatio || 1;

    quadro.width = lado * densidade;
    quadro.height = lado * densidade;

    pincel.setTransform(densidade, 0, 0, densidade, 0, 0);
    pincel.lineCap = "round";
    pincel.lineJoin = "round";

    tracoAtual = 0;
    errosNoDesenho = 0;
    errosNoTracoAtual = 0;
    mostrarAjuda = false;
    pontosDoTraco = [];

    redesenharQuadro();
    mostrarProgressoDoDesenho();
}

function redesenharQuadro() {
    const lado = quadro.clientWidth;
    const caminhos = caminhosDoExercicio();

    pincel.clearRect(0, 0, lado, lado);
    desenharGrade(lado);

    for (let i = 0; i < tracoAtual; i++) {
        desenharCaminho(caminhos[i], corDoTema("--tinta", "#1E2230"), 7);
    }

    if (mostrarAjuda && caminhos[tracoAtual] !== undefined) {
        desenharCaminho(caminhos[tracoAtual], corDoTema("--traco-ajuda", "#C6CFDB"), 7);
        desenharSeta(caminhos[tracoAtual]);
    }
}

function desenharGrade(lado) {
    pincel.save();
    pincel.strokeStyle = corDoTema("--traco-grade", "#D9DDE3");
    pincel.lineWidth = 1;
    pincel.setLineDash([5, 5]);

    pincel.beginPath();
    pincel.moveTo(lado / 2, 10);
    pincel.lineTo(lado / 2, lado - 10);
    pincel.moveTo(10, lado / 2);
    pincel.lineTo(lado - 10, lado / 2);
    pincel.stroke();

    pincel.restore();
}

function desenharCaminho(caminho, cor, largura) {
    const escala = quadro.clientWidth / LADO_ORIGINAL;

    pincel.save();
    pincel.scale(escala, escala);
    pincel.strokeStyle = cor;
    pincel.lineWidth = largura / escala;
    pincel.stroke(new Path2D(caminho));
    pincel.restore();
}

function desenharSeta(caminho) {
    const escala = quadro.clientWidth / LADO_ORIGINAL;
    const pontos = amostrarCaminho(caminho).pontos;
    const inicio = pontos[0];
    const seguinte = pontos[3];

    const dx = seguinte.x - inicio.x;
    const dy = seguinte.y - inicio.y;
    const tamanho = Math.hypot(dx, dy) || 1;
    const ux = dx / tamanho;
    const uy = dy / tamanho;

    pincel.save();
    pincel.scale(escala, escala);
    pincel.fillStyle = corDoTema("--azul", "#2A3FE0");

    pincel.beginPath();
    pincel.arc(inicio.x, inicio.y, 3, 0, Math.PI * 2);
    pincel.fill();

    pincel.beginPath();
    pincel.moveTo(inicio.x + ux * 13, inicio.y + uy * 13);
    pincel.lineTo(inicio.x + ux * 6 - uy * 4, inicio.y + uy * 6 + ux * 4);
    pincel.lineTo(inicio.x + ux * 6 + uy * 4, inicio.y + uy * 6 - ux * 4);
    pincel.closePath();
    pincel.fill();

    pincel.restore();
}

function mostrarProgressoDoDesenho() {
    const total = caminhosDoExercicio().length;

    areaResposta.textContent = "Traço " + Math.min(tracoAtual + 1, total) + " de " + total;
}

function posicao(evento) {
    const area = quadro.getBoundingClientRect();
    const lado = quadro.clientWidth;

    return {
        x: (evento.clientX - area.left) / lado * LADO_ORIGINAL,
        y: (evento.clientY - area.top) / lado * LADO_ORIGINAL
    };
}

function desenharLinhaCrua(pontos, cor) {
    const escala = quadro.clientWidth / LADO_ORIGINAL;

    pincel.save();
    pincel.scale(escala, escala);
    pincel.strokeStyle = cor;
    pincel.lineWidth = 7 / escala;

    pincel.beginPath();
    pincel.moveTo(pontos[0].x, pontos[0].y);

    for (const ponto of pontos) {
        pincel.lineTo(ponto.x, ponto.y);
    }

    pincel.stroke();
    pincel.restore();
}

quadro.addEventListener("pointerdown", (evento) => {
    if (respondido || tracoAtual >= caminhosDoExercicio().length) {
        return;
    }

    quadro.setPointerCapture(evento.pointerId);
    desenhando = true;
    pontosDoTraco = [posicao(evento)];
});

quadro.addEventListener("pointermove", (evento) => {
    if (!desenhando) {
        return;
    }

    pontosDoTraco.push(posicao(evento));
    redesenharQuadro();
    desenharLinhaCrua(pontosDoTraco, corDoTema("--tinta", "#1E2230"));
});

quadro.addEventListener("pointerup", () => {
    if (!desenhando) {
        return;
    }

    desenhando = false;
    avaliarTraco(pontosDoTraco);
    pontosDoTraco = [];
});

quadro.addEventListener("pointercancel", () => {
    desenhando = false;
    pontosDoTraco = [];
    redesenharQuadro();
});

function avaliarTraco(pontos) {
    const caminhos = caminhosDoExercicio();
    const esperado = amostrarCaminho(caminhos[tracoAtual]);
    const resultado = compararTraco(pontos, esperado);

    if (resultado.combina) {
        tracoAtual = tracoAtual + 1;
        errosNoTracoAtual = 0;
        mostrarAjuda = false;
        redesenharQuadro();

        if (tracoAtual >= caminhos.length) {
            concluirDesenho();
            return;
        }

        mostrarProgressoDoDesenho();
        return;
    }

    errosNoDesenho = errosNoDesenho + 1;
    errosNoTracoAtual = errosNoTracoAtual + 1;

    let recado = "Esse traço não confere. Tente de novo.";

    if (resultado.invertido) {
        recado = "Direção invertida: comece pela outra ponta.";
    } else {
        for (let j = tracoAtual + 1; j < caminhos.length; j++) {
            if (compararTraco(pontos, amostrarCaminho(caminhos[j])).combina) {
                recado = "Esse é o traço " + (j + 1) + ". Faça o traço " + (tracoAtual + 1) + " primeiro.";
                break;
            }
        }
    }

    if (errosNoTracoAtual >= ERROS_ATE_AJUDA) {
        mostrarAjuda = true;
        recado = recado + " Siga o traço cinza, começando pela seta.";
    }

    redesenharQuadro();
    areaResposta.textContent = recado;
}

function concluirDesenho() {
    falar(exercicio.correto.kana);
    setTimeout(() => responder(errosNoDesenho <= 1, null), 300);
}

function desistirDoDesenho() {
    if (respondido || exercicio.direcao !== "desenhar") {
        return;
    }

    tracoAtual = caminhosDoExercicio().length;
    mostrarAjuda = false;
    redesenharQuadro();
    falar(exercicio.correto.kana);

    responder(false, null);
}

// ===== O DOMÍNIO =====

function estagioDaMemoria(memoria) {
    if (memoria === null || memoria.meiaVida === 0) {
        return "novo";
    }

    if (memoria.meiaVida >= MINUTOS_DOMINADO) {
        return "dominado";
    }

    if (memoria.meiaVida >= MINUTOS_FIRME) {
        return "firme";
    }

    return "aprendendo";
}

const ORDEM_DOS_ESTAGIOS = ["novo", "aprendendo", "firme", "dominado"];

function estagioDe(caractere) {
    if (!foiApresentado(caractere)) {
        return "novo";
    }

    let pior = "dominado";

    for (const direcao of direcoesLiberadas(caractere)) {
        let estagio = estagioDaMemoria(memoriaDe(caractere.id, direcao));

        if (estagio === "novo") {
            estagio = "aprendendo";
        }

        if (ORDEM_DOS_ESTAGIOS.indexOf(estagio) < ORDEM_DOS_ESTAGIOS.indexOf(pior)) {
            pior = estagio;
        }
    }

    return pior;
}

function contarEstagios(lista) {
    const conta = { novo: 0, aprendendo: 0, firme: 0, dominado: 0 };

    for (const estagio of lista) {
        conta[estagio] = conta[estagio] + 1;
    }

    return conta;
}

function dominioDaMemoria(memoria) {
    if (memoria === null || memoria.meiaVida === 0) {
        return 0;
    }

    const escala = Math.log(MINUTOS_DOMINADO / MEIA_VIDA_INICIAL);
    const valor = Math.log(memoria.meiaVida / MEIA_VIDA_INICIAL) / escala;

    return Math.max(0, Math.min(1, valor));
}

function direcoesPossiveis(caractere) {
    if (CAMINHOS[caractere.kana] === undefined) {
        return DIRECOES.filter(d => d !== "desenhar");
    }

    return DIRECOES;
}

function dominioDe(caractere) {
    const possiveis = direcoesPossiveis(caractere);
    let soma = 0;

    for (const direcao of possiveis) {
        soma = soma + dominioDaMemoria(memoriaDe(caractere.id, direcao));
    }

    return soma / possiveis.length;
}

function dominioDoConjunto(lista) {
    if (lista.length === 0) {
        return 0;
    }

    let soma = 0;

    for (const caractere of lista) {
        soma = soma + dominioDe(caractere);
    }

    return soma / lista.length;
}

function dominioGeral() {
    return dominioDoConjunto(CARACTERES);
}

function doSilabario(silabario) {
    return CARACTERES.filter(c => c.silabario === silabario);
}

function doGrupo(silabario, grupo) {
    return CARACTERES.filter(c => c.silabario === silabario && c.grupo === grupo);
}

function dominioDaHabilidade(direcao) {
    const vistos = CARACTERES.filter(foiApresentado);

    if (vistos.length === 0) {
        return 0;
    }

    let soma = 0;

    for (const caractere of vistos) {
        soma = soma + dominioDaMemoria(memoriaDe(caractere.id, direcao));
    }

    return soma / vistos.length;
}

function respostasDe(caractere) {
    let acertos = 0;
    let erros = 0;

    for (const direcao of DIRECOES) {
        const memoria = memoriaDe(caractere.id, direcao);

        if (memoria !== null) {
            acertos = acertos + memoria.acertos;
            erros = erros + memoria.erros;
        }
    }

    return { acertos: acertos, erros: erros, total: acertos + erros };
}

function maisDificeis() {
    const lista = [];

    for (const caractere of CARACTERES) {
        if (!foiApresentado(caractere)) {
            continue;
        }

        const contas = respostasDe(caractere);

        if (contas.total < MINIMO_PARA_RANKING) {
            continue;
        }

        lista.push({
            caractere: caractere,
            total: contas.total,
            taxa: contas.acertos / contas.total,
            dominio: dominioDe(caractere)
        });
    }

    lista.sort((a, b) => (a.taxa - b.taxa) || (a.dominio - b.dominio));

    return lista.slice(0, QUANTOS_NO_RANKING);
}

function sendoEsquecidos() {
    const lista = [];

    for (const caractere of CARACTERES) {
        if (!foiApresentado(caractere)) {
            continue;
        }

        for (const direcao of direcoesLiberadas(caractere)) {
            const memoria = memoriaDe(caractere.id, direcao);

            if (memoria.meiaVida < MINUTOS_FIRME) {
                continue;
            }

            const agora = lembranca(memoria);

            if (agora >= 0.5) {
                continue;
            }

            lista.push({ caractere: caractere, direcao: direcao, lembranca: agora });
        }
    }

    lista.sort((a, b) => a.lembranca - b.lembranca);

    return lista.slice(0, QUANTOS_NO_RANKING);
}

function proximaRevisao(caractere) {
    let maisCedo = null;

    for (const direcao of direcoesLiberadas(caractere)) {
        const momento = quandoCai(memoriaDe(caractere.id, direcao));

        if (momento !== null && (maisCedo === null || momento < maisCedo)) {
            maisCedo = momento;
        }
    }

    return maisCedo;
}

function emQuantoTempo(momento) {
    if (momento === null) {
        return "assim que aparecer";
    }

    const minutos = (momento - Date.now()) / MINUTO;

    if (minutos <= 0) {
        return "agora";
    }

    if (minutos < 90) {
        return "em " + Math.round(minutos) + " min";
    }

    const horas = minutos / 60;

    if (horas < 36) {
        return "em " + Math.round(horas) + " h";
    }

    return "em " + Math.round(horas / 24) + " dias";
}

function quandoCai(memoria) {
    if (memoria === null || memoria.meiaVida === 0) {
        return null;
    }

    return memoria.ultimaVez + memoria.meiaVida * MINUTO;
}

function filaDeRevisao() {
    const agora = Date.now();
    const fila = { caiu: 0, hoje: 0, semana: 0, depois: 0 };

    for (const caractere of CARACTERES) {
        if (!foiApresentado(caractere)) {
            continue;
        }

        for (const direcao of direcoesLiberadas(caractere)) {
            const momento = quandoCai(memoriaDe(caractere.id, direcao));

            if (momento === null) {
                continue;
            }

            const horas = (momento - agora) / (60 * MINUTO);

            if (horas <= 0) {
                fila.caiu = fila.caiu + 1;
            } else if (horas <= 24) {
                fila.hoje = fila.hoje + 1;
            } else if (horas <= 24 * 7) {
                fila.semana = fila.semana + 1;
            } else {
                fila.depois = fila.depois + 1;
            }
        }
    }

    return fila;
}

// ===== O HISTÓRICO =====

function diaDe(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return ano + "-" + mes + "-" + dia;
}

function formatoDe(exercicio) {
    return exercicio.direcao + "|" + exercicio.tipo;
}

function nomeDoFormato(chave) {
    return FORMATOS[chave] || chave;
}

function anotarNoHistorico(acertou, formato) {
    const chave = diaDe(new Date());
    const registro = historico[chave] || { perguntas: 0, acertos: 0, dominio: 0 };

    registro.perguntas = registro.perguntas + 1;

    if (acertou) {
        registro.acertos = registro.acertos + 1;
    }

    registro.dominio = dominioGeral();
    historico[chave] = registro;
    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));

    const doFormato = formatos[formato] || { perguntas: 0, acertos: 0 };

    doFormato.perguntas = doFormato.perguntas + 1;

    if (acertou) {
        doFormato.acertos = doFormato.acertos + 1;
    }

    formatos[formato] = doFormato;
    localStorage.setItem(CHAVE_FORMATOS, JSON.stringify(formatos));
}

function ultimosDias(quantos) {
    const dias = [];
    const agora = new Date();

    for (let i = quantos - 1; i >= 0; i--) {
        const data = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - i);
        const chave = diaDe(data);
        const registro = historico[chave] || { perguntas: 0, acertos: 0, dominio: 0 };

        dias.push({
            chave: chave,
            data: data,
            perguntas: registro.perguntas,
            acertos: registro.acertos,
            dominio: registro.dominio || 0
        });
    }

    return dias;
}

// ===== O BACKUP =====

// tudo o que o app guarda no navegador. se um dia nascer uma chave nova,
// ela precisa entrar aqui, senao fica de fora do backup.
const CHAVES_DO_APP = [
    CHAVE,
    CHAVE_CONFUSOES,
    CHAVE_HISTORICO,
    CHAVE_FORMATOS,
    CHAVE_TEXTOS,
    "kana-sensei-tema-v1"
];

const CHAVE_BACKUP = "kana-sensei-backup-v1";
const DIAS_ATE_LEMBRAR = 7;

function montarBackup() {
    const guardado = {};

    for (const chave of CHAVES_DO_APP) {
        const valor = localStorage.getItem(chave);

        if (valor !== null) {
            guardado[chave] = valor;
        }
    }

    return {
        app: "kana-sensei",
        versao: 1,
        quando: new Date().toISOString(),
        dados: guardado
    };
}

function quantosNoBackup(pacote) {
    const bruto = pacote.dados[CHAVE];

    if (bruto === undefined) {
        return 0;
    }

    try {
        return Object.keys(JSON.parse(bruto)).length;
    } catch (erro) {
        return 0;
    }
}

function baixarBackup() {
    const texto = JSON.stringify(montarBackup(), null, 2);
    const arquivo = new Blob([texto], { type: "application/json" });
    const endereco = URL.createObjectURL(arquivo);
    const link = document.createElement("a");

    link.href = endereco;
    link.download = "kana-sensei-" + diaDe(new Date()) + ".json";
    link.click();

    URL.revokeObjectURL(endereco);

    localStorage.setItem(CHAVE_BACKUP, new Date().toISOString());
    mostrarBackup();
}

function restaurarBackup(texto) {
    let pacote = null;

    try {
        pacote = JSON.parse(texto);
    } catch (erro) {
        pacote = null;
    }

    if (pacote === null || pacote.app !== "kana-sensei"
        || typeof pacote.dados !== "object" || pacote.dados === null) {
        alert("Esse arquivo não parece ser um backup do Kana Sensei.");
        return;
    }

    const quantos = quantosNoBackup(pacote);
    const data = pacote.quando === undefined
        ? "sem data"
        : new Date(pacote.quando).toLocaleDateString("pt-BR");

    if (!confirm("Restaurar o backup de " + data + ", com " + quantos + " caracteres?"
        + "\n\nO progresso que está neste navegador agora será substituído.")) {
        return;
    }

    for (const chave of CHAVES_DO_APP) {
        if (pacote.dados[chave] === undefined) {
            localStorage.removeItem(chave);
        } else {
            localStorage.setItem(chave, pacote.dados[chave]);
        }
    }

    location.reload();
}

function diasDesdeOBackup() {
    const quando = localStorage.getItem(CHAVE_BACKUP);

    if (quando === null) {
        return null;
    }

    return Math.floor((Date.now() - new Date(quando).getTime()) / (24 * 60 * MINUTO));
}

function frasedoBackup(dias) {
    if (dias === null) {
        return "Você ainda não guardou nenhuma cópia.";
    }

    if (dias === 0) {
        return "Última cópia: hoje.";
    }

    if (dias === 1) {
        return "Última cópia: ontem.";
    }

    return "Última cópia: há " + dias + " dias.";
}

// ===== A SESSÃO E AS TELAS =====

const CHAVE_SESSAO = "kana-sensei-sessao-v1";

const TAMANHOS_DE_SESSAO = {
    perguntas: [10, 20, 40],
    tempo: [5, 10, 20]
};

// o que o aluno escolheu da última vez
let preferencia = { modo: "perguntas", alvo: 20 };

// a sessão em andamento, ou null quando ele está na tela de abertura
let sessao = null;

let telaAtual = "aprender";

function carregarPreferencia() {
    const guardado = localStorage.getItem(CHAVE_SESSAO);

    if (guardado === null) {
        return;
    }

    try {
        const lido = JSON.parse(guardado);

        if (TAMANHOS_DE_SESSAO[lido.modo] !== undefined
            && TAMANHOS_DE_SESSAO[lido.modo].includes(lido.alvo)) {
            preferencia = lido;
        }
    } catch (erro) {
        // preferência corrompida: fica o padrão
    }
}

function salvarPreferencia() {
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(preferencia));
}

function emSessao() {
    return sessao !== null && !sessao.terminou;
}

function minutosNaSessao() {
    return (Date.now() - sessao.comecou) / MINUTO;
}

// quanto da sessão já foi, de 0 a 1
function andamentoDaSessao() {
    if (sessao === null) {
        return 0;
    }

    const feito = sessao.modo === "tempo" ? minutosNaSessao() : sessao.feitas;

    return Math.max(0, Math.min(1, feito / sessao.alvo));
}

function sessaoAcabou() {
    if (sessao === null) {
        return false;
    }

    if (sessao.modo === "tempo") {
        return minutosNaSessao() >= sessao.alvo;
    }

    return sessao.feitas >= sessao.alvo;
}

function comecarSessao() {
    sessao = {
        modo: preferencia.modo,
        alvo: preferencia.alvo,
        feitas: 0,
        acertos: 0,
        novos: 0,
        piores: {},
        comecou: Date.now(),
        terminou: false
    };

    total = 0;
    acertos = 0;
    salvarPreferencia();
    mostrarTelaDeAprender();
    proximo();
}

function encerrarSessao() {
    if (sessao === null) {
        return;
    }

    sessao.terminou = true;
    sessao.duracao = minutosNaSessao();
    clearTimeout(temporizador);
    temporizador = null;
    document.removeEventListener("click", proximo);
    mostrarTelaDeAprender();
    mostrarFim();
}

// ---- o que aparece na tela Aprender depende de onde a sessão está ----

function mostrarTelaDeAprender() {
    const rolando = emSessao();
    const acabou = sessao !== null && sessao.terminou;

    areaInicio.hidden = rolando || acabou;
    areaSessao.hidden = !rolando;
    palco.hidden = !rolando;
    areaFim.hidden = !acabou;

    if (!rolando && !acabou) {
        mostrarInicio();
    }

    if (rolando) {
        mostrarBarraDaSessao();
    }
}

function mostrarBarraDaSessao() {
    if (sessao === null) {
        return;
    }

    const parte = andamentoDaSessao();

    areaSessaoCheio.style.width = Math.round(parte * 100) + "%";

    if (sessao.modo === "tempo") {
        const faltam = Math.max(0, Math.ceil(sessao.alvo - minutosNaSessao()));

        areaSessaoConta.textContent = faltam <= 1
            ? "Menos de 1 minuto · " + sessao.feitas + " respostas"
            : faltam + " minutos restantes · " + sessao.feitas + " respostas";
        return;
    }

    areaSessaoConta.textContent = sessao.feitas + " de " + sessao.alvo + " respostas";
}

function botoesDeTamanho() {
    const unidade = preferencia.modo === "tempo" ? " min" : "";
    let corpo = "";

    for (const alvo of TAMANHOS_DE_SESSAO[preferencia.modo]) {
        corpo += '<button class="pilula' + (alvo === preferencia.alvo ? " agora" : "") + '"'
            + ' data-alvo="' + alvo + '">' + alvo + unidade + '</button>';
    }

    return corpo;
}

function frasedoDia() {
    const hoje = historico[diaDe(new Date())];
    const fila = filaDeRevisao();
    const partes = [];

    if (hoje !== undefined && hoje.perguntas > 0) {
        partes.push(hoje.perguntas + (hoje.perguntas === 1 ? " resposta hoje" : " respostas hoje"));
    }

    if (fila.agora > 0) {
        partes.push(fila.agora + (fila.agora === 1 ? " item pedindo revisão" : " itens pedindo revisão"));
    }

    const vistos = CARACTERES.filter(foiApresentado).length;

    partes.push(vistos + " de " + CARACTERES.length + " caracteres começados");

    return partes.join(" · ");
}

function mostrarInicio() {
    areaInicio.innerHTML = '<div class="capa">'
        + '<span class="capa-jp">ひらがな・カタカナ</span>'
        + '<strong class="capa-titulo">Pronto para estudar?</strong>'
        + '<span class="capa-estado">' + frasedoDia() + '</span>'
        + '</div>'
        + '<div class="escolha">'
        + '<h3>Como você quer estudar</h3>'
        + '<div class="modos">'
        + '<button class="pilula modo' + (preferencia.modo === "perguntas" ? " agora" : "")
        + '" data-modo="perguntas">Por perguntas</button>'
        + '<button class="pilula modo' + (preferencia.modo === "tempo" ? " agora" : "")
        + '" data-modo="tempo">Por tempo</button>'
        + '</div>'
        + '<div class="tamanhos">' + botoesDeTamanho() + '</div>'
        + '<button class="acao principal comecar" id="comecar">Começar</button>'
        + '<p class="nota">A sessão termina sozinha quando chega no fim. Você pode'
        + ' encerrar antes a qualquer momento — o que foi estudado fica guardado.</p>'
        + '</div>';
}

function maisErradoDaSessao() {
    let pior = null;
    let quantos = 0;

    for (const id of Object.keys(sessao.piores)) {
        if (sessao.piores[id] > quantos) {
            quantos = sessao.piores[id];
            pior = id;
        }
    }

    return pior === null ? null : { caractere: porId(pior), erros: quantos };
}

function mostrarFim() {
    const taxa = sessao.feitas === 0 ? 0 : sessao.acertos / sessao.feitas;
    const minutos = Math.max(1, Math.round(sessao.duracao));
    const pior = maisErradoDaSessao();

    let corpo = '<div class="fim-topo">'
        + '<span class="etiqueta">Sessão concluída</span>'
        + '<strong class="fim-numero">' + sessao.feitas + '</strong>'
        + '<span class="fim-rotulo">' + (sessao.feitas === 1 ? "resposta" : "respostas") + '</span>'
        + '</div>'
        + '<div class="fila">'
        + '<div class="caixa"><strong>' + porcento(taxa) + '</strong><span>de acerto</span></div>'
        + '<div class="caixa"><strong>' + minutos + '</strong><span>'
        + (minutos === 1 ? "minuto" : "minutos") + '</span></div>'
        + '<div class="caixa"><strong>' + sessao.novos + '</strong><span>'
        + (sessao.novos === 1 ? "caractere novo" : "caracteres novos") + '</span></div>'
        + '</div>';

    if (pior !== null && pior.erros > 1) {
        corpo += '<p class="nota">O que mais escapou foi <b class="kana-linha">'
            + pior.caractere.kana + '</b> (' + pior.caractere.som + '), '
            + pior.erros + ' vezes. Ele volta com prioridade na próxima sessão.</p>';
    }

    corpo += '<div class="fim-acoes">'
        + '<button class="acao principal" id="de-novo">Estudar mais</button>'
        + '<button class="acao" id="ver-progresso">Ver progresso</button>'
        + '</div>';

    areaFim.innerHTML = corpo;
}

// ---- trocar de tela ----

function mostrarTela(nome) {
    telaAtual = nome;

    for (const secao of document.querySelectorAll(".tela")) {
        secao.hidden = secao.id !== "tela-" + nome;
    }

    for (const botao of areaAbasApp.querySelectorAll(".aba-app")) {
        botao.classList.toggle("agora", botao.dataset.tela === nome);
    }

    if (nome === "aprender") {
        mostrarTelaDeAprender();
    }

    if (nome === "progresso") {
        mostrarPainel();
    }

    window.scrollTo({ top: 0 });
}

// ===== A TELA =====

const areaPlacar = document.getElementById("placar");
const areaPergunta = document.getElementById("pergunta");
const areaOpcoes = document.getElementById("opcoes");
const areaResposta = document.getElementById("resposta");
const areaFichas = document.getElementById("fichas");
const areaMotivo = document.getElementById("motivo");
const areaDigitacao = document.getElementById("digitacao");
const entrada = document.getElementById("entrada");
const areaDetalhe = document.getElementById("detalhe");
const areaResumo = document.getElementById("resumo");
const areaSignificado = document.getElementById("significado");
const areaDesenho = document.getElementById("desenho");
const areaFita = document.getElementById("fita");
const areaAjudaFita = document.getElementById("ajuda-fita");
const areaBandeja = document.getElementById("bandeja");
const areaDicaFita = document.getElementById("dica-fita");
const areaApresentacao = document.getElementById("apresentacao");
const areaFocoAtivo = document.getElementById("foco-ativo");
const areaFocoControles = document.getElementById("foco-controles");
const areaTextos = document.getElementById("textos-conteudo");
const areaAbas = document.getElementById("abas");
const areaDados = document.getElementById("dados");
const areaMapa = document.getElementById("mapa");
const areaPraticar = document.getElementById("tela-praticar");
const palco = document.getElementById("palco");
const areaBackup = document.getElementById("backup-conteudo");
const botaoVerificar = document.getElementById("verificar");
const areaAbasApp = document.getElementById("abas-app");
const areaInicio = document.getElementById("inicio");
const areaFim = document.getElementById("fim");
const areaSessao = document.getElementById("sessao-barra");
const areaSessaoCheio = document.getElementById("sessao-cheio");
const areaSessaoConta = document.getElementById("sessao-conta");

botaoVerificar.addEventListener("click", () => {
    if (respondido) {
        proximo();
    } else {
        responderDigitado();
    }
});

// o teclado do celular empurra a tela: ao sair do campo, volta para o topo
entrada.addEventListener("blur", () => {
    if (!respondido) {
        return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("limpar").addEventListener("click", () => {
    errosNoTracoAtual = 0;
    pontosDoTraco = [];
    redesenharQuadro();
    mostrarProgressoDoDesenho();
});

document.getElementById("naosei").addEventListener("click", desistirDoDesenho);

document.getElementById("desisto").addEventListener("click", desistirDaFita);

areaFocoControles.addEventListener("change", (evento) => {
    if (evento.target.id === "foco-silabario") {
        foco.silabario = evento.target.value;
        montarControlesDoFoco();

        if (emSessao()) {
            proximo();
        }

        return;
    }

    if (evento.target.id === "foco-conjunto") {
        foco.conjunto = evento.target.value;
    } else if (evento.target.id === "foco-habilidade") {
        foco.direcao = evento.target.value;
    } else {
        return;
    }

    mostrarBarraDoFoco();

    if (emSessao()) {
        proximo();
    }
});

areaTextos.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button");

    if (botao === null) {
        return;
    }

    if (botao.id === "texto-guardar") {
        const titulo = document.getElementById("texto-titulo").value;
        const conteudo = document.getElementById("texto-conteudo").value;
        const novo = guardarTexto(titulo, conteudo);

        if (novo !== null) {
            estudarTexto(novo.id);
        }

        return;
    }

    if (botao.dataset.estudar !== undefined) {
        estudarTexto(botao.dataset.estudar);
        return;
    }

    if (botao.id === "parar-texto") {
        limparFoco();
        return;
    }

    if (botao.dataset.remover !== undefined) {
        if (confirm("Remover este texto?")) {
            removerTexto(botao.dataset.remover);
            montarControlesDoFoco();
            mostrarTextos();

            if (emSessao()) {
                proximo();
            }
        }
    }
});

areaFocoAtivo.addEventListener("click", (evento) => {
    if (evento.target.closest("#foco-sair") !== null) {
        limparFoco();
    }
});

areaApresentacao.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button");

    if (botao === null) {
        return;
    }

    if (botao.id === "entendi") {
        concluirApresentacao();
    } else if (botao.id === "sair-do-foco") {
        limparFoco();
    } else if (botao.id === "rever-tracos") {
        reverTracos();
    } else if (botao.id === "ouvir-novo") {
        falar(exercicio.correto.kana);
    }
});

entrada.addEventListener("input", () => {
    if (digitaNaFita() && !respondido) {
        digitouNaFita();
    }
});

areaFita.addEventListener("click", (evento) => {
    const casa = evento.target.closest(".casa");

    if (casa === null || exercicio.direcao !== "ouvir" || respondido) {
        return;
    }

    const i = Number(casa.dataset.posicao);

    if (i <= posicaoNaFita && exercicio.sequencia[i].fixo !== true) {
        falar(exercicio.sequencia[i].kana, VELOCIDADE_DITADO);
    }
});

document.getElementById("apagar").addEventListener("click", () => {
    if (confirm("Apagar todo o progresso?")) {
        reiniciar();
    }
});

areaFichas.addEventListener("click", (evento) => {
    const ficha = evento.target.closest(".ficha");

    if (ficha !== null) {
        escolhida = ficha.dataset.id;
        mostrarPainel();
        return;
    }

    const cabeca = evento.target.closest("[data-silabario], [data-grupo], [data-linha]");

    if (cabeca === null) {
        return;
    }

    if (cabeca.dataset.silabario !== undefined) {
        abertos.silabario = abertos.silabario === cabeca.dataset.silabario
            ? "" : cabeca.dataset.silabario;
    } else if (cabeca.dataset.grupo !== undefined) {
        abertos.grupo = abertos.grupo === cabeca.dataset.grupo
            ? "" : cabeca.dataset.grupo;
    } else {
        abertos.linha = abertos.linha === cabeca.dataset.linha
            ? "" : cabeca.dataset.linha;
    }

    mostrarMapa();
});

areaBackup.addEventListener("click", (evento) => {
    if (evento.target.closest("#baixar-backup") !== null) {
        baixarBackup();
    }
});

// o input de arquivo e refeito a cada desenho, entao a escuta fica no pai
areaBackup.addEventListener("change", (evento) => {
    const campo = evento.target.closest("#arquivo-backup");

    if (campo === null || campo.files.length === 0) {
        return;
    }

    campo.files[0].text().then(restaurarBackup);
});

areaAbas.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".aba");

    if (botao === null) {
        return;
    }

    abaDoPainel = botao.dataset.aba;
    mostrarPainel();
});

areaAbasApp.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".aba-app");

    if (botao !== null) {
        mostrarTela(botao.dataset.tela);
    }
});

areaInicio.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button");

    if (botao === null) {
        return;
    }

    if (botao.dataset.modo !== undefined) {
        preferencia.modo = botao.dataset.modo;
        preferencia.alvo = TAMANHOS_DE_SESSAO[preferencia.modo][1];
        salvarPreferencia();
        mostrarInicio();
        return;
    }

    if (botao.dataset.alvo !== undefined) {
        preferencia.alvo = Number(botao.dataset.alvo);
        salvarPreferencia();
        mostrarInicio();
        return;
    }

    if (botao.id === "comecar") {
        comecarSessao();
    }
});

areaFim.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button");

    if (botao === null) {
        return;
    }

    if (botao.id === "de-novo") {
        comecarSessao();
    } else if (botao.id === "ver-progresso") {
        mostrarTela("progresso");
    }
});

document.getElementById("parar-sessao").addEventListener("click", encerrarSessao);

function opcao(valor, texto, escolhido) {
    return '<option value="' + valor + '"' + (valor === escolhido ? " selected" : "") + '>'
        + texto + '</option>';
}

function montarControlesDoFoco() {
    let silabarios = opcao("", "Todos", foco.silabario);

    for (const silabario of SILABARIOS) {
        silabarios += opcao(silabario.id, silabario.nome, foco.silabario);
    }

    let conjuntos = opcao("", "Tudo", foco.conjunto);

    for (const grupo of GRUPOS) {
        conjuntos += '<optgroup label="' + grupo.nome + '">'
            + opcao("grupo:" + grupo.id, "Todo o " + grupo.nome.toLowerCase(), foco.conjunto);

        for (const linha of grupo.linhas) {
            conjuntos += opcao("linha:" + linha.id, rotuloDaLinha(linha), foco.conjunto);
        }

        conjuntos += '</optgroup>';
    }

    let habilidades = opcao("", "Todas", foco.direcao);

    for (const direcao of DIRECOES) {
        habilidades += opcao(direcao, HABILIDADES[direcao].nome, foco.direcao);
    }

    areaFocoControles.innerHTML = '<div class="foco-linha">'
        + '<label>Silabário<select id="foco-silabario">' + silabarios + '</select></label>'
        + '<label>Conjunto<select id="foco-conjunto">' + conjuntos + '</select></label>'
        + '<label>Habilidade<select id="foco-habilidade">' + habilidades + '</select></label>'
        + '</div>'
        + '<p class="nota">O app continua escolhendo o que praticar — só que dentro do recorte.</p>';

    mostrarBarraDoFoco();
}

function mostrarBarraDoFoco() {
    if (!focoAtivo()) {
        areaFocoAtivo.hidden = true;
        return;
    }

    const lista = caracteresNoFoco();
    const vistos = lista.filter(foiApresentado).length;

    areaFocoAtivo.hidden = false;
    areaFocoAtivo.innerHTML = '<span class="foco-rotulo">Foco</span>'
        + '<span class="foco-texto">' + descricaoDoFoco() + '</span>'
        + '<span class="foco-conta">' + vistos + ' de ' + lista.length + '</span>'
        + '<button id="foco-sair" class="foco-x" title="Voltar ao automático">✕</button>';
}

function mostrarTextos() {
    let corpo = '<div class="texto-novo">'
        + '<h4 class="texto-novo-titulo">Colar um texto</h4>'
        + '<input id="texto-titulo" placeholder="Título (ex: discurso do Pain)" maxlength="60">'
        + '<textarea id="texto-conteudo" rows="5"'
        + ' placeholder="Cole aqui um texto em kana."></textarea>'
        + '<p class="nota">Para praticar a leitura de um kanji, escreva a leitura'
        + ' entre colchetes: <code>痛[いた]み</code></p>'
        + '<button class="acao principal" id="texto-guardar">Guardar texto</button>'
        + '</div>';

    if (textos.length === 0) {
        corpo += '<p class="nota">Nenhum texto guardado ainda.</p>';
        areaTextos.innerHTML = corpo;
        return;
    }

    corpo += '<div class="lista-textos">';

    for (const texto of textos) {
        const cobertura = coberturaDe(texto);
        const prontos = trechosProntos(texto).length;
        const total = dividirEmTrechos(texto.conteudo).length;
        const parte = cobertura.total === 0 ? 0 : cobertura.conhecidos / cobertura.total;
        const estudando = foco.texto === texto.id;

        corpo += '<div class="texto-item' + (estudando ? " estudando" : "") + '">'
            + '<div class="texto-cabeca">'
            + '<strong>' + texto.titulo + '</strong>'
            + '<span class="medidor' + (parte === 0 ? " vazio" : "") + '">'
            + (parte === 0 ? "novo" : porcento(parte)) + '</span></div>'
            + '<div class="trilho"><span style="width:' + Math.max(2, parte * 100) + '%"></span></div>'
            + '<p class="amostra">' + comRuby(texto.conteudo.slice(0, 70))
            + (texto.conteudo.length > 70 ? "…" : "") + '</p>'
            + '<div class="texto-numeros">'
            + '<span><b>' + cobertura.conhecidos + '/' + cobertura.total + '</b> caracteres</span>'
            + '<span><b>' + prontos + '/' + total + '</b> trechos prontos</span>'
            + '</div>';

        const soltos = kanjiSemLeitura(texto.conteudo);

        if (soltos.length > 0) {
            corpo += '<p class="nota aviso-kanji">Sem leitura: <b class="kana-linha">'
                + soltos.slice(0, 10).join(" ") + '</b>'
                + (soltos.length > 10 ? " e mais " + (soltos.length - 10) : "")
                + ' — escreva <code>' + soltos[0] + '[よみ]</code> para praticar a leitura.</p>';
        }

        if (cobertura.faltam.length > 0) {
            corpo += '<p class="nota">Faltam: <b class="kana-linha">'
                + cobertura.faltam.slice(0, 12).join(" ") + '</b>'
                + (cobertura.faltam.length > 12 ? " e mais " + (cobertura.faltam.length - 12) : "")
                + '</p>';
        }

        corpo += '<div class="texto-acoes">';

        if (estudando) {
            corpo += '<span class="selo-estudando">✓ Estudando agora</span>'
                + '<button class="acao" id="parar-texto">Parar</button>';
        } else {
            corpo += '<button class="acao principal" data-estudar="' + texto.id + '">'
                + 'Estudar este texto</button>';
        }

        corpo += '<button class="acao apagar" data-remover="' + texto.id + '">Remover</button>'
            + '</div></div>';
    }

    areaTextos.innerHTML = corpo + '</div>';
}

function mostrarBackup() {
    const dias = diasDesdeOBackup();
    const atrasado = dias === null || dias >= DIAS_ATE_LEMBRAR;
    const caracteres = Object.keys(progresso).length;

    areaBackup.innerHTML = '<p class="backup-estado' + (atrasado ? " atrasado" : "") + '">'
        + frasedoBackup(dias) + '</p>'
        + '<p class="nota">Seu progresso mora só neste navegador. Limpar os dados do'
        + ' site, trocar de aparelho ou usar uma aba anônima faz ele sumir.'
        + ' Baixe uma cópia de vez em quando — é um arquivo pequeno,'
        + ' que você guarda onde quiser.</p>'
        + '<div class="backup-acoes">'
        + '<button class="acao principal" id="baixar-backup">Baixar cópia ('
        + caracteres + ' caracteres)</button>'
        + '<label class="acao" for="arquivo-backup">Restaurar de um arquivo</label>'
        + '<input type="file" id="arquivo-backup" accept="application/json,.json" hidden>'
        + '</div>';
}

function mostrarExercicio() {
    const lendo = exercicio.direcao === "ler";
    const ouvindo = exercicio.direcao === "ouvir";
    const desenhando2 = exercicio.direcao === "desenhar";
    const ehPalavra = exercicio.tipo === "palavra";
    const ehSequencia = exercicio.tipo === "sequencia";
    const ehMontar = exercicio.tipo === "montar";
    const ehTrecho = exercicio.tipo === "trecho";
    const ehLacuna = exercicio.tipo === "lacuna";
    const ehApresentacao = exercicio.tipo === "apresentacao";
    const ehVazio = exercicio.tipo === "vazio";
    const naFita = TIPOS_DE_FITA.includes(exercicio.tipo);
    const digitando = exercicio.tipo === "digitar" || ehPalavra
        || TIPOS_QUE_SE_DIGITAM.includes(exercicio.tipo);

    areaMotivo.textContent = exercicio.motivo;
    areaResposta.textContent = "";
    areaOpcoes.innerHTML = "";
    areaPergunta.innerHTML = "";
    respondido = false;

    const cartao = ehApresentacao || ehVazio;

    // na fita quem mostra o conteudo e a propria fita: o cabecalho so ocuparia espaco
    const semCabecalho = cartao || ((ehSequencia || ehTrecho || ehLacuna) && !ouvindo);

    areaApresentacao.hidden = !cartao;
    areaMotivo.hidden = cartao;
    areaPergunta.hidden = semCabecalho;
    areaSignificado.hidden = semCabecalho;
    areaResposta.hidden = cartao;
    areaOpcoes.hidden = digitando || desenhando2 || ehMontar || cartao;
    areaDigitacao.hidden = !digitando;
    botaoVerificar.hidden = true;
    areaDesenho.hidden = !desenhando2;
    areaFita.hidden = !naFita;
    areaAjudaFita.hidden = !naFita;
    areaBandeja.hidden = !ehMontar;

    if (ehVazio) {
        mostrarFocoVazio();
        return;
    }

    if (ehApresentacao) {
        areaPergunta.className = "";
        areaSignificado.textContent = "";
        mostrarApresentacao();
        return;
    }
    if (ehMontar) {
        areaDicaFita.textContent = "Toque nas peças na ordem certa";
    } else if (ehLacuna) {
        areaDicaFita.textContent = "Escreva o que falta no ○";
    } else if (ehTrecho && ouvindo) {
        areaDicaFita.textContent = "Ouça e escreva · toque numa casa feita para repetir";
    } else if (ehTrecho && temRuby()) {
        areaDicaFita.textContent = "Leia o trecho · escreva também a leitura de cada kanji";
    } else if (ehTrecho) {
        areaDicaFita.textContent = "Leia o trecho · pontuação e kanji já vêm prontos";
    } else {
        areaDicaFita.textContent = "Cada som avança sozinho · Espaço pula o caractere";
    }

    if (naFita) {
        prepararFita();
    }

    if (ouvindo) {
        const kanas = ehSequencia ? exercicio.sequencia.map(c => c.kana) : [];
        let tocar = () => falar(exercicio.correto.kana);

        if (ehSequencia) {
            tocar = () => falarEmPartes(kanas);
        } else if (ehTrecho) {
            tocar = () => falar(exercicio.kana, VELOCIDADE_DITADO);
        }

        areaPergunta.className = "kana";
        areaSignificado.textContent = "";

        const botaoSom = document.createElement("button");
        botaoSom.className = "som";
        botaoSom.textContent = "🔊";
        botaoSom.addEventListener("click", function (evento) {
            evento.stopPropagation();
            tocar();
        });

        areaPergunta.appendChild(botaoSom);
        tocar();
    } else if (ehPalavra) {
        areaPergunta.textContent = exercicio.palavra.kana;
        areaPergunta.className = "kana palavra";
        areaSignificado.textContent = exercicio.palavra.significado;
    } else if (ehMontar) {
        areaPergunta.textContent = kanaParaRomaji(exercicio.kana);
        areaPergunta.className = "romaji";
        areaSignificado.textContent = exercicio.palavra.significado;
    } else if (ehSequencia || ehTrecho || ehLacuna) {
        areaPergunta.className = "";
        areaSignificado.textContent = "";
    } else {
        areaPergunta.textContent = lendo ? exercicio.correto.kana : exercicio.correto.som;
        areaPergunta.className = lendo ? "kana" : "romaji";
        areaSignificado.textContent = "";
    }

    if (ehMontar) {
        return;
    }

    if (desenhando2) {
        prepararQuadro();
        return;
    }

    if (digitando) {
        entrada.value = "";
        entrada.className = "";
        entrada.disabled = false;
        arrumarVerificar();
        entrada.focus();
        return;
    }

    for (const opcao of exercicio.opcoes) {
        const botao = document.createElement("button");
        botao.textContent = lendo ? opcao.som : opcao.kana;
        botao.className = lendo ? "opcao" : "opcao kana";
        botao.addEventListener("click", () => responderEscolha(opcao, botao));
        areaOpcoes.appendChild(botao);

        if (opcao.id === exercicio.correto.id) {
            botaoCerto = botao;
        }
    }
}

function cartao(titulo, corpo) {
    return '<section class="cartao"><h3>' + titulo + '</h3>' + corpo + '</section>';
}

function porcento(valor) {
    return Math.round(valor * 100) + "%";
}

function barraDeEstagios(conta) {
    let html = '<div class="barra">';

    for (const estagio of ORDEM_DOS_ESTAGIOS) {
        if (conta[estagio] > 0) {
            html += '<span class="fatia ' + estagio + '" style="flex:' + conta[estagio] + '"'
                + ' title="' + conta[estagio] + ' ' + estagio + '"></span>';
        }
    }

    return html + '</div>';
}

function linhaComBarra(rotulo, conta, total) {
    const prontos = conta.firme + conta.dominado;

    return '<div class="linha-barra">'
        + '<span class="rotulo">' + rotulo + '</span>'
        + barraDeEstagios(conta)
        + '<span class="numero">' + prontos + '/' + total + '</span>'
        + '</div>';
}

function resumoEmFrase() {
    const dias = Object.keys(historico).filter(d => historico[d].perguntas > 0).length;
    let perguntas = 0;
    let acertos = 0;

    for (const dia in historico) {
        perguntas = perguntas + historico[dia].perguntas;
        acertos = acertos + historico[dia].acertos;
    }

    if (perguntas === 0) {
        return '<p class="frase">Ainda sem exercícios. O domínio começa a subir na primeira resposta.</p>';
    }

    const taxa = Math.round(100 * acertos / perguntas);

    return '<p class="frase">' + perguntas + ' exercícios em ' + dias
        + (dias === 1 ? ' dia' : ' dias') + ', ' + taxa + '% de acertos.'
        + ' O domínio só sobe quando você lembra depois de um tempo sem ver,'
        + ' então ele cresce de verdade ao longo dos dias.</p>';
}

function painelDoSilabario(silabario) {
    const lista = doSilabario(silabario.id);
    const conta = contarEstagios(lista.map(estagioDe));
    const basico = dominioDoConjunto(doGrupo(silabario.id, "basico"));
    const estendido = dominioDoConjunto(
        lista.filter(c => c.grupo !== "basico"));

    return '<div class="silabario">'
        + '<div class="placar-grande">'
        + '<div><span class="titulo-kana">' + silabario.nome + '</span>'
        + '<span class="sub">' + silabario.rotulo + '</span></div>'
        + '<strong class="grande">' + porcento(dominioDoConjunto(lista)) + '</strong>'
        + '</div>'
        + barraDeEstagios(conta)
        + '<div class="legenda">'
        + '<span>Básico <strong>' + porcento(basico) + '</strong></span>'
        + '<span>Estendido <strong>' + porcento(estendido) + '</strong></span>'
        + '</div>'
        + '<div class="legenda">'
        + '<span><strong>' + conta.dominado + '</strong> dominados</span>'
        + '<span><strong>' + (conta.aprendendo + conta.firme) + '</strong> em aprendizado</span>'
        + '<span><strong>' + conta.novo + '</strong> não vistos</span>'
        + '</div></div>';
}

function resumoDoTotal() {
    let corpo = '<div class="silabarios">';

    for (const silabario of SILABARIOS) {
        corpo += painelDoSilabario(silabario);
    }

    corpo += '</div><p class="nota">O estágio de um caractere é o da sua habilidade mais fraca'
        + ' entre as já liberadas. Destravar uma habilidade nova pode fazer ele descer.</p>';

    return cartao("Seu progresso", resumoEmFrase() + corpo);
}

function resumoPorDirecao() {
    let corpo = '<p class="nota topo">Média entre os caracteres que você já começou a estudar.</p>'
        + '<div class="habilidades">';

    for (const direcao of DIRECOES) {
        const valor = dominioDaHabilidade(direcao);
        const nome = HABILIDADES[direcao];

        corpo += '<div class="habilidade">'
            + '<div class="cabeca"><strong>' + nome.nome + '</strong>'
            + '<span>' + porcento(valor) + '</span></div>'
            + '<div class="trilho"><span style="width:' + Math.max(1, valor * 100) + '%"></span></div>'
            + '<small>' + nome.descricao + '</small>'
            + '</div>';
    }

    return cartao("Habilidades", corpo + '</div>');
}

function tetoBonito(valor) {
    const degraus = [0.05, 0.1, 0.2, 0.25, 0.5, 0.75, 1];

    for (const degrau of degraus) {
        if (valor <= degrau) {
            return degrau;
        }
    }

    return 1;
}

function resumoDaEvolucao() {
    const dias = ultimosDias(DIAS_NO_HISTORICO);
    const largura = 320;

    // dois paineis empilhados, nunca duas escalas no mesmo desenho:
    // em cima o dominio (o que importa), embaixo o esforco do dia.
    const curvaTopo = 16;
    const curvaBase = 126;
    const barrasTopo = 156;
    const barrasBase = 194;
    const altura = 212;

    let maiorPerguntas = 1;
    let maiorDominio = 0;

    for (const dia of dias) {
        maiorPerguntas = Math.max(maiorPerguntas, dia.perguntas);
        maiorDominio = Math.max(maiorDominio, dia.dominio);
    }

    const teto = tetoBonito(maiorDominio);
    const passo = largura / dias.length;
    const pontos = [];
    let barras = "";
    let rotulos = "";
    let marcas = "";

    for (let i = 0; i < dias.length; i++) {
        const dia = dias[i];
        const meio = passo * i + passo / 2;

        if (dia.perguntas > 0) {
            const alta = Math.max(3, (barrasBase - barrasTopo) * dia.perguntas / maiorPerguntas);

            barras += '<rect x="' + (meio - passo * 0.32).toFixed(1) + '"'
                + ' y="' + (barrasBase - alta).toFixed(1) + '"'
                + ' width="' + (passo * 0.64).toFixed(1) + '" height="' + alta.toFixed(1) + '"'
                + ' class="barra-dia"><title>' + dia.chave + ': '
                + dia.perguntas + ' exercícios</title></rect>';

            pontos.push({
                x: meio,
                y: curvaBase - (curvaBase - curvaTopo) * dia.dominio / teto,
                dia: dia
            });
        }

        if (i % 3 === 0 || i === dias.length - 1) {
            rotulos += '<text x="' + meio.toFixed(1) + '" y="' + (altura - 4) + '"'
                + ' class="rotulo-dia">' + dia.data.getDate() + '</text>';
        }
    }

    let curva = "";

    if (pontos.length > 1) {
        const caminho = pontos.map(p => p.x.toFixed(1) + "," + p.y.toFixed(1)).join(" ");

        curva = '<polygon class="area-dominio" points="'
            + pontos[0].x.toFixed(1) + "," + curvaBase + " "
            + caminho + " "
            + pontos[pontos.length - 1].x.toFixed(1) + "," + curvaBase + '"/>'
            + '<polyline class="linha-dominio" points="' + caminho + '"/>';
    }

    for (const ponto of pontos) {
        marcas += '<rect class="ponto-dominio" x="' + (ponto.x - 3.5).toFixed(1) + '"'
            + ' y="' + (ponto.y - 3.5).toFixed(1) + '" width="7" height="7">'
            + '<title>' + ponto.dia.chave + ': '
            + porcento(ponto.dia.dominio) + ' de domínio</title></rect>';
    }

    const grafico = '<svg viewBox="0 0 ' + largura + ' ' + altura + '" class="grafico">'
        + '<line x1="0" y1="' + curvaTopo + '" x2="' + largura + '" y2="' + curvaTopo
        + '" class="eixo tracejado"/>'
        + curva + marcas
        + '<line x1="0" y1="' + curvaBase + '" x2="' + largura + '" y2="' + curvaBase
        + '" class="eixo"/>'
        + '<text x="3" y="' + (curvaTopo - 5) + '" class="rotulo-eixo">'
        + porcento(teto) + '</text>'
        + '<text x="3" y="' + (barrasTopo - 8) + '" class="rotulo-eixo">'
        + maiorPerguntas + ' exercícios</text>'
        + barras
        + '<line x1="0" y1="' + barrasBase + '" x2="' + largura + '" y2="' + barrasBase
        + '" class="eixo"/>'
        + rotulos + '</svg>';

    return cartao("Evolução", '<p class="nota topo">Em cima, o domínio geral ao longo de '
        + DIAS_NO_HISTORICO + ' dias — chegou a ' + porcento(maiorDominio) + '.'
        + ' Embaixo, quantos exercícios você fez em cada dia.</p>' + grafico);
}

function resumoDosDificeis() {
    const lista = maisDificeis();

    if (lista.length === 0) {
        return cartao("Mais difíceis", '<p class="nota">Ainda faltam respostas para ranquear.'
            + ' Precisa de pelo menos ' + MINIMO_PARA_RANKING + ' por caractere.</p>');
    }

    let corpo = '<p class="nota topo">Menos acertos e menos domínio.</p><div class="ranking">';

    for (const item of lista) {
        corpo += '<div class="item">'
            + '<span class="kana">' + item.caractere.kana + '</span>'
            + '<span class="leitura">' + item.caractere.som + '</span>'
            + '<span class="valor">' + porcento(item.taxa) + ' de ' + item.total + '</span>'
            + '</div>';
    }

    return cartao("Mais difíceis", corpo + '</div>');
}

function resumoDasConfusoes() {
    const pares = [];
    const vistos = {};

    for (const caractere of CARACTERES) {
        for (const confusao of confusoesDe(caractere.id)) {
            if (confusao.peso < PESO_CONFUSAO_MINIMO) {
                continue;
            }

            const outro = porId(confusao.id);

            if (outro === null) {
                continue;
            }

            const chave = [caractere.id, outro.id].sort().join("|");

            if (vistos[chave] === undefined) {
                vistos[chave] = true;
                pares.push({ a: caractere, b: outro, peso: confusao.peso });
            }
        }
    }

    if (pares.length === 0) {
        return cartao("Pares que você troca", '<p class="nota">Nenhum par se destacou ainda.</p>');
    }

    pares.sort((x, y) => y.peso - x.peso);

    let corpo = '<div class="pares">';

    for (const par of pares.slice(0, QUANTOS_NO_RANKING)) {
        const dica = dicaPara(par.a.kana, par.b.kana);
        const leitura = par.a.kana + " = " + par.a.som + " · " + par.b.kana + " = " + par.b.som;

        corpo += '<div class="par"><span class="kana">' + par.a.kana + ' ' + par.b.kana + '</span>'
            + '<span class="explica">' + (dica === null ? leitura : dica) + '</span></div>';
    }

    return cartao("Pares que você troca", corpo + '</div>');
}

function caixasDaFila() {
    const fila = filaDeRevisao();
    const nomes = [
        { id: "caiu", nome: "já esfriaram" },
        { id: "hoje", nome: "nas próximas 24h" },
        { id: "semana", nome: "nesta semana" },
        { id: "depois", nome: "depois disso" }
    ];

    let corpo = '<div class="fila">';

    for (const item of nomes) {
        corpo += '<div class="caixa"><strong>' + fila[item.id] + '</strong>'
            + '<span>' + item.nome + '</span></div>';
    }

    return corpo + '</div>';
}

function resumoDasRevisoes() {
    const lista = sendoEsquecidos();
    const topo = caixasDaFila()
        + '<p class="nota">Pares de caractere e habilidade que passam de 50% de lembrança'
        + ' para baixo em cada janela.</p>';

    if (lista.length === 0) {
        return cartao("Revisões", topo
            + '<p class="nota">Nada esquecido ainda. As revisões estão em dia.</p>');
    }

    let corpo = topo
        + '<p class="nota topo">Já foram aprendidos, mas precisam de revisão:</p>'
        + '<div class="ranking">';

    for (const item of lista) {
        corpo += '<div class="item">'
            + '<span class="kana">' + item.caractere.kana + '</span>'
            + '<span class="leitura">' + HABILIDADES[item.direcao].nome.toLowerCase() + '</span>'
            + '<span class="valor">' + porcento(item.lembranca) + ' de lembrança</span>'
            + '</div>';
    }

    return cartao("Revisões", corpo + '</div>');
}

function resumoDosFormatos() {
    const chaves = Object.keys(formatos).filter(c => formatos[c].perguntas > 0);

    if (chaves.length === 0) {
        return cartao("Por tipo de exercício",
            '<p class="nota">Nenhum formato registrado ainda.</p>');
    }

    chaves.sort((a, b) => (formatos[a].acertos / formatos[a].perguntas)
        - (formatos[b].acertos / formatos[b].perguntas));

    let corpo = '<p class="nota topo">Taxa de acerto em cada formato.'
        + ' Os mais fracos tendem a aparecer mais.</p><div class="formatos">';

    for (const chave of chaves) {
        const dado = formatos[chave];
        const taxa = dado.acertos / dado.perguntas;

        corpo += '<div class="formato">'
            + '<div class="cabeca"><strong>' + nomeDoFormato(chave) + '</strong>'
            + '<span>' + porcento(taxa) + '</span></div>'
            + '<div class="trilho escuro"><span style="width:'
            + Math.max(1, taxa * 100) + '%"></span></div>'
            + '<small>' + dado.perguntas + (dado.perguntas === 1 ? " vez" : " vezes") + '</small>'
            + '</div>';
    }

    return cartao("Por tipo de exercício", corpo + '</div>');
}

function resumoPorGrupo() {
    let corpo = "";

    for (const silabario of SILABARIOS) {
        for (const grupo of GRUPOS) {
            const lista = doGrupo(silabario.id, grupo.id);
            const rotulo = silabario.nome + " · " + grupo.nome;

            corpo += linhaComBarra(rotulo, contarEstagios(lista.map(estagioDe)), lista.length);
        }
    }

    return cartao("Por grupo", corpo);
}

function mostrarResumo() {
    areaResumo.innerHTML = resumoDoTotal()
        + resumoPorDirecao()
        + resumoDaEvolucao()
        + resumoDasRevisoes();

    areaDados.innerHTML = resumoDosDificeis()
        + resumoDasConfusoes()
        + resumoDosFormatos()
        + resumoPorGrupo();
}

// ===== O MAPA DOS CARACTERES =====

function linhasDoGrupo(grupo) {
    return GRUPOS.find(g => g.id === grupo).linhas;
}

function daLinha(silabario, linhaId) {
    return CARACTERES.filter(c => c.silabario === silabario && c.linha === linhaId);
}

function kanaDaLinhaNoMapa(silabario, linha) {
    const kanas = dividirEmKanas(linha.kana);

    return kanas.map(k => silabario.vira ? paraKatakana(k) : k).join("");
}

function medidor(lista) {
    const vistos = lista.filter(foiApresentado).length;

    if (vistos === 0) {
        return '<span class="medidor vazio">novo</span>';
    }

    return '<span class="medidor">' + porcento(dominioDoConjunto(lista)) + '</span>';
}

function cabecaDoNivel(tipo, chave, nome, sub, lista, aberto) {
    return '<button class="nivel-cabeca" data-' + tipo + '="' + chave + '">'
        + '<span class="nivel-seta">' + (aberto ? "\u2013" : "+") + '</span>'
        + '<span class="nivel-nome">' + nome
        + (sub === "" ? "" : '<small>' + sub + '</small>') + '</span>'
        + medidor(lista)
        + '</button>';
}

function cartaoDaLinha(silabario, linha) {
    const lista = daLinha(silabario.id, linha.id);
    const chave = silabario.id + ":" + linha.id;
    const aberta = abertos.linha === chave;
    const vistos = lista.filter(foiApresentado).length;
    const parte = vistos === 0 ? 0 : dominioDoConjunto(lista);

    let corpo = '<div class="linha-cartao' + (aberta ? " aberta" : "")
        + (vistos === 0 ? " intocada" : "") + '">'
        + '<button class="linha-cabeca" data-linha="' + chave + '">'
        + '<span class="linha-textos">'
        + '<span class="linha-sons">' + linha.sons + '</span>'
        + '<span class="linha-kana">' + kanaDaLinhaNoMapa(silabario, linha) + '</span>'
        + '</span>'
        + medidor(lista)
        + '</button>'
        + '<div class="trilho"><span style="width:' + Math.max(2, parte * 100) + '%"></span></div>';

    if (aberta) {
        corpo += '<div class="linha-fichas">';

        for (const caractere of lista) {
            corpo += fichaEmHtml(caractere);
        }

        corpo += '</div>';
    }

    return corpo + '</div>';
}

function mostrarMapa() {
    let corpo = "";

    for (const silabario of SILABARIOS) {
        const lista = doSilabario(silabario.id);
        const aberto = abertos.silabario === silabario.id;

        corpo += '<section class="nivel silabario' + (aberto ? " aberto" : "") + '">'
            + cabecaDoNivel("silabario", silabario.id, silabario.nome,
                silabario.rotulo, lista, aberto);

        if (aberto) {
            corpo += '<div class="nivel-corpo">';

            for (const grupo of GRUPOS) {
                const doGrupoAqui = doGrupo(silabario.id, grupo.id);
                const abertoAqui = abertos.grupo === grupo.id;

                corpo += '<section class="nivel conjunto' + (abertoAqui ? " aberto" : "") + '">'
                    + cabecaDoNivel("grupo", grupo.id, grupo.nome, "", doGrupoAqui, abertoAqui);

                if (abertoAqui) {
                    corpo += '<div class="linhas">';

                    for (const linha of linhasDoGrupo(grupo.id)) {
                        corpo += cartaoDaLinha(silabario, linha);
                    }

                    corpo += '</div>';
                }

                corpo += '</section>';
            }

            corpo += '</div>';
        }

        corpo += '</section>';
    }

    areaFichas.innerHTML = corpo;
}

function mostrarAba() {
    areaResumo.hidden = abaDoPainel !== "resumo";
    areaMapa.hidden = abaDoPainel !== "mapa";
    areaDados.hidden = abaDoPainel !== "dados";

    for (const botao of areaAbas.querySelectorAll(".aba")) {
        botao.classList.toggle("agora", botao.dataset.aba === abaDoPainel);
    }
}

function fichaEmHtml(caractere) {
    let classes = "ficha";
    let texto = "–";

    if (caractere.kana.length > 1) {
        classes = classes + " duplo";
    }

    if (caractere.id === escolhida) {
        classes = classes + " escolhida";
    }

    if (foiApresentado(caractere)) {
        const forca = forcaDe(caractere);
        texto = Math.round(forca * 100) + "%";

        if (forca >= 0.8) {
            classes = classes + " forte";
        } else if (forca >= 0.4) {
            classes = classes + " media";
        } else {
            classes = classes + " fraca";
        }
    }

    return '<div class="' + classes + '" data-id="' + caractere.id + '">'
        + '<span class="k">' + caractere.kana + '</span>'
        + '<span class="n">' + texto + '</span></div>';
}

function mostrarPainel() {
    // só desenha quando a tela de progresso está à vista: são muitos caracteres
    if (telaAtual === "progresso") {
        mostrarAba();
        mostrarMapa();
        mostrarDetalhe();
        mostrarResumo();
    }

    mostrarBarraDoFoco();
}

function escadaEmHtml(caractere) {
    const atual = degrauDe(caractere);
    let corpo = '<div class="escada">';

    for (let i = 0; i < ESCADA.length; i++) {
        const estado = i < atual ? " feito" : (i === atual ? " agora" : "");

        corpo += '<span class="passo' + estado + '">'
            + '<b>' + (i + 1) + '</b>' + ESCADA[i].nome + '</span>';
    }

    return corpo + '</div>';
}

function mostrarDetalhe() {
    if (escolhida === null) {
        areaDetalhe.innerHTML = '<p class="nota">Toque num caractere para ver os detalhes.</p>';
        return;
    }

    const caractere = porId(escolhida);

    if (!foiApresentado(caractere)) {
        const desenho = svgDosTracos(caractere.kana, false);

        areaDetalhe.innerHTML = '<div class="detalhe-topo">'
            + '<span class="kana-grande">' + caractere.kana + '</span>'
            + '<div><strong>' + caractere.som + '</strong>'
            + '<span class="sub">ainda não estudado</span></div></div>'
            + (desenho === "" ? "" : '<div class="diagrama">' + desenho + '</div>');
        return;
    }

    const contas = respostasDe(caractere);
    const liberadas = direcoesLiberadas(caractere);

    const irmao = irmaoDe(caractere);
    const diagrama = svgDosTracos(caractere.kana, false);

    let corpo = '<div class="detalhe-topo">'
        + '<span class="kana-grande">' + caractere.kana + '</span>'
        + '<div><strong>' + caractere.som + '</strong>'
        + '<span class="sub">Domínio ' + porcento(dominioDe(caractere)) + '</span></div>'
        + '</div>';

    if (diagrama !== "") {
        corpo += '<div class="diagrama">' + diagrama + '</div>';
    }

    corpo += escadaEmHtml(caractere);

    if (irmao !== null) {
        corpo += '<p class="nota">' + nomeDoSilabario(irmao) + ': '
            + '<b class="kana-linha">' + irmao.kana + '</b> · mesmo som</p>';
    }

    for (const direcao of direcoesPossiveis(caractere)) {
        const memoria = memoriaDe(caractere.id, direcao);
        const valor = dominioDaMemoria(memoria);

        let lado = "ainda não liberado";

        if (liberadas.includes(direcao) && memoria.meiaVida === 0) {
            lado = "não praticado";
        } else if (liberadas.includes(direcao)) {
            lado = memoria.acertos + "/" + (memoria.acertos + memoria.erros) + " certos";
        }

        corpo += '<div class="habilidade">'
            + '<div class="cabeca"><strong>' + HABILIDADES[direcao].nome + '</strong>'
            + '<span>' + lado + '</span></div>'
            + '<div class="trilho"><span style="width:' + (valor * 100) + '%"></span></div>'
            + '</div>';
    }

    corpo += '<p class="nota">' + contas.total + ' respostas, ' + contas.erros
        + (contas.erros === 1 ? " erro" : " erros")
        + '<br>Próxima revisão ideal: ' + emQuantoTempo(proximaRevisao(caractere)) + '</p>';

    const confusoesDoCaractere = confusoesDe(caractere.id)
        .filter(c => c.peso >= PESO_CONFUSAO_MINIMO);

    if (confusoesDoCaractere.length > 0) {
        const nomes = confusoesDoCaractere.slice(0, 3).map(c => porId(c.id).kana);
        corpo += '<p class="nota">Você troca com ' + nomes.join(" ") + '</p>';
    }

    areaDetalhe.innerHTML = corpo;
}

// ===== A FITA =====

const TIPOS_DE_FITA = ["sequencia", "montar", "trecho", "lacuna"];
const TIPOS_QUE_SE_DIGITAM = ["sequencia", "trecho", "lacuna"];

function usaFita() {
    if (exercicio === null) {
        return false;
    }

    return exercicio !== null && TIPOS_DE_FITA.includes(exercicio.tipo);
}

function temRuby() {
    if (exercicio === null) {
        return false;
    }

    return exercicio !== null
        && exercicio.sequencia !== undefined
        && exercicio.sequencia.some(item => item.ruby !== undefined);
}

function digitaNaFita() {
    return exercicio !== null && TIPOS_QUE_SE_DIGITAM.includes(exercicio.tipo);
}

function pularFixos() {
    while (posicaoNaFita < exercicio.sequencia.length
        && exercicio.sequencia[posicaoNaFita].fixo === true) {
        posicaoNaFita = posicaoNaFita + 1;
    }
}

function prepararFita() {
    posicaoNaFita = 0;
    errosNaFita = exercicio.sequencia.map(() => false);
    pularFixos();
    desenharFita();

    if (exercicio.tipo === "montar") {
        desenharBandeja();
    }
}

function desenharFita() {
    const montando = exercicio.tipo === "montar";
    const completando = exercicio.tipo === "lacuna";
    const esconde = montando || completando || exercicio.direcao === "ouvir";
    const vazia = (montando || completando) ? "○" : "・";

    areaFita.className = "modo-" + exercicio.tipo;
    areaFita.innerHTML = "";

    let grupoAberto = null;
    let ondeCai = areaFita;

    for (let i = 0; i < exercicio.sequencia.length; i++) {
        const item = exercicio.sequencia[i];
        const fixo = item.fixo === true;
        const passou = i < posicaoNaFita;
        const doRuby = item.ruby === undefined ? null : item.ruby;

        if (doRuby !== grupoAberto) {
            grupoAberto = doRuby;
            ondeCai = areaFita;

            if (doRuby !== null) {
                const grupo = document.createElement("span");
                const leitura = document.createElement("span");
                const pai = document.createElement("span");

                grupo.className = "grupo";
                leitura.className = "leitura";
                pai.className = "pai";
                pai.textContent = item.pai;

                grupo.appendChild(leitura);
                grupo.appendChild(pai);
                areaFita.appendChild(grupo);

                ondeCai = leitura;
            }
        }

        const casa = document.createElement("span");

        casa.className = "casa";
        casa.dataset.posicao = i;
        casa.textContent = (esconde && !passou && !fixo) ? vazia : item.kana;

        if (fixo) {
            casa.classList.add("fixa");
        } else if (i === posicaoNaFita) {
            casa.classList.add("agora");
        }

        if (passou && !fixo) {
            casa.classList.add("feita");
        }

        if (errosNaFita[i]) {
            casa.classList.add("tropecou");
        }

        ondeCai.appendChild(casa);
    }
}

function desenharBandeja() {
    areaBandeja.innerHTML = "";

    for (const kana of exercicio.bandeja) {
        const peca = document.createElement("button");

        peca.className = "peca kana";
        peca.textContent = kana;
        peca.addEventListener("click", () => tocouNaBandeja(kana, peca));

        areaBandeja.appendChild(peca);
    }
}

function tocouNaBandeja(kana, peca) {
    if (respondido || exercicio.tipo !== "montar") {
        return;
    }

    const esperado = exercicio.sequencia[posicaoNaFita];

    if (kana === esperado.kana) {
        avancarNaFita();
        return;
    }

    errosNaFita[posicaoNaFita] = true;
    anotarConfusao(esperado.id, porKana(kana).id);

    peca.classList.add("recusada");
    setTimeout(() => peca.classList.remove("recusada"), 300);

    desenharFita();
}

function digitouNaFita() {
    const texto = limpar(entrada.value);
    const esperado = exercicio.sequencia[posicaoNaFita];

    if (texto === "") {
        return;
    }

    if (esperado.grafias.includes(texto)) {
        avancarNaFita();
        return;
    }

    if (esperado.grafias.some(grafia => grafia.startsWith(texto))) {
        return;
    }

    errosNaFita[posicaoNaFita] = true;
    entrada.value = "";
    desenharFita();
}

function avancarNaFita() {
    posicaoNaFita = posicaoNaFita + 1;
    pularFixos();
    entrada.value = "";
    desenharFita();

    if (posicaoNaFita >= exercicio.sequencia.length) {
        concluirFita();
    }
}

function pularNaFita() {
    errosNaFita[posicaoNaFita] = true;
    avancarNaFita();
}

function concluirFita() {
    entrada.disabled = true;
    falar(exercicio.kana);

    responder(!errosNaFita.includes(true), null);
}

function desistirDaFita() {
    if (respondido || !usaFita()) {
        return;
    }

    for (let i = posicaoNaFita; i < exercicio.sequencia.length; i++) {
        if (exercicio.sequencia[i].fixo !== true) {
            errosNaFita[i] = true;
        }
    }

    posicaoNaFita = exercicio.sequencia.length;
    desenharFita();
    entrada.disabled = true;

    responder(false, null);
}

// ===== O LOOP =====

// o termostato de caracteres novos só escuta os exercícios isolados.
// errar uma sequência de seis kanas não quer dizer que você está sobrecarregado
// de caracteres novos — quer dizer que a sequência é difícil. se o contexto
// entrasse nessa conta, ele freava a entrada de caracteres novos sozinho.
function lembrarDoResultado(acertou) {
    if (TIPOS_DE_CONTEXTO.includes(exercicio.tipo)) {
        return;
    }

    recentes.push(acertou ? 1 : 0);

    if (recentes.length > HISTORICO_RECENTE) {
        recentes.shift();
    }
}

function lembrarDoRecente(id) {
    ultimos.unshift(id);

    if (ultimos.length > PENALIDADES.length) {
        ultimos.pop();
    }
}

function proximo() {
    clearTimeout(temporizador);
    temporizador = null;
    document.removeEventListener("click", proximo);
    marcarPalco(null);

    // o fim da sessão só chega entre uma pergunta e outra: no modo tempo,
    // a pergunta que já está na tela sempre pode ser terminada.
    if (sessaoAcabou()) {
        encerrarSessao();
        return;
    }

    exercicio = criarExercicio();
    mostrarExercicio();
}

// o carimbo de certo/errado: quem desenha e o css, aqui so trocamos a classe
function arrumarVerificar() {
    const digitando = !areaDigitacao.hidden;

    botaoVerificar.hidden = !digitando || digitaNaFita();
    botaoVerificar.textContent = respondido ? "Continuar" : "Verificar";
    botaoVerificar.classList.toggle("principal", !respondido);
}

function marcarPalco(estado) {
    if (palco === null) {
        return;
    }

    palco.classList.remove("acertou", "errou");

    if (estado === null) {
        return;
    }

    // forca o navegador a recomecar a animacao
    void palco.offsetWidth;
    palco.classList.add(estado);
}

function responderEscolha(opcao, botao) {
    if (respondido) {
        return;
    }

    const acertou = opcao.id === exercicio.correto.id;

    if (acertou) {
        botao.classList.add("certa");
    } else {
        botao.classList.add("errada");
        botaoCerto.classList.add("certa");
    }

    responder(acertou, opcao);
}

function responderDigitado() {
    if (respondido) {
        return;
    }

    if (exercicio.tipo === "escolha" || usaFita()) {
        return;
    }

    if (limpar(entrada.value) === "") {
        return;
    }

    if (exercicio.tipo === "palavra") {
        const acertouPalavra = mesmaLeitura(entrada.value, exercicio.palavra.kana);

        entrada.disabled = true;
        entrada.className = acertouPalavra ? "certa" : "errada";

        responder(acertouPalavra, null);
        return;
    }

    const acertou = conferir(entrada.value, exercicio.correto);
    const texto = limpar(entrada.value);
    const escolhido = CARACTERES.find(c => c.grafias.includes(texto)) || null;

    entrada.disabled = true;
    entrada.className = acertou ? "certa" : "errada";

    responder(acertou, escolhido);
}

function textoParaFalar() {
    if (exercicio.tipo === "palavra") {
        return exercicio.palavra.kana;
    }

    if (usaFita()) {
        return exercicio.kana;
    }

    return exercicio.correto.kana;
}

function respostaCerta() {
    if (exercicio.tipo === "palavra") {
        return "Era " + exercicio.palavra.kana + " (" + kanaParaRomaji(exercicio.palavra.kana) + ")";
    }

    if (exercicio.tipo === "montar") {
        return "Era " + exercicio.kana + " (" + kanaParaRomaji(exercicio.kana) + ")";
    }

    if (usaFita() && exercicio.tipo !== "montar") {
        const tropecos = [];

        for (let i = 0; i < exercicio.sequencia.length; i++) {
            const caractere = exercicio.sequencia[i];

            if (errosNaFita[i] && caractere.fixo !== true) {
                tropecos.push(caractere.kana + " = " + caractere.som);
            }
        }

        return "Tropeçou em " + tropecos.join(" · ");
    }

    if (exercicio.direcao === "ler") {
        return "Era " + exercicio.correto.som;
    }

    return "Era " + exercicio.correto.kana;
}

function responder(acertou, escolhido) {
    respondido = true;

    if (exercicio.tipo === "palavra") {
        for (const kana of semRepetir(exercicio.palavra.kanas)) {
            const caractere = porKana(kana);

            if (caractere !== null) {
                anotar(caractere.id, "ler", acertou, PESO_PALAVRA);
            }
        }
    } else if (usaFita()) {
        for (let i = 0; i < exercicio.sequencia.length; i++) {
            const item = exercicio.sequencia[i];

            if (item.fixo === true) {
                continue;
            }

            anotar(item.id, exercicio.direcao, !errosNaFita[i], exercicio.peso);
        }
    } else {
        anotar(exercicio.correto.id, exercicio.direcao, acertou, exercicio.peso);
    }

    lembrarDoRecente(exercicio.correto.id);
    lembrarDoResultado(acertou);
    anotarNoHistorico(acertou, formatoDe(exercicio));

    if (!acertou && escolhido) {
        anotarConfusao(exercicio.correto.id, escolhido.id);
    }

    total = total + 1;

    if (acertou) {
        acertos = acertos + 1;
    }

    if (sessao !== null) {
        sessao.feitas = sessao.feitas + 1;

        if (acertou) {
            sessao.acertos = sessao.acertos + 1;
        } else {
            const id = exercicio.correto.id;
            sessao.piores[id] = (sessao.piores[id] || 0) + 1;
        }
    }

    areaPlacar.textContent = acertos + " de " + total;
    mostrarBarraDaSessao();

    const textoFalado = textoParaFalar();

    marcarPalco(acertou ? "acertou" : "errou");
    arrumarVerificar();

    if (acertou) {
        areaResposta.textContent = "Isso!";
        setTimeout(() => falar(textoFalado), 120);
        temporizador = setTimeout(proximo, temVoz() ? PAUSA_ACERTO_COM_SOM : PAUSA_ACERTO);
    } else {
        const certa = respostaCerta();

        if (exercicio.direcao !== "desenhar") {
            areaResposta.textContent = certa;
        }

        setTimeout(() => falar(textoFalado), 250);

        const dica = escolhido ? dicaPara(exercicio.correto.kana, escolhido.kana) : null;

        if (dica !== null) {
            areaResposta.textContent = areaResposta.textContent + "\n" + dica;
        }

        areaResposta.textContent = areaResposta.textContent + "\n\nToque na tela ou aperte Enter para continuar";

        setTimeout(() => {
            document.addEventListener("click", proximo, { once: true });
        }, 0);
    }

    mostrarPainel();
}

document.addEventListener("keydown", (evento) => {
    if (exercicio === null || !emSessao()) {
        return;
    }

    if (exercicio.tipo === "apresentacao") {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            concluirApresentacao();
        }

        return;
    }

    const naFita = usaFita() && !respondido;

    if (naFita && evento.key === " ") {
        evento.preventDefault();
        pularNaFita();
        return;
    }

    if (evento.key !== "Enter") {
        return;
    }

    evento.preventDefault();

    if (respondido) {
        proximo();
    } else if (!naFita) {
        responderDigitado();
    }
});

// ===== INÍCIO =====

escolherVoz();
window.speechSynthesis.onvoiceschanged = escolherVoz;

document.addEventListener("click", function () {
    falar(" ");
}, { once: true });

carregar();
carregarPreferencia();
montarControlesDoFoco();
mostrarTextos();
mostrarBackup();
mostrarTela("aprender");

setInterval(mostrarPainel, 10000);

// no modo tempo o contador anda sozinho, mesmo sem ninguém responder
setInterval(function () {
    if (emSessao() && sessao.modo === "tempo") {
        mostrarBarraDaSessao();
    }
}, 1000);
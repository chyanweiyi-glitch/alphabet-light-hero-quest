const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ui = {
  levelLabel: document.getElementById("levelLabel"),
  playerHp: document.getElementById("playerHp"),
  monsterHp: document.getElementById("monsterHp"),
  timerLabel: document.getElementById("timerLabel"),
  promptMeta: document.getElementById("promptMeta"),
  spellText: document.getElementById("spellText"),
  translationText: document.getElementById("translationText"),
  kkText: document.getElementById("kkText"),
  heardText: document.getElementById("heardText"),
  refreshWordButton: document.getElementById("refreshWordButton"),
  answerForm: document.getElementById("answerForm"),
  answerInput: document.getElementById("answerInput"),
  choicePanel: document.getElementById("choicePanel"),
  choiceSummary: document.getElementById("choiceSummary"),
  startButton: document.getElementById("startButton"),
  micButton: document.getElementById("micButton"),
  musicButton: document.getElementById("musicButton"),
  musicVolume: document.getElementById("musicVolume"),
  sfxVolume: document.getElementById("sfxVolume"),
  restartButton: document.getElementById("restartButton"),
  phaseLabel: document.getElementById("phaseLabel"),
  progressGrid: document.getElementById("progressGrid"),
  logBox: document.getElementById("logBox"),
  resultOverlay: document.getElementById("resultOverlay"),
  resultTitle: document.getElementById("resultTitle"),
  resultSubtitle: document.getElementById("resultSubtitle"),
};

const REPEAT_SECONDS = 6;
const MAX_SMALL_CASTS_PER_LEVEL = 4;
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const wordBank = {
  A: ["animal", "answer", "around", "after", "again"],
  B: ["basket", "better", "between", "brother", "because"],
  C: ["circle", "corner", "classroom", "careful", "country"],
  D: ["doctor", "dragon", "dinner", "different", "dream"],
  E: ["english", "evening", "example", "excited", "enough"],
  F: ["family", "favorite", "forest", "friend", "future"],
  G: ["garden", "gentle", "guitar", "glasses", "ground"],
  H: ["happy", "holiday", "homework", "hundred", "healthy"],
  I: ["inside", "invite", "important", "interesting", "internet"],
  J: ["jungle", "journey", "january", "jellyfish", "joyful"],
  K: ["kitchen", "kindness", "kingdom", "keyboard", "knock"],
  L: ["lesson", "library", "listen", "little", "language"],
  M: ["market", "morning", "mountain", "message", "minute"],
  N: ["nature", "number", "noodle", "notebook", "neighbor"],
  O: ["office", "outside", "october", "opposite", "order"],
  P: ["parent", "picture", "practice", "present", "problem"],
  Q: ["question", "quickly", "quarter", "quality", "quietly"],
  R: ["reader", "remember", "rainbow", "restaurant", "rocket"],
  S: ["season", "sentence", "shoulder", "special", "student"],
  T: ["teacher", "tomorrow", "together", "traffic", "trouble"],
  U: ["usually", "uniform", "useful", "upstairs", "understand"],
  V: ["vacation", "vegetable", "village", "visitor", "victory"],
  W: ["weather", "weekend", "welcome", "without", "wonderful"],
  X: ["x-ray", "xylophone", "x-axis", "xenon", "xerox"],
  Y: ["yesterday", "yourself", "younger", "yearbook", "yogurt"],
  Z: ["zebra", "zero", "zipper", "zigzag", "zookeeper"],
};

const preschoolWordBank = {
  A: ["apple", "ant", "air", "axe", "alligator"],
  B: ["book", "ball", "bird", "banana", "bee"],
  C: ["cat", "cake", "cloud", "car", "cow"],
  D: ["dog", "door", "duck", "desk", "doll"],
  E: ["egg", "elf", "earth", "eight", "elephant"],
  F: ["fish", "fire", "frog", "fan", "fox"],
  G: ["goat", "gift", "green", "grape", "girl"],
  H: ["hat", "hand", "hero", "horse", "house"],
  I: ["ice", "ink", "igloo", "insect", "island"],
  J: ["jam", "jet", "jump", "juice", "jacket"],
  K: ["kite", "king", "key", "kid", "kangaroo"],
  L: ["lion", "lamp", "leaf", "lemon", "lake"],
  M: ["moon", "milk", "magic", "monkey", "map"],
  N: ["nest", "nose", "night", "net", "nurse"],
  O: ["owl", "orange", "open", "ocean", "octopus"],
  P: ["pig", "pen", "panda", "pizza", "pencil"],
  Q: ["queen", "quiz", "quick", "quiet", "quilt"],
  R: ["rain", "robot", "river", "rabbit", "rose"],
  S: ["sun", "star", "snake", "school", "sock"],
  T: ["tree", "tiger", "toy", "table", "train"],
  U: ["umbrella", "up", "unicorn", "uncle", "under"],
  V: ["van", "violin", "voice", "vest", "vase"],
  W: ["water", "wolf", "wind", "window", "watch"],
  X: ["box", "fox", "six", "x-ray", "xylophone"],
  Y: ["yellow", "yarn", "yo-yo", "yard", "yummy"],
  Z: ["zebra", "zero", "zoo", "zipper", "zigzag"],
};

const difficultyLabels = {
  preschool: "幼兒程度",
  elementary: "國小程度",
};

const wordBanks = {
  preschool: preschoolWordBank,
  elementary: wordBank,
};

const zhByWord = {
  air: "空氣",
  alligator: "短吻鱷",
  ant: "螞蟻",
  apple: "蘋果",
  axe: "斧頭",
  ball: "球",
  banana: "香蕉",
  bee: "蜜蜂",
  bird: "鳥",
  book: "書",
  box: "盒子",
  cake: "蛋糕",
  car: "車子",
  cat: "貓",
  cloud: "雲",
  cow: "牛",
  desk: "書桌",
  dog: "狗",
  doll: "娃娃",
  door: "門",
  duck: "鴨子",
  earth: "地球",
  egg: "蛋",
  eight: "八",
  elephant: "大象",
  elf: "小精靈",
  fan: "風扇",
  fire: "火",
  fish: "魚",
  flower: "花",
  fox: "狐狸",
  frog: "青蛙",
  gift: "禮物",
  girl: "女孩",
  goat: "山羊",
  grape: "葡萄",
  green: "綠色",
  hand: "手",
  hat: "帽子",
  hero: "英雄",
  horse: "馬",
  house: "房子",
  ice: "冰",
  igloo: "冰屋",
  ink: "墨水",
  insect: "昆蟲",
  island: "島",
  jacket: "外套",
  jam: "果醬",
  jet: "噴射機",
  juice: "果汁",
  jump: "跳",
  kangaroo: "袋鼠",
  key: "鑰匙",
  kid: "小孩",
  king: "國王",
  kite: "風箏",
  lake: "湖",
  lamp: "檯燈",
  leaf: "葉子",
  lemon: "檸檬",
  lion: "獅子",
  magic: "魔法",
  map: "地圖",
  milk: "牛奶",
  monkey: "猴子",
  moon: "月亮",
  nest: "鳥巢",
  net: "網子",
  night: "夜晚",
  nose: "鼻子",
  nurse: "護士",
  ocean: "海洋",
  octopus: "章魚",
  open: "打開",
  orange: "橘子",
  owl: "貓頭鷹",
  panda: "熊貓",
  pen: "筆",
  pencil: "鉛筆",
  pig: "豬",
  pizza: "披薩",
  queen: "女王",
  quick: "快速的",
  quiet: "安靜的",
  quilt: "棉被",
  quiz: "小測驗",
  rabbit: "兔子",
  rain: "雨",
  river: "河流",
  robot: "機器人",
  rose: "玫瑰",
  school: "學校",
  six: "六",
  snake: "蛇",
  sock: "襪子",
  star: "星星",
  sun: "太陽",
  table: "桌子",
  tiger: "老虎",
  toy: "玩具",
  train: "火車",
  tree: "樹",
  umbrella: "雨傘",
  uncle: "叔叔",
  under: "下面",
  unicorn: "獨角獸",
  up: "上面",
  van: "廂型車",
  vase: "花瓶",
  vest: "背心",
  violin: "小提琴",
  voice: "聲音",
  watch: "手錶",
  water: "水",
  wind: "風",
  window: "窗戶",
  wolf: "狼",
  "x-ray": "X 光",
  xylophone: "木琴",
  yard: "院子",
  yarn: "毛線",
  yellow: "黃色",
  yoyo: "溜溜球",
  "yo-yo": "溜溜球",
  yummy: "好吃的",
  zebra: "斑馬",
  zero: "零",
  zigzag: "鋸齒形",
  zipper: "拉鍊",
  zoo: "動物園",
};

Object.assign(zhByWord, {
  after: "在...之後",
  again: "再一次",
  animal: "動物",
  answer: "答案",
  around: "周圍",
  basket: "籃子",
  because: "因為",
  better: "更好的",
  between: "在...之間",
  brother: "兄弟",
  careful: "小心的",
  circle: "圓形",
  classroom: "教室",
  corner: "角落",
  country: "國家",
  different: "不同的",
  dinner: "晚餐",
  doctor: "醫生",
  dragon: "龍",
  dream: "夢想",
  english: "英文",
  enough: "足夠的",
  evening: "傍晚",
  example: "例子",
  excited: "興奮的",
  family: "家人",
  favorite: "最喜歡的",
  forest: "森林",
  friend: "朋友",
  future: "未來",
  garden: "花園",
  gentle: "溫柔的",
  glasses: "眼鏡",
  ground: "地面",
  guitar: "吉他",
  happy: "快樂的",
  healthy: "健康的",
  holiday: "假日",
  homework: "作業",
  hundred: "一百",
  important: "重要的",
  inside: "裡面",
  interesting: "有趣的",
  internet: "網路",
  invite: "邀請",
  january: "一月",
  jellyfish: "水母",
  joyful: "喜悅的",
  journey: "旅程",
  jungle: "叢林",
  keyboard: "鍵盤",
  kindness: "善良",
  kingdom: "王國",
  kitchen: "廚房",
  knock: "敲門",
  language: "語言",
  lesson: "課程",
  library: "圖書館",
  listen: "聽",
  little: "小的",
  market: "市場",
  message: "訊息",
  minute: "分鐘",
  morning: "早晨",
  mountain: "山",
  nature: "自然",
  neighbor: "鄰居",
  noodle: "麵條",
  notebook: "筆記本",
  number: "數字",
  october: "十月",
  office: "辦公室",
  opposite: "相反的",
  order: "順序",
  outside: "外面",
  parent: "父母",
  picture: "圖片",
  practice: "練習",
  present: "禮物",
  problem: "問題",
  quality: "品質",
  quarter: "四分之一",
  question: "問題",
  quickly: "快速地",
  quietly: "安靜地",
  rainbow: "彩虹",
  reader: "讀者",
  remember: "記得",
  restaurant: "餐廳",
  rocket: "火箭",
  season: "季節",
  sentence: "句子",
  shoulder: "肩膀",
  special: "特別的",
  student: "學生",
  teacher: "老師",
  together: "一起",
  tomorrow: "明天",
  traffic: "交通",
  trouble: "麻煩",
  understand: "了解",
  uniform: "制服",
  upstairs: "樓上",
  useful: "有用的",
  usually: "通常",
  vacation: "假期",
  vegetable: "蔬菜",
  victory: "勝利",
  village: "村莊",
  visitor: "訪客",
  weather: "天氣",
  weekend: "週末",
  welcome: "歡迎",
  without: "沒有",
  wonderful: "美好的",
  "x-axis": "X 軸",
  xenon: "氙",
  xerox: "影印",
  yearbook: "年鑑",
  yesterday: "昨天",
  yogurt: "優格",
  younger: "較年輕的",
  yourself: "你自己",
  zookeeper: "動物園管理員",
});

const kkByWord = {
  air: "ɛr",
  alligator: "ˋæləˌgetɚ",
  ant: "ænt",
  apple: "ˋæpḷ",
  axe: "æks",
  ball: "bɔl",
  banana: "bəˋnænə",
  bee: "bi",
  bird: "bɝd",
  book: "bʊk",
  box: "bɑks",
  cake: "kek",
  car: "kɑr",
  cat: "kæt",
  cloud: "klaʊd",
  cow: "kaʊ",
  desk: "dɛsk",
  dog: "dɔg",
  doll: "dɑl",
  door: "dɔr",
  duck: "dʌk",
  earth: "ɝθ",
  egg: "ɛg",
  eight: "et",
  elephant: "ˋɛləfənt",
  elf: "ɛlf",
  fan: "fæn",
  fire: "faɪr",
  fish: "fɪʃ",
  flower: "ˋflaʊɚ",
  fox: "fɑks",
  frog: "frɑg",
  gift: "gɪft",
  girl: "gɝl",
  goat: "got",
  grape: "grep",
  green: "grin",
  hand: "hænd",
  hat: "hæt",
  hero: "ˋhɪro",
  horse: "hɔrs",
  house: "haʊs",
  ice: "aɪs",
  igloo: "ˋɪglu",
  ink: "ɪŋk",
  insect: "ˋɪnˌsɛkt",
  island: "ˋaɪlənd",
  jacket: "ˋdʒækɪt",
  jam: "dʒæm",
  jet: "dʒɛt",
  juice: "dʒus",
  jump: "dʒʌmp",
  kangaroo: "ˌkæŋgəˋru",
  key: "ki",
  kid: "kɪd",
  king: "kɪŋ",
  kite: "kaɪt",
  lake: "lek",
  lamp: "læmp",
  leaf: "lif",
  lemon: "ˋlɛmən",
  lion: "ˋlaɪən",
  magic: "ˋmædʒɪk",
  map: "mæp",
  milk: "mɪlk",
  monkey: "ˋmʌŋki",
  moon: "mun",
  nest: "nɛst",
  net: "nɛt",
  night: "naɪt",
  nose: "noz",
  nurse: "nɝs",
  ocean: "ˋoʃən",
  octopus: "ˋɑktəpəs",
  open: "ˋopən",
  orange: "ˋɔrɪndʒ",
  owl: "aʊl",
  panda: "ˋpændə",
  pen: "pɛn",
  pencil: "ˋpɛnsḷ",
  pig: "pɪg",
  pizza: "ˋpitsə",
  queen: "kwin",
  quick: "kwɪk",
  quiet: "ˋkwaɪət",
  quilt: "kwɪlt",
  quiz: "kwɪz",
  rabbit: "ˋræbɪt",
  rain: "ren",
  river: "ˋrɪvɚ",
  robot: "ˋrobɑt",
  rose: "roz",
  school: "skul",
  six: "sɪks",
  snake: "snek",
  sock: "sɑk",
  star: "stɑr",
  sun: "sʌn",
  table: "ˋtebḷ",
  tiger: "ˋtaɪgɚ",
  toy: "tɔɪ",
  train: "tren",
  tree: "tri",
  umbrella: "ʌmˋbrɛlə",
  uncle: "ˋʌŋkḷ",
  under: "ˋʌndɚ",
  unicorn: "ˋjunɪˌkɔrn",
  up: "ʌp",
  van: "væn",
  vase: "ves",
  vest: "vɛst",
  violin: "ˌvaɪəˋlɪn",
  voice: "vɔɪs",
  watch: "wɑtʃ",
  water: "ˋwɔtɚ",
  wind: "wɪnd",
  window: "ˋwɪndo",
  wolf: "wʊlf",
  xray: "ˋɛksˌre",
  xylophone: "ˋzaɪləˌfon",
  yard: "jɑrd",
  yarn: "jɑrn",
  yellow: "ˋjɛlo",
  yummy: "ˋjʌmi",
  yoyo: "ˋjoˌjo",
  zebra: "ˋzibrə",
  zero: "ˋzɪro",
  zigzag: "ˋzɪgˌzæg",
  zipper: "ˋzɪpɚ",
  zoo: "zu",
};

const wordAliases = {
  air: ["heir", "err"],
  ant: ["and", "aunt"],
  ball: ["bowl"],
  bird: ["burd"],
  book: ["buck"],
  cake: ["kick"],
  cat: ["cap"],
  cloud: ["clout"],
  dog: ["dock"],
  door: ["dore"],
  duck: ["dock"],
  earth: ["urf"],
  egg: ["ag"],
  fire: ["far"],
  fish: ["fiss"],
  goat: ["go"],
  green: ["clean"],
  hand: ["hen"],
  hero: ["hiro"],
  ice: ["eyes"],
  igloo: ["iglu"],
  jam: ["gem"],
  jet: ["jed"],
  key: ["kee"],
  kite: ["kind"],
  leaf: ["leave"],
  lion: ["line"],
  magic: ["majik"],
  moon: ["mun"],
  night: ["nite"],
  nose: ["knows"],
  orange: ["ornge"],
  owl: ["ow"],
  panda: ["pander"],
  queen: ["clean"],
  quick: ["kwik"],
  rain: ["reign", "ren"],
  robot: ["rowbot"],
  snake: ["sneak"],
  star: ["start"],
  tiger: ["tigar"],
  tree: ["three"],
  umbrella: ["ambrella"],
  unicorn: ["uniform"],
  van: ["fan"],
  violin: ["vialin"],
  water: ["wader"],
  wolf: ["woof"],
  yellow: ["yello"],
  yoyo: ["yo yo", "yo-yo"],
  zebra: ["zibra"],
  zero: ["ziro"],
};

const state = {
  started: false,
  hero: "nova",
  selectedHero: "nova",
  selectedLevel: 0,
  difficulty: "preschool",
  level: 0,
  playerHp: 100,
  monsterHp: 100,
  phase: "idle",
  challenge: null,
  timeLeft: REPEAT_SECONDS,
  nextPhaseAt: 0,
  speakToken: 0,
  projectiles: [],
  particles: [],
  rings: [],
  floatingTexts: [],
  screenFlashes: [],
  shakes: 0,
  heroHit: 0,
  monsterHit: 0,
  heroCast: 0,
  monsterCast: 0,
  heroAction: "idle",
  monsterAction: "idle",
  heroActionTime: 0,
  monsterActionTime: 0,
  resultMode: null,
  lastTime: performance.now(),
  musicOn: false,
  recognitionOn: false,
  recognitionListening: false,
  recognitionStarting: false,
  micPermissionGranted: false,
  musicVolume: 0.45,
  sfxVolume: 0.7,
  smallCastsByLevel: {},
  recentWordsByLevel: {},
  completed: new Set(),
};

let audio = null;
let recognition = null;
let restartRecognitionTimer = null;
let currentRecorder = null;
let currentRecorderStream = null;
let recorderChunks = [];
let recorderTimer = null;
let submitRecording = false;
let activeRecorderMimeType = "";

const heroConfigs = {
  nova: { name: "紅銀戰士", primary: "#e64242", secondary: "#f3f7ff", gem: "#5ee7d4", beam: "#7dfcff", pose: "beam" },
  aqua: { name: "藍銀戰士", primary: "#2878ff", secondary: "#edf7ff", gem: "#fff06a", beam: "#8fb8ff", pose: "shield" },
  solar: { name: "金紅戰士", primary: "#f0b52d", secondary: "#fff3dd", gem: "#ff6f9e", beam: "#fff06a", pose: "kick" },
};

const scenePalettes = [
  { sky: "#73c8ff", far: "#9ee4d6", ground: "#5fbb78", accent: "#fff06a", type: "city" },
  { sky: "#26446f", far: "#5b7bc6", ground: "#4d5674", accent: "#8fb8ff", type: "space" },
  { sky: "#ffb36d", far: "#ffd28f", ground: "#b66d49", accent: "#ff6f9e", type: "desert" },
  { sky: "#88d2ea", far: "#9ccf9a", ground: "#4e9c66", accent: "#5ee7d4", type: "forest" },
  { sky: "#9d8cff", far: "#c1b7ff", ground: "#6b63a7", accent: "#fff2a6", type: "crystal" },
  { sky: "#5b8fd6", far: "#d4f1ff", ground: "#7aa8bd", accent: "#ffffff", type: "ice" },
];

const monsterPalettes = ["#7a4bd6", "#d45c5c", "#4aa36b", "#e08a35", "#3d8fb8", "#8c5a3c", "#b94886", "#607050"];
const spriteImages = {
  heroes: loadImage("assets/generated/heroes.png"),
  heroActions: {
    nova: loadImage("assets/generated/hero-nova-actions.png"),
    aqua: loadImage("assets/generated/hero-aqua-actions.png"),
    solar: loadImage("assets/generated/hero-solar-actions.png"),
  },
  kaiju: loadImage("assets/generated/kaiju-sheet.png"),
  kaijuActions: {
    0: loadImage("assets/generated/kaiju-purple-actions.png"),
    1: loadImage("assets/generated/kaiju-red-actions.png"),
    2: loadImage("assets/generated/kaiju-green-actions.png"),
    3: loadImage("assets/generated/kaiju-orange-actions.png"),
  },
  backgrounds: {
    0: loadImage("assets/generated/backgrounds/level-01.png"),
  },
};

const spokenLetterMap = {
  a: "a",
  ay: "a",
  hey: "a",
  bee: "b",
  be: "b",
  b: "b",
  sea: "c",
  see: "c",
  c: "c",
  dee: "d",
  d: "d",
  e: "e",
  ee: "e",
  eff: "f",
  f: "f",
  gee: "g",
  g: "g",
  h: "h",
  ache: "h",
  aitch: "h",
  i: "i",
  eye: "i",
  j: "j",
  jay: "j",
  k: "k",
  kay: "k",
  l: "l",
  ell: "l",
  m: "m",
  em: "m",
  n: "n",
  en: "n",
  o: "o",
  oh: "o",
  p: "p",
  pee: "p",
  q: "q",
  cue: "q",
  queue: "q",
  r: "r",
  are: "r",
  s: "s",
  ess: "s",
  t: "t",
  tea: "t",
  tee: "t",
  u: "u",
  you: "u",
  v: "v",
  vee: "v",
  w: "w",
  doubleyou: "w",
  doubleu: "w",
  x: "x",
  ex: "x",
  y: "y",
  why: "y",
  z: "z",
  zee: "z",
  zed: "z",
};

function loadImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

function initProgress() {
  ui.progressGrid.innerHTML = "";
  alphabet.forEach((letter, index) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "letter-tile";
    tile.textContent = letter;
    tile.dataset.letter = letter;
    tile.dataset.level = String(index);
    tile.addEventListener("click", () => selectLevel(index));
    ui.progressGrid.append(tile);
  });
}

function chooseRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function currentLetter() {
  return alphabet[state.level];
}

function currentWordBank() {
  return wordBanks[state.difficulty] || wordBanks.preschool;
}

function wordsForLetter(letter = currentLetter()) {
  return currentWordBank()[letter] || wordBank[letter] || [];
}

function currentWord(excludeWord = "") {
  const letter = currentLetter();
  const words = wordsForLetter(letter);
  const recentKey = `${state.difficulty}:${letter}`;
  const recent = state.recentWordsByLevel[recentKey] || [];
  let candidates = words.filter((word) => wordKey(word) !== wordKey(excludeWord) && !recent.includes(wordKey(word)));
  if (!candidates.length) {
    state.recentWordsByLevel[recentKey] = excludeWord ? [wordKey(excludeWord)] : [];
    candidates = words.filter((word) => wordKey(word) !== wordKey(excludeWord));
  }
  const word = chooseRandom(candidates.length ? candidates : words);
  const nextRecent = [...(state.recentWordsByLevel[recentKey] || []), wordKey(word)].slice(-Math.max(1, words.length - 1));
  state.recentWordsByLevel[recentKey] = nextRecent;
  return word;
}

function normalizeAnswer(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .trim();
}

function wordKey(value) {
  return normalizeAnswer(value);
}

function getKk(text) {
  return kkByWord[wordKey(text)] || "";
}

function getTranslation(text) {
  const key = text.length === 1 ? text.toUpperCase() : wordKey(text);
  if (text.length === 1) return `${key} 的字母音`;
  return zhByWord[text.toLowerCase()] || zhByWord[key] || "";
}

function normalizeForChallenge(value, challenge) {
  const normalized = normalizeAnswer(value);
  if (!challenge || challenge.answer.length !== 1) return normalized;
  return spokenLetterMap[normalized] || normalized;
}

function levenshtein(a, b) {
  const rows = Array.from({ length: a.length + 1 }, (_, index) => [index]);
  for (let j = 1; j <= b.length; j += 1) rows[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return rows[a.length][b.length];
}

function isAnswerAccepted(value, challenge) {
  const spokenValues = Array.isArray(value) ? value : [value];
  const normalizedValues = spokenValues.map((item) => normalizeForChallenge(item, challenge)).filter(Boolean);
  const answer = challenge.answer;
  if (answer.length === 1) {
    return {
      success: normalizedValues.some((item) => item === answer || item[0] === answer),
      heard: normalizedValues[0] || "",
    };
  }

  const aliases = (wordAliases[wordKey(challenge.text)] || []).map(normalizeAnswer);
  const success = normalizedValues.some((item) => {
    if (item === answer) return true;
    if (aliases.includes(item)) return true;
    if (item.length >= 3 && (item.includes(answer) || answer.includes(item))) return true;
    const distance = levenshtein(item, answer);
    const tolerance = Math.max(1, Math.floor(answer.length * 0.34));
    if (distance <= tolerance) return true;
    const similarity = 1 - distance / Math.max(item.length, answer.length);
    return item[0] === answer[0] && similarity >= 0.56;
  });
  return { success, heard: normalizedValues[0] || "" };
}

function createChallenge(owner) {
  const letter = currentLetter();
  const smallCount = state.smallCastsByLevel[letter] || 0;
  const isBig = smallCount >= MAX_SMALL_CASTS_PER_LEVEL ? true : Math.random() < 0.42;
  const text = isBig ? currentWord() : letter;
  if (!isBig) state.smallCastsByLevel[letter] = smallCount + 1;
  return makeChallenge(owner, isBig ? "big" : "small", text);
}

function makeChallenge(owner, kind, text) {
  return {
    owner,
    kind,
    text,
    answer: normalizeAnswer(text),
    kk: kind === "big" ? getKk(text) : "",
    translation: getTranslation(text),
  };
}

function pronounceText(challenge) {
  return challenge.answer.length === 1 ? challenge.text.toUpperCase() : challenge.text.toLowerCase();
}

function cancelSpeech() {
  state.speakToken += 1;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function speakOnce(text, token) {
  return new Promise((resolve) => {
    if (token !== state.speakToken) return resolve();
    const encoded = encodeURIComponent(text);
    const sound = new Audio(`/api/speech?text=${encoded}`);
    sound.playbackRate = text.length === 1 ? 0.82 : 0.92;
    sound.onended = resolve;
    sound.onerror = () => fallbackSpeech(text, token).then(resolve);
    sound.play().catch(() => fallbackSpeech(text, token).then(resolve));
    setTimeout(resolve, 2600);
  });
}

function fallbackSpeech(text, token) {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window) || token !== state.speakToken) return resolve();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = text.length === 1 ? 0.62 : 0.74;
    utterance.pitch = 1.04;
    utterance.volume = 1;
    utterance.onend = resolve;
    utterance.onerror = resolve;
    window.speechSynthesis.speak(utterance);
    setTimeout(resolve, 1800);
  });
}

async function speakChallengeThenRepeat(challenge) {
  const token = state.speakToken + 1;
  state.speakToken = token;
  stopRecognition();
  const spoken = pronounceText(challenge);
  for (let i = 1; i <= 3; i += 1) {
    if (!state.started || state.challenge !== challenge || token !== state.speakToken) return;
    ui.heardText.textContent = `範讀第 ${i} 次：${spoken}`;
    castBurst(challenge.owner === "player" ? 330 : 900, challenge.owner === "player" ? 430 : 360, challenge.kind);
    await speakOnce(spoken, token);
    await new Promise((resolve) => setTimeout(resolve, 330));
  }
  if (!state.started || state.challenge !== challenge || token !== state.speakToken) return;
  beginRepeatWindow(challenge);
}

function beginRepeatWindow(challenge) {
  state.phase = challenge.owner === "player" ? "player" : "monster";
  state.timeLeft = REPEAT_SECONDS;
  updatePromptForChallenge(challenge, "repeat");
  ui.heardText.textContent = `請在 ${REPEAT_SECONDS} 秒內複誦`;
  ui.phaseLabel.textContent = challenge.owner === "player" ? "複誦攻擊" : "複誦防禦";
  ui.answerInput.value = "";
  ui.answerInput.focus();
  if (challenge.owner === "monster") {
    removeMonsterProjectile();
    setActorAction("monster", "attack", 1.1);
    spawnProjectile("monster", challenge);
  }
  startRecognition();
}

function updateChoiceSummary() {
  const heroName = heroConfigs[state.selectedHero]?.name || heroConfigs.nova.name;
  ui.choiceSummary.textContent = `目前：${heroName} / ${alphabet[state.selectedLevel]} 關 / ${difficultyLabels[state.difficulty]}`;
}

function selectDifficulty(difficulty) {
  if (state.started) {
    log("請先按重新開始，再切換單字程度。");
    return;
  }
  state.difficulty = wordBanks[difficulty] ? difficulty : "preschool";
  state.recentWordsByLevel = {};
  document.querySelectorAll(".difficulty-choice").forEach((button) => {
    button.classList.toggle("selected", button.dataset.difficulty === state.difficulty);
  });
  if (!state.started) {
    showSelectedLevelPreview();
  }
  updateChoiceSummary();
}

function selectHero(hero) {
  state.selectedHero = hero;
  state.hero = hero;
  setActorAction("hero", "idle");
  document.querySelectorAll(".character-choice").forEach((button) => {
    button.classList.toggle("selected", button.dataset.hero === hero);
  });
  updateChoiceSummary();
}

function selectLevel(level) {
  const nextLevel = Math.max(0, Math.min(alphabet.length - 1, level));
  if (state.started) {
    log("請先按重新開始，再選擇其他關卡。");
    return;
  }
  state.selectedLevel = nextLevel;
  state.level = nextLevel;
  state.monsterHp = 100;
  state.smallCastsByLevel = {};
  showSelectedLevelPreview();
  ui.phaseLabel.textContent = "等待開始";
  updateChoiceSummary();
  updateHud();
}

function showSelectedLevelPreview() {
  const letter = alphabet[state.selectedLevel];
  ui.spellText.textContent = letter;
  ui.translationText.textContent = getTranslation(letter);
  ui.kkText.textContent = "";
  ui.promptMeta.textContent = `已選擇 ${letter} 關：${difficultyLabels[state.difficulty]}`;
  ui.heardText.textContent = "可先選關卡、程度，按開始後挑戰";
}

function updatePromptForChallenge(challenge, mode = "demo") {
  const isPlayer = challenge.owner === "player";
  if (mode === "repeat") {
    ui.promptMeta.textContent = isPlayer
      ? (challenge.kind === "big" ? "複誦成功即可發射十字光線" : "複誦成功即可發出光刃")
      : (challenge.kind === "big" ? "複誦成功即可張開光盾" : "複誦成功即可格擋怪獸衝擊");
  } else {
    ui.promptMeta.textContent = isPlayer
      ? (challenge.kind === "big" ? "聽範讀：光線大招單字" : "聽範讀：光刃小招字母")
      : (challenge.kind === "big" ? "聽範讀：怪獸光波單字" : "聽範讀：怪獸衝擊字母");
  }
  ui.spellText.textContent = challenge.text;
  ui.translationText.textContent = challenge.translation;
  ui.kkText.textContent = challenge.kk ? `KK [${challenge.kk}]` : "";
}

function refreshCurrentWord() {
  if (!state.started) {
    const word = currentWord(ui.spellText.textContent);
    ui.spellText.textContent = word;
    ui.translationText.textContent = getTranslation(word);
    ui.kkText.textContent = getKk(word) ? `KK [${getKk(word)}]` : "";
    ui.promptMeta.textContent = `預覽 ${alphabet[state.selectedLevel]} 關單字：${difficultyLabels[state.difficulty]}`;
    ui.heardText.textContent = "按開始後會正式出題";
    return;
  }
  if (!state.challenge || state.phase === "checking" || state.resultMode) return;
  const owner = state.challenge.owner;
  const word = currentWord(state.challenge.kind === "big" ? state.challenge.text : "");
  const challenge = makeChallenge(owner, "big", word);
  state.challenge = challenge;
  state.phase = "demo";
  state.timeLeft = REPEAT_SECONDS;
  stopRecognition();
  cancelSpeech();
  updatePromptForChallenge(challenge, "demo");
  ui.heardText.textContent = "已刷新單字，重新範讀 3 次";
  ui.phaseLabel.textContent = "範讀中";
  speakChallengeThenRepeat(challenge);
}

async function startSelectedGame() {
  await startGame(state.selectedHero, state.selectedLevel);
}

async function startGame(hero = state.selectedHero, level = state.selectedLevel) {
  state.started = true;
  state.hero = hero;
  state.selectedHero = hero;
  state.selectedLevel = level;
  state.level = level;
  state.playerHp = 100;
  state.monsterHp = 100;
  state.phase = "idle";
  state.speakToken += 1;
  state.completed.clear();
  state.smallCastsByLevel = {};
  state.recentWordsByLevel = {};
  state.projectiles = [];
  state.particles = [];
  state.rings = [];
  state.floatingTexts = [];
  state.screenFlashes = [];
  state.resultMode = null;
  ui.resultOverlay.hidden = true;
  ui.choicePanel.hidden = true;
  document.body.classList.add("game-running");
  log(`冒險開始！挑戰 ${currentLetter()} 關。`);
  updateHud();
  await enableVoiceForGame();
  beginPlayerTurn();
  startMusic();
}

async function enableVoiceForGame() {
  if (state.recognitionOn) return;
  if (window.location.protocol === "file:" || !window.isSecureContext) {
    ui.micButton.textContent = "語音需 HTTPS";
    ui.heardText.textContent = "手機語音請使用 Netlify 的 https 網址；目前可用鍵盤輸入測試";
    return;
  }
  state.recognitionOn = true;
  ui.micButton.textContent = "要求權限中";
  const permitted = await requestMicPermission();
  if (!permitted) {
    state.recognitionOn = false;
    ui.micButton.textContent = "開始語音";
    ui.heardText.textContent = "麥克風未開啟，可先用鍵盤輸入答案";
    return;
  }
  ui.micButton.textContent = "語音已開啟";
  ui.heardText.textContent = "語音已開啟，請聽完範讀後複誦";
}

function restartGame() {
  stopRecognition();
  cancelSpeech();
  ui.choicePanel.hidden = false;
  document.body.classList.remove("game-running");
  ui.resultOverlay.hidden = true;
  ui.resultOverlay.classList.remove("lose");
  state.started = false;
  state.phase = "idle";
  state.challenge = null;
  state.timeLeft = REPEAT_SECONDS;
  state.playerHp = 100;
  state.monsterHp = 100;
  state.level = state.selectedLevel;
  state.completed.clear();
  state.smallCastsByLevel = {};
  state.projectiles = [];
  state.particles = [];
  state.rings = [];
  state.floatingTexts = [];
  state.screenFlashes = [];
  state.resultMode = null;
  state.speakToken += 1;
  ui.promptMeta.textContent = "選擇光之戰士開始冒險";
  ui.spellText.textContent = currentLetter();
  ui.translationText.textContent = getTranslation(currentLetter());
  ui.kkText.textContent = "";
  ui.heardText.textContent = "請允許麥克風，或用鍵盤輸入答案";
  ui.phaseLabel.textContent = "等待開始";
  updateChoiceSummary();
  updateHud();
}

function beginPlayerTurn() {
  if (!state.started) return;
  setActorAction("hero", "idle");
  setActorAction("monster", "idle");
  state.phase = "demo";
  state.challenge = createChallenge("player");
  state.timeLeft = REPEAT_SECONDS;
  updatePromptForChallenge(state.challenge, "demo");
  ui.heardText.textContent = "電腦會先念 3 次，請仔細聽";
  ui.phaseLabel.textContent = "範讀中";
  ui.answerInput.value = "";
  ui.answerInput.focus();
  playTone(720, 0.08, "triangle", 0.04);
  speakChallengeThenRepeat(state.challenge);
}

function beginMonsterTurn() {
  if (!state.started) return;
  setActorAction("hero", "idle");
  setActorAction("monster", "idle");
  state.phase = "demo";
  state.challenge = createChallenge("monster");
  state.timeLeft = REPEAT_SECONDS;
  updatePromptForChallenge(state.challenge, "demo");
  ui.heardText.textContent = "電腦會先念 3 次，等提示後複誦防禦";
  ui.phaseLabel.textContent = "範讀中";
  ui.answerInput.value = "";
  ui.answerInput.focus();
  state.monsterCast = 0.35;
  playTone(210, 0.16, "sawtooth", 0.04);
  speakChallengeThenRepeat(state.challenge);
}

function finishChallenge(success, heard = "") {
  if (!state.challenge || state.phase === "idle" || state.phase === "demo") return;
  stopRecognition();
  cancelSpeech();
  const challenge = state.challenge;
  state.challenge = null;
  ui.heardText.textContent = heard ? `聽到：${heard}` : success ? "答對！" : "時間到";

  if (challenge.owner === "player") {
    if (success) {
      const damage = challenge.kind === "big" ? 34 : 18;
      state.monsterHp = Math.max(0, state.monsterHp - damage);
      setActorAction("hero", "attack", 0.85);
      setActorAction("monster", "hit", 0.8);
      state.heroCast = 0.38;
      spawnProjectile("player", challenge);
      castBurst(330, 430, challenge.kind);
      floatingText(`-${damage}`, 935, 315, "#fff2a6");
      playTone(challenge.kind === "big" ? 980 : 760, challenge.kind === "big" ? 0.26 : 0.13, "triangle", challenge.kind === "big" ? 0.075 : 0.05);
      log(`答對 ${challenge.text}，${challenge.kind === "big" ? "大招" : "小招"}命中怪物。`);
    } else {
      setActorAction("hero", "lose", 0.8);
      log(`玩家複誦 ${challenge.text} 沒有成功。`);
      playTone(160, 0.16, "square", 0.035);
    }
    afterAction();
    return;
  }

  if (success) {
    setActorAction("hero", "attack", 0.75);
    setActorAction("monster", "hit", 0.65);
    removeMonsterProjectile();
    shieldBurst(430, 360, challenge.kind);
    playTone(880, 0.12, "sine", 0.05);
    log(`成功唸出 ${challenge.text}，怪物攻擊被抵銷。`);
  } else {
    const damage = challenge.kind === "big" ? 24 : 12;
    state.playerHp = Math.max(0, state.playerHp - damage);
    setActorAction("monster", "attack", 0.85);
    setActorAction("hero", "hit", 0.85);
    state.heroHit = 0.55;
    state.shakes = challenge.kind === "big" ? 30 : 18;
    impactBurst(330, 385, challenge.kind, "player");
    floatingText(`-${damage}`, 315, 275, "#ffced8");
    playTone(120, 0.18, "sawtooth", 0.045);
    log(`沒有擋下 ${challenge.text}，玩家受到 ${damage} 點傷害。`);
  }
  afterAction();
}

function afterAction() {
  updateHud();
  if (state.monsterHp <= 0) {
    completeLevel();
    return;
  }
  if (state.playerHp <= 0) {
    gameOver();
    return;
  }
  state.phase = "idle";
  ui.phaseLabel.textContent = "下一招準備";
  ui.kkText.textContent = "";
  ui.translationText.textContent = "";
  state.nextPhaseAt = performance.now() + 900;
}

function completeLevel() {
  const letter = currentLetter();
  state.completed.add(letter);
  setActorAction("hero", "win", 1.4);
  setActorAction("monster", "lose", 1.4);
  sparkle(970, 410, "#ff7a99", 55);
  log(`${letter} 關完成！`);
  state.level += 1;
  if (state.level >= alphabet.length) {
    state.phase = "idle";
    state.started = false;
    ui.promptMeta.textContent = "恭喜通過 26 個字母關卡";
    ui.spellText.textContent = "WIN";
    ui.kkText.textContent = "";
    ui.phaseLabel.textContent = "全破";
    showResult("win");
    updateHud();
    return;
  }
  state.monsterHp = 100;
  state.playerHp = Math.min(100, state.playerHp + 12);
  updateHud();
  state.phase = "idle";
  ui.phaseLabel.textContent = "下一關準備";
  ui.kkText.textContent = "";
  ui.translationText.textContent = "";
  state.nextPhaseAt = performance.now() + 1100;
}

function gameOver() {
  state.started = false;
  state.phase = "idle";
  stopRecognition();
  setActorAction("hero", "lose", 2.4);
  setActorAction("monster", "win", 2.4);
  ui.promptMeta.textContent = "再試一次";
  ui.spellText.textContent = "TRY";
  ui.kkText.textContent = "";
  ui.translationText.textContent = "";
  ui.phaseLabel.textContent = "挑戰失敗";
  showResult("lose");
  log("玩家 HP 歸零，按重新開始再挑戰。");
}

function handleAnswer(value) {
  if (!state.challenge || (state.phase !== "player" && state.phase !== "monster")) return;
  const result = isAnswerAccepted(value, state.challenge);
  if (!result.heard) return;
  finishChallenge(result.success, result.heard);
}

function updateHud() {
  ui.levelLabel.textContent = currentLetter() || "-";
  ui.playerHp.textContent = state.playerHp;
  ui.monsterHp.textContent = state.monsterHp;
  if (state.challenge) {
    ui.timerLabel.textContent = state.timeLeft.toFixed(1);
  } else if (state.started && state.nextPhaseAt > performance.now()) {
    ui.timerLabel.textContent = "準備";
  } else {
    ui.timerLabel.textContent = "0.0";
  }
  [...ui.progressGrid.children].forEach((tile) => {
    tile.classList.toggle("active", tile.dataset.letter === currentLetter());
    tile.classList.toggle("selected", Number(tile.dataset.level) === state.selectedLevel);
    tile.classList.toggle("done", state.completed.has(tile.dataset.letter));
  });
}

function log(message) {
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.textContent = message;
  ui.logBox.prepend(entry);
  while (ui.logBox.children.length > 16) ui.logBox.lastChild.remove();
}

function startRecognition() {
  if (!state.recognitionOn || !state.challenge || state.recognitionListening || state.recognitionStarting) return;
  if (window.MediaRecorder && navigator.mediaDevices?.getUserMedia) {
    startApiRecording();
    return;
  }
  if (!recognition) return;
  clearTimeout(restartRecognitionTimer);
  state.recognitionStarting = true;
  try {
    recognition.start();
  } catch {
    state.recognitionStarting = false;
    // Browser speech recognition throws if it is already starting.
  }
}

function stopRecognition() {
  stopApiRecording(false);
  if (!recognition) return;
  clearTimeout(restartRecognitionTimer);
  try {
    recognition.stop();
  } catch {
    state.recognitionListening = false;
    state.recognitionStarting = false;
  }
}

function chooseRecorderMimeType() {
  if (!window.MediaRecorder) return "";
  const options = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/mp4;codecs=mp4a.40.2",
    "audio/ogg;codecs=opus",
    "audio/wav",
  ];
  return options.find((type) => MediaRecorder.isTypeSupported?.(type)) || "";
}

async function startApiRecording() {
  clearTimeout(recorderTimer);
  state.recognitionStarting = true;
  recorderChunks = [];
  submitRecording = true;
  try {
    currentRecorderStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    activeRecorderMimeType = chooseRecorderMimeType();
    currentRecorder = activeRecorderMimeType
      ? new MediaRecorder(currentRecorderStream, { mimeType: activeRecorderMimeType })
      : new MediaRecorder(currentRecorderStream);
    currentRecorder.ondataavailable = (event) => {
      if (event.data.size) recorderChunks.push(event.data);
    };
    currentRecorder.onstart = () => {
      state.recognitionStarting = false;
      state.recognitionListening = true;
      ui.micButton.textContent = "錄音中";
      ui.heardText.textContent = `正在錄音，請複誦 ${state.challenge?.text || ""}`;
    };
    currentRecorder.onstop = async () => {
      const shouldSubmit = submitRecording;
      const recordedChunks = [...recorderChunks];
      cleanupRecorder();
      if (!shouldSubmit || !state.challenge || (state.phase !== "player" && state.phase !== "monster")) return;
      const activeChallenge = state.challenge;
      state.phase = "checking";
      state.timeLeft = 0;
      updateHud();
      ui.heardText.textContent = "正在辨識複誦...";
      ui.phaseLabel.textContent = "辨識中";
      try {
        const mimeType = activeRecorderMimeType || currentRecorder?.mimeType || "audio/webm";
        const blob = new Blob(recordedChunks, { type: mimeType });
        const response = await fetch("/api/transcribe", {
          method: "POST",
          headers: { "Content-Type": mimeType },
          body: blob,
        });
        if (!response.ok) throw new Error("transcribe failed");
        const result = await response.json();
        if (state.challenge !== activeChallenge) return;
        const verdict = isAnswerAccepted(result.text || "", activeChallenge);
        if (!verdict.heard) {
          activeChallenge.retries = (activeChallenge.retries || 0) + 1;
          if (activeChallenge.retries <= 1) {
            ui.heardText.textContent = "沒有聽到清楚的英文，再複誦一次";
            beginRepeatWindow(activeChallenge);
          } else {
            ui.heardText.textContent = "還是沒有聽清楚，可以用鍵盤輸入答案";
            state.phase = activeChallenge.owner === "player" ? "player" : "monster";
            state.timeLeft = REPEAT_SECONDS;
          }
          return;
        }
        finishChallenge(verdict.success, verdict.heard);
      } catch {
        ui.heardText.textContent = "OpenAI 辨識暫時失敗，請用鍵盤輸入或再試一次";
        if (state.challenge === activeChallenge) state.phase = activeChallenge.owner === "player" ? "player" : "monster";
      }
    };
    currentRecorder.start();
    recorderTimer = setTimeout(() => stopApiRecording(true), Math.max(1200, (state.timeLeft - 0.2) * 1000));
  } catch {
    cleanupRecorder();
    startBrowserRecognitionFallback();
  }
}

function stopApiRecording(shouldSubmit) {
  clearTimeout(recorderTimer);
  submitRecording = shouldSubmit;
  if (currentRecorder && currentRecorder.state !== "inactive") {
    currentRecorder.stop();
  } else {
    cleanupRecorder();
  }
}

function cleanupRecorder() {
  state.recognitionListening = false;
  state.recognitionStarting = false;
  ui.micButton.textContent = state.recognitionOn ? "語音已開啟" : "開始語音";
  if (currentRecorderStream) currentRecorderStream.getTracks().forEach((track) => track.stop());
  currentRecorder = null;
  currentRecorderStream = null;
  activeRecorderMimeType = "";
}

function startBrowserRecognitionFallback() {
  if (!recognition) return;
  state.recognitionStarting = true;
  try {
    recognition.start();
  } catch {
    state.recognitionStarting = false;
  }
}

function setupRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    ui.micButton.disabled = true;
    ui.micButton.textContent = "語音不支援";
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 5;
  recognition.onstart = () => {
    state.recognitionStarting = false;
    state.recognitionListening = true;
    ui.micButton.textContent = "語音聆聽中";
  };
  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    const transcripts = Array.from(result).map((item) => item.transcript);
    ui.heardText.textContent = `聽到：${transcripts[0]}`;
    if (result.isFinal) handleAnswer(transcripts);
  };
  recognition.onerror = (event) => {
    state.recognitionStarting = false;
    state.recognitionListening = false;
    const messages = {
      "not-allowed": "麥克風被瀏覽器擋住，請在網址列左側允許麥克風",
      "audio-capture": "找不到麥克風，請確認裝置有連接",
      "no-speech": "沒有聽到聲音，請靠近麥克風再唸一次",
      network: "語音服務連線不穩，請稍後再試或改用鍵盤",
    };
    ui.heardText.textContent = messages[event.error] || "語音沒有成功，請再唸一次或用鍵盤輸入";
  };
  recognition.onend = () => {
    state.recognitionListening = false;
    state.recognitionStarting = false;
    ui.micButton.textContent = state.recognitionOn ? "語音已開啟" : "開始語音";
  };
}

async function requestMicPermission() {
  if (state.micPermissionGranted) return true;
  if (!navigator.mediaDevices?.getUserMedia) {
    ui.heardText.textContent = "這個瀏覽器不支援麥克風權限檢查，請改用 Chrome";
    return true;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    state.micPermissionGranted = true;
    return true;
  } catch {
    ui.heardText.textContent = "麥克風尚未允許，請在網址列左側把麥克風設為允許";
    return false;
  }
}

async function toggleMic() {
  if (!recognition) return;
  if (window.location.protocol === "file:" || !window.isSecureContext) {
    ui.heardText.textContent = "目前是直接開 HTML 檔，語音會一直重問權限；請用 http://localhost:5173 開啟";
    return;
  }
  state.recognitionOn = !state.recognitionOn;
  if (state.recognitionOn) {
    ui.micButton.textContent = "要求權限中";
    const permitted = await requestMicPermission();
    if (!permitted) {
      state.recognitionOn = false;
      ui.micButton.textContent = "開始語音";
      return;
    }
    ui.micButton.textContent = "語音已開啟";
    ui.heardText.textContent = "語音已開啟，請用英文唸出提示";
    startRecognition();
  } else {
    ui.micButton.textContent = "開始語音";
    stopRecognition();
  }
}

function setupAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  const ctxAudio = new AudioContext();
  const master = ctxAudio.createGain();
  const musicGain = ctxAudio.createGain();
  const sfxGain = ctxAudio.createGain();
  master.gain.value = 0.85;
  musicGain.gain.value = state.musicVolume;
  sfxGain.gain.value = state.sfxVolume;
  musicGain.connect(master);
  sfxGain.connect(master);
  master.connect(ctxAudio.destination);
  return { ctx: ctxAudio, master, musicGain, sfxGain, musicTimer: null };
}

function updateAudioVolumes() {
  if (!audio) return;
  audio.musicGain.gain.value = state.musicVolume;
  audio.sfxGain.gain.value = state.sfxVolume;
}

function startMusic() {
  if (!audio) audio = setupAudio();
  if (!audio || state.musicOn) return;
  state.musicOn = true;
  ui.musicButton.textContent = "音樂關閉";
  const notes = [392, 440, 523, 587, 523, 440, 392, 330];
  let index = 0;
  audio.ctx.resume();
  audio.musicTimer = setInterval(() => {
    playMusicTone(notes[index % notes.length], 0.18, "sine", 0.035);
    index += 1;
  }, 420);
}

function toggleMusic() {
  if (!audio) audio = setupAudio();
  if (!audio) return;
  if (state.musicOn) {
    state.musicOn = false;
    ui.musicButton.textContent = "音樂開啟";
    clearInterval(audio.musicTimer);
  } else {
    startMusic();
  }
}

function playTone(freq, duration, type = "sine", volume = 0.04) {
  playAudioTone(freq, duration, type, volume, "sfx");
}

function playMusicTone(freq, duration, type = "sine", volume = 0.04) {
  playAudioTone(freq, duration, type, volume, "music");
}

function playAudioTone(freq, duration, type = "sine", volume = 0.04, channel = "sfx") {
  if (!audio) return;
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain);
  gain.connect(channel === "music" ? audio.musicGain : audio.sfxGain);
  osc.start(now);
  osc.stop(now + duration + 0.03);
}

function spawnProjectile(owner, challenge) {
  const fromPlayer = owner === "player";
  const isBig = challenge.kind === "big";
  const label = challenge.text;
  state.projectiles.push({
    owner,
    kind: challenge.kind,
    label: label.toUpperCase(),
    x: fromPlayer ? 350 : 940,
    y: fromPlayer ? 390 : 350,
    vx: fromPlayer ? (isBig ? 500 : 670) : (isBig ? -100 : -120),
    targetX: fromPlayer ? 905 : 365,
    color: fromPlayer ? (isBig ? "#fff06a" : "#5ee7d4") : (isBig ? "#ff6f9e" : "#b88cff"),
    coreColor: fromPlayer ? "#17324d" : "#fff5fb",
    size: isBig ? 54 : 34,
    life: fromPlayer ? (isBig ? 1.45 : 1.05) : 5.4,
    hit: false,
  });
}

function removeMonsterProjectile() {
  state.projectiles = state.projectiles.filter((projectile) => projectile.owner !== "monster");
}

function addRing(x, y, color, maxRadius, width = 8) {
  state.rings.push({ x, y, color, radius: 8, maxRadius, width, life: 0.55, maxLife: 0.55 });
}

function floatingText(text, x, y, color) {
  state.floatingTexts.push({ text, x, y, color, life: 0.95, maxLife: 0.95 });
}

function setActorAction(actor, action, duration = 0.9) {
  if (actor === "hero") {
    state.heroAction = action;
    state.heroActionTime = duration;
    return;
  }
  state.monsterAction = action;
  state.monsterActionTime = duration;
}

function flash(color, life = 0.18) {
  state.screenFlashes.push({ color, life, maxLife: life });
}

function castBurst(x, y, kind) {
  const big = kind === "big";
  sparkle(x, y, big ? "#7dfcff" : "#fff06a", big ? 52 : 24);
  addRing(x, y, big ? "#7dfcff" : "#fff06a", big ? 96 : 58, big ? 12 : 7);
}

function shieldBurst(x, y, kind) {
  const big = kind === "big";
  sparkle(x, y, "#5ee7d4", big ? 58 : 34);
  addRing(x, y, "#5ee7d4", big ? 140 : 88, big ? 14 : 9);
  addRing(x, y, "#ffffff", big ? 92 : 56, 5);
  flash("rgba(94, 231, 212, 0.18)", 0.16);
}

function impactBurst(x, y, kind, target) {
  const big = kind === "big";
  const color = target === "monster" ? "#fff06a" : "#ff7a99";
  sparkle(x, y, color, big ? 78 : 38);
  addRing(x, y, color, big ? 150 : 82, big ? 15 : 9);
  addRing(x, y, "#ffffff", big ? 92 : 48, 5);
  flash(big ? "rgba(255, 240, 106, 0.25)" : "rgba(255, 122, 153, 0.16)", big ? 0.24 : 0.14);
  if (target === "monster") state.monsterHit = big ? 0.62 : 0.38;
  if (target === "player") state.heroHit = big ? 0.62 : 0.42;
  state.shakes = Math.max(state.shakes, big ? 26 : 14);
}

function showResult(mode) {
  state.resultMode = mode;
  ui.resultOverlay.hidden = false;
  ui.resultOverlay.classList.toggle("lose", mode === "lose");
  ui.resultTitle.textContent = mode === "win" ? "WIN" : "TRY AGAIN";
  ui.resultSubtitle.textContent = mode === "win" ? "26 個字母全部完成" : "光盾破裂了";
  if (mode === "win") {
    for (let i = 0; i < 8; i += 1) setTimeout(() => sparkle(220 + Math.random() * 840, 120 + Math.random() * 420, "#fff06a", 36), i * 140);
    flash("rgba(255, 240, 106, 0.32)", 0.45);
  } else {
    flash("rgba(120, 10, 44, 0.38)", 0.55);
    for (let i = 0; i < 5; i += 1) setTimeout(() => addRing(320 + Math.random() * 180, 350 + Math.random() * 110, "#ff7a99", 80 + Math.random() * 80, 10), i * 180);
  }
}

function sparkle(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 90 + Math.random() * 210;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      life: 0.45 + Math.random() * 0.45,
      size: 3 + Math.random() * 5,
    });
  }
}

function update(delta, now) {
  if (state.challenge && (state.phase === "player" || state.phase === "monster")) {
    state.timeLeft = Math.max(0, state.timeLeft - delta);
    if (state.timeLeft <= 0) finishChallenge(false);
  } else if (state.started && state.phase === "idle" && now >= state.nextPhaseAt) {
    if (Math.random() < 0.58) beginPlayerTurn();
    else beginMonsterTurn();
  }

  state.projectiles.forEach((projectile) => {
    projectile.x += projectile.vx * delta;
    projectile.life -= delta;
    sparkle(projectile.x, projectile.y, projectile.color, projectile.kind === "big" ? 3 : 1);
    if (!projectile.hit && projectile.owner === "player" && projectile.x >= projectile.targetX) {
      projectile.hit = true;
      projectile.life = 0;
      impactBurst(930, 385, projectile.kind, "monster");
    }
    if (!projectile.hit && projectile.owner === "monster" && projectile.x <= projectile.targetX) {
      projectile.hit = true;
      projectile.life = 0;
    }
  });
  state.projectiles = state.projectiles.filter((projectile) => projectile.life > 0 && projectile.x > 120 && projectile.x < 1120);

  state.particles.forEach((particle) => {
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    particle.vy += 160 * delta;
    particle.life -= delta;
  });
  state.particles = state.particles.filter((particle) => particle.life > 0);
  state.rings.forEach((ring) => {
    ring.life -= delta;
    ring.radius += (ring.maxRadius - ring.radius) * Math.min(1, delta * 8);
  });
  state.rings = state.rings.filter((ring) => ring.life > 0);
  state.floatingTexts.forEach((text) => {
    text.life -= delta;
    text.y -= 52 * delta;
  });
  state.floatingTexts = state.floatingTexts.filter((text) => text.life > 0);
  state.screenFlashes.forEach((item) => {
    item.life -= delta;
  });
  state.screenFlashes = state.screenFlashes.filter((item) => item.life > 0);
  state.shakes = Math.max(0, state.shakes - 1);
  state.heroHit = Math.max(0, state.heroHit - delta);
  state.monsterHit = Math.max(0, state.monsterHit - delta);
  state.heroCast = Math.max(0, state.heroCast - delta);
  state.monsterCast = Math.max(0, state.monsterCast - delta);
  if (state.heroAction !== "idle") {
    state.heroActionTime = Math.max(0, state.heroActionTime - delta);
    if (state.heroActionTime <= 0 && !state.resultMode) state.heroAction = "idle";
  }
  if (state.monsterAction !== "idle") {
    state.monsterActionTime = Math.max(0, state.monsterActionTime - delta);
    if (state.monsterActionTime <= 0 && !state.resultMode) state.monsterAction = "idle";
  }
  updateHud();
}

function draw() {
  const shakeX = state.shakes ? (Math.random() - 0.5) * state.shakes : 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(shakeX, 0);
  drawBackground();
  drawGroundGlow();
  drawHero();
  drawMonster();
  drawCombatBars();
  drawProjectiles();
  drawRings();
  drawParticles();
  drawFloatingTexts();
  drawScreenFlashes();
  ctx.restore();
}

function drawBackground() {
  const generatedBackground = spriteImages.backgrounds[state.level];
  if (generatedBackground?.complete && generatedBackground.naturalWidth > 0) {
    const scale = Math.max(canvas.width / generatedBackground.naturalWidth, canvas.height / generatedBackground.naturalHeight);
    const w = generatedBackground.naturalWidth * scale;
    const h = generatedBackground.naturalHeight * scale;
    ctx.drawImage(generatedBackground, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    ctx.fillStyle = "rgba(50, 120, 90, 0.26)";
    ctx.fillRect(0, 585, canvas.width, 160);
    return;
  }
  const scene = scenePalettes[state.level % scenePalettes.length];
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, scene.sky);
  sky.addColorStop(0.62, scene.far);
  sky.addColorStop(1, scene.ground);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.globalAlpha = 0.42;
  for (let i = 0; i < 7; i += 1) {
    const x = ((i * 210 + state.level * 47) % 1500) - 90;
    const y = 120 + ((i * 37 + state.level * 19) % 110);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(x, y, 70, 24, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 54, y + 6, 46, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  if (scene.type === "space") drawSpaceScene(scene);
  else if (scene.type === "city") drawCityScene(scene);
  else if (scene.type === "desert") drawDesertScene(scene);
  else if (scene.type === "forest") drawForestScene(scene);
  else if (scene.type === "crystal") drawCrystalScene(scene);
  else drawIceScene(scene);

  ctx.fillStyle = scene.ground;
  ctx.fillRect(0, 585, canvas.width, 160);
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  for (let i = 0; i < 12; i += 1) {
    ctx.beginPath();
    ctx.ellipse(i * 130 + (state.level % 3) * 20, 620 + (i % 3) * 18, 85, 16, -0.08, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCityScene(scene) {
  for (let i = 0; i < 10; i += 1) {
    const h = 120 + ((i * 47 + state.level * 13) % 150);
    const x = i * 135 - 40;
    ctx.fillStyle = i % 2 ? "rgba(238,247,255,0.6)" : "rgba(72,100,123,0.42)";
    ctx.fillRect(x, 585 - h, 78, h);
    ctx.fillStyle = scene.accent;
    for (let y = 585 - h + 18; y < 570; y += 28) {
      ctx.fillRect(x + 14, y, 12, 10);
      ctx.fillRect(x + 48, y, 12, 10);
    }
  }
}

function drawSpaceScene(scene) {
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  for (let i = 0; i < 80; i += 1) {
    ctx.fillRect((i * 71 + state.level * 23) % canvas.width, (i * 43) % 360, 2, 2);
  }
  ctx.fillStyle = scene.accent;
  ctx.beginPath();
  ctx.arc(1030, 130, 54, 0, Math.PI * 2);
  ctx.fill();
}

function drawDesertScene(scene) {
  ctx.fillStyle = "rgba(132,75,52,0.28)";
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * 310 - 80, 585);
    ctx.quadraticCurveTo(i * 310 + 120, 390 - (i % 2) * 40, i * 310 + 330, 585);
    ctx.fill();
  }
}

function drawForestScene(scene) {
  for (let i = 0; i < 9; i += 1) {
    const x = i * 160 - 40;
    ctx.fillStyle = "rgba(75,83,55,0.45)";
    ctx.fillRect(x + 36, 400, 28, 190);
    ctx.fillStyle = i % 2 ? "rgba(82,156,102,0.62)" : "rgba(60,128,95,0.62)";
    ctx.beginPath();
    ctx.arc(x + 50, 375, 70, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCrystalScene(scene) {
  for (let i = 0; i < 11; i += 1) {
    const x = i * 125 + 20;
    const h = 70 + ((i * 31 + state.level * 11) % 160);
    ctx.fillStyle = i % 2 ? "rgba(94,231,212,0.46)" : "rgba(255,240,106,0.36)";
    ctx.beginPath();
    ctx.moveTo(x, 585);
    ctx.lineTo(x + 36, 585 - h);
    ctx.lineTo(x + 72, 585);
    ctx.closePath();
    ctx.fill();
  }
}

function drawIceScene(scene) {
  ctx.fillStyle = "rgba(255,255,255,0.38)";
  for (let i = 0; i < 6; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * 245 - 20, 585);
    ctx.lineTo(i * 245 + 90, 360 - (i % 2) * 60);
    ctx.lineTo(i * 245 + 210, 585);
    ctx.closePath();
    ctx.fill();
  }
}

function drawGroundGlow() {
  const gradient = ctx.createRadialGradient(640, 520, 80, 640, 520, 520);
  gradient.addColorStop(0, "rgba(255,255,255,0.28)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawHero() {
  const config = heroConfigs[state.hero] || heroConfigs.nova;
  const actionSheet = spriteImages.heroActions[state.hero];
  if (actionSheet?.complete && actionSheet.naturalWidth > 0) {
    drawHeroActionSprite(300, 340, config, actionSheet, state.heroAction, state.heroHit, state.heroCast);
    return;
  }
  if (spriteImages.heroes.complete && spriteImages.heroes.naturalWidth > 0) {
    drawGeneratedHero(300, 340, config, state.phase, state.heroHit, state.heroCast);
    return;
  }
  drawLightHero(300, 365, 1.05, config, state.phase, state.heroHit, state.heroCast);
}

function actionIndex(action) {
  return { idle: 0, attack: 1, hit: 2, win: 3, lose: 4 }[action] ?? 0;
}

function drawHeroActionSprite(x, y, config, image, action, hit, cast) {
  const columns = 5;
  const sx = Math.floor((image.naturalWidth / columns) * actionIndex(action));
  const sy = 0;
  const sw = Math.floor(image.naturalWidth / columns);
  const sh = image.naturalHeight;
  const pose = actorPose(action, state.heroActionTime, "hero");
  const bob = action === "idle" ? Math.sin(performance.now() / 260) * 5 : 0;
  const hitShake = hit > 0 ? (Math.random() - 0.5) * 16 : 0;
  const baseW = state.hero === "solar" ? 350 : 320;
  const baseH = state.hero === "solar" ? 350 : 390;
  const drawW = baseW * pose.scaleX;
  const drawH = baseH * pose.scaleY;
  if (cast > 0 || action === "attack") {
    ctx.save();
    ctx.globalAlpha = action === "attack" ? 0.62 : 0.42;
    ctx.shadowColor = config.beam;
    ctx.shadowBlur = 42;
    ctx.strokeStyle = config.beam;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.ellipse(x + 8, y + 178, 132, 202, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.save();
  ctx.translate(x + pose.x + hitShake, y + pose.y + bob);
  ctx.rotate(pose.rotate);
  ctx.globalAlpha = pose.alpha;
  ctx.drawImage(image, sx, sy, sw, sh, -drawW / 2, -150, drawW, drawH);
  if (action === "win") drawVictorySparkles(0, -92, config.gem);
  if (action === "lose") drawDefeatDust(0, 218);
  ctx.restore();
}

function drawCombatBars() {
  drawHealthBar(175, 118, 250, state.playerHp, heroConfigs[state.hero]?.gem || "#5ee7d4", "HERO");
  drawHealthBar(795, 118, 270, state.monsterHp, "#ff7a99", `怪獸 ${currentLetter() || ""}`);
}

function drawHealthBar(x, y, width, value, color, label) {
  const height = 20;
  const hp = Math.max(0, Math.min(100, value));
  ctx.save();
  ctx.fillStyle = "rgba(23, 50, 77, 0.72)";
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 3;
  roundRect(x, y, width, height, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = color;
  roundRect(x + 4, y + 4, (width - 8) * (hp / 100), height - 8, 5);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 13px ui-rounded, system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${label} ${hp}`, x + width / 2, y + height / 2 + 0.5);
  ctx.restore();
}

function roundRect(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawGeneratedHero(x, y, config, phase, hit, cast) {
  const cuts = {
    nova: [0, 92, 540, 780],
    aqua: [515, 116, 440, 790],
    solar: [965, 105, 555, 695],
  };
  const [sx, sy, sw, sh] = cuts[state.hero] || cuts.nova;
  const action = state.heroAction;
  const t = performance.now();
  const bob = Math.sin(t / 250) * 4;
  const hitShake = hit > 0 ? (Math.random() - 0.5) * 16 : 0;
  const castScale = cast > 0 ? 1.03 + Math.sin(performance.now() / 38) * 0.018 : 1;
  const dw = state.hero === "solar" ? 330 : 285;
  const dh = state.hero === "solar" ? 365 : 405;
  const pose = actorPose(action, state.heroActionTime, "hero");
  const drawW = dw * castScale * pose.scaleX;
  const drawH = dh * castScale * pose.scaleY;
  if (cast > 0) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.shadowColor = config.beam;
    ctx.shadowBlur = 40;
    ctx.strokeStyle = config.beam;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.ellipse(x + 10, y + 180, 126, 205, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.save();
  ctx.translate(x + pose.x + hitShake, y + pose.y + bob);
  ctx.rotate(pose.rotate);
  ctx.globalAlpha = pose.alpha;
  ctx.drawImage(spriteImages.heroes, sx, sy, sw, sh, -drawW / 2, -145, drawW, drawH);
  if (action === "win") drawVictorySparkles(0, -85, config.gem);
  if (action === "lose") drawDefeatDust(0, 220);
  ctx.restore();
  if (hit > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.48, hit * 1.5);
    ctx.filter = "brightness(2.4) saturate(0.6)";
    ctx.translate(x + pose.x + hitShake, y + pose.y + bob);
    ctx.rotate(pose.rotate);
    ctx.drawImage(spriteImages.heroes, sx, sy, sw, sh, -drawW / 2, -145, drawW, drawH);
    ctx.restore();
  }
}

function drawMonster() {
  const actionSheet = spriteImages.kaijuActions[state.level % 4];
  if (actionSheet?.complete && actionSheet.naturalWidth > 0) {
    drawKaijuActionSprite(930, 350, state.level, actionSheet, state.monsterAction, state.monsterHit, state.monsterCast);
    return;
  }
  if (spriteImages.kaiju.complete && spriteImages.kaiju.naturalWidth > 0) {
    drawGeneratedKaiju(930, 350, state.level, state.phase, state.monsterHit, state.monsterCast);
    return;
  }
  drawKaiju(930, 392, state.level, state.phase, state.monsterHit, state.monsterCast);
}

function drawKaijuActionSprite(x, y, level, image, action, hit, cast) {
  const columns = 5;
  const sx = Math.floor((image.naturalWidth / columns) * actionIndex(action));
  const sy = 0;
  const sw = Math.floor(image.naturalWidth / columns);
  const sh = image.naturalHeight;
  const pose = actorPose(action, state.monsterActionTime, "monster");
  const bob = action === "idle" ? Math.sin(performance.now() / 280 + level) * 5 : 0;
  const hitShake = hit > 0 ? (Math.random() - 0.5) * 18 : 0;
  const baseW = 330;
  const baseH = 360;
  const drawW = baseW * pose.scaleX;
  const drawH = baseH * pose.scaleY;
  if (cast > 0 || action === "attack") {
    ctx.save();
    ctx.globalAlpha = action === "attack" ? 0.5 : 0.36;
    ctx.shadowColor = "#ff6f9e";
    ctx.shadowBlur = 42;
    ctx.fillStyle = "rgba(255, 111, 158, 0.28)";
    ctx.beginPath();
    ctx.ellipse(x, y + 175, 160, 58, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.save();
  ctx.translate(x + pose.x + hitShake, y + pose.y + bob);
  ctx.rotate(pose.rotate);
  ctx.globalAlpha = pose.alpha;
  ctx.drawImage(image, sx, sy, sw, sh, -drawW / 2, -118, drawW, drawH);
  if (action === "win") drawVictorySparkles(0, -58, "#ff7a99");
  if (action === "lose") drawDefeatDust(0, 205);
  ctx.restore();
}

function drawGeneratedKaiju(x, y, level, phase, hit, cast) {
  const cuts = [
    [40, 155, 365, 610],
    [420, 180, 430, 575],
    [875, 155, 430, 595],
    [1305, 130, 430, 615],
  ];
  const [sx, sy, sw, sh] = cuts[level % cuts.length];
  const action = state.monsterAction;
  const bob = Math.sin(performance.now() / 280 + level) * 4;
  const hitShake = hit > 0 ? (Math.random() - 0.5) * 18 : 0;
  const castScale = cast > 0 ? 1.04 + Math.sin(performance.now() / 42) * 0.018 : 1;
  const pose = actorPose(action, state.monsterActionTime, "monster");
  const dw = 310 * castScale * pose.scaleX;
  const dh = 345 * castScale * pose.scaleY;
  if (cast > 0) {
    ctx.save();
    ctx.globalAlpha = 0.42;
    ctx.shadowColor = "#ff6f9e";
    ctx.shadowBlur = 38;
    ctx.fillStyle = "rgba(255, 111, 158, 0.3)";
    ctx.beginPath();
    ctx.ellipse(x, y + 175, 155, 54, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.save();
  ctx.translate(x + pose.x + hitShake, y + pose.y + bob);
  ctx.rotate(pose.rotate);
  ctx.globalAlpha = pose.alpha;
  ctx.drawImage(spriteImages.kaiju, sx, sy, sw, sh, -dw / 2, -115, dw, dh);
  if (action === "win") drawVictorySparkles(0, -50, "#ff7a99");
  if (action === "lose") drawDefeatDust(0, 205);
  ctx.restore();
  if (hit > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.5, hit * 1.5);
    ctx.filter = "brightness(2.4) saturate(0.65)";
    ctx.translate(x + pose.x + hitShake, y + pose.y + bob);
    ctx.rotate(pose.rotate);
    ctx.drawImage(spriteImages.kaiju, sx, sy, sw, sh, -dw / 2, -115, dw, dh);
    ctx.restore();
  }
}

function actorPose(action, timeLeft, actor) {
  const t = performance.now();
  const forward = actor === "hero" ? 1 : -1;
  const pulse = Math.sin(t / 170);
  const pose = { x: 0, y: 0, rotate: 0, scaleX: 1 + pulse * 0.012, scaleY: 1 - pulse * 0.008, alpha: 1 };

  if (action === "attack") {
    const p = 1 - Math.max(0, Math.min(1, timeLeft / 0.85));
    const snap = Math.sin(p * Math.PI);
    pose.x = forward * (34 + snap * 42);
    pose.y = -snap * 18;
    pose.rotate = forward * -0.08 * snap;
    pose.scaleX = 1.08 + snap * 0.08;
    pose.scaleY = 0.96;
  } else if (action === "hit") {
    const shake = Math.sin(t / 22) * 10;
    pose.x = -forward * 34 + shake;
    pose.y = Math.sin(t / 34) * 7;
    pose.rotate = -forward * 0.14;
    pose.scaleX = 0.96;
    pose.scaleY = 1.04;
  } else if (action === "win") {
    const jump = Math.abs(Math.sin(t / 180));
    pose.y = -18 - jump * 22;
    pose.rotate = Math.sin(t / 260) * 0.08;
    pose.scaleX = 1.05;
    pose.scaleY = 1.05;
  } else if (action === "lose") {
    pose.x = -forward * 38;
    pose.y = 28 + Math.sin(t / 300) * 4;
    pose.rotate = -forward * 0.22;
    pose.scaleX = 1.04;
    pose.scaleY = 0.9;
    pose.alpha = 0.88;
  }

  return pose;
}

function drawVictorySparkles(x, y, color) {
  ctx.save();
  ctx.globalAlpha = 0.78;
  ctx.fillStyle = color;
  for (let i = 0; i < 5; i += 1) {
    const angle = performance.now() / 360 + i * 1.25;
    const px = x + Math.cos(angle) * (64 + i * 7);
    const py = y + Math.sin(angle) * (34 + i * 4);
    ctx.beginPath();
    ctx.arc(px, py, 5 + (i % 2) * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawDefeatDust(x, y) {
  ctx.save();
  ctx.globalAlpha = 0.32;
  ctx.fillStyle = "#6c7680";
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.ellipse(x - 58 + i * 29, y + Math.sin(performance.now() / 200 + i) * 4, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawLightHero(x, y, scale, config, phase, hit, cast) {
  const bob = Math.sin(performance.now() / 250) * (phase === "player" ? 7 : 3);
  const hitShake = hit > 0 ? (Math.random() - 0.5) * 16 : 0;
  const px = x + hitShake;
  const py = y + bob;
  ctx.save();
  ctx.translate(px, py);
  ctx.scale(scale, scale);
  if (cast > 0) drawHeroAura(config);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.strokeStyle = config.primary;
  ctx.lineWidth = 28;
  if (phase === "player" && config.pose === "beam") {
    ctx.beginPath();
    ctx.moveTo(-16, -86);
    ctx.lineTo(88, -108);
    ctx.moveTo(14, -54);
    ctx.lineTo(96, -92);
    ctx.stroke();
  } else if (phase === "monster" || config.pose === "shield") {
    ctx.beginPath();
    ctx.moveTo(-28, -76);
    ctx.lineTo(38, -98);
    ctx.moveTo(26, -64);
    ctx.lineTo(70, -120);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(-26, -70);
    ctx.lineTo(-78, -20);
    ctx.moveTo(26, -70);
    ctx.lineTo(78, -36);
    ctx.stroke();
  }

  ctx.fillStyle = config.secondary;
  ctx.beginPath();
  ctx.ellipse(0, -10, 46, 78, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = config.primary;
  ctx.beginPath();
  ctx.moveTo(-34, -78);
  ctx.lineTo(0, 62);
  ctx.lineTo(34, -78);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = config.gem;
  ctx.shadowColor = config.gem;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(0, -34, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = config.primary;
  ctx.lineWidth = 31;
  ctx.beginPath();
  ctx.moveTo(-22, 55);
  ctx.lineTo(-42, 145);
  ctx.moveTo(22, 55);
  ctx.lineTo(45, 145);
  ctx.stroke();
  if (config.pose === "kick" && phase === "player") {
    ctx.beginPath();
    ctx.moveTo(22, 55);
    ctx.lineTo(118, 30);
    ctx.stroke();
  }

  ctx.fillStyle = config.secondary;
  ctx.beginPath();
  ctx.ellipse(0, -118, 37, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = config.primary;
  ctx.beginPath();
  ctx.moveTo(-32, -132);
  ctx.quadraticCurveTo(0, -166, 32, -132);
  ctx.lineTo(22, -112);
  ctx.quadraticCurveTo(0, -128, -22, -112);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff06a";
  ctx.beginPath();
  ctx.ellipse(-13, -122, 8, 13, -0.35, 0, Math.PI * 2);
  ctx.ellipse(13, -122, 8, 13, 0.35, 0, Math.PI * 2);
  ctx.fill();

  if (hit > 0) {
    ctx.globalAlpha = Math.min(0.55, hit * 1.8);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(0, -25, 72, 190, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawHeroAura(config) {
  ctx.save();
  ctx.globalAlpha = 0.48;
  ctx.shadowColor = config.beam;
  ctx.shadowBlur = 30;
  ctx.strokeStyle = config.beam;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.ellipse(0, 12, 86, 180, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawKaiju(x, y, level, phase, hit, cast) {
  const color = monsterPalettes[level % monsterPalettes.length];
  const accent = monsterPalettes[(level + 3) % monsterPalettes.length];
  const hornCount = 1 + (level % 3);
  const legCount = 2 + (level % 2);
  const bob = Math.sin(performance.now() / 280 + level) * (phase === "monster" ? 8 : 4);
  const hitShake = hit > 0 ? (Math.random() - 0.5) * 18 : 0;
  ctx.save();
  ctx.translate(x + hitShake, y + bob);
  if (cast > 0) {
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#ff6f9e";
    ctx.beginPath();
    ctx.ellipse(0, 40, 130, 54, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(60, -10);
  ctx.quadraticCurveTo(160, -20, 190, 50 + (level % 3) * 12);
  ctx.quadraticCurveTo(130, 72, 62, 50);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 82 + (level % 4) * 8, 116, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = accent;
  for (let i = 0; i < hornCount; i += 1) {
    const hx = -34 + i * 34;
    ctx.beginPath();
    ctx.moveTo(hx, -86);
    ctx.lineTo(hx + 18, -156 - (level % 2) * 20);
    ctx.lineTo(hx + 36, -86);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = "#fff6cf";
  ctx.beginPath();
  ctx.ellipse(-27, -40, 16, 22, 0, 0, Math.PI * 2);
  ctx.ellipse(27, -40, 16, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#17324d";
  ctx.beginPath();
  ctx.arc(-25, -38, 6, 0, Math.PI * 2);
  ctx.arc(25, -38, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 22;
  for (let i = 0; i < legCount; i += 1) {
    const lx = -44 + i * (88 / Math.max(1, legCount - 1));
    ctx.beginPath();
    ctx.moveTo(lx, 82);
    ctx.lineTo(lx + (i % 2 ? 18 : -18), 150);
    ctx.stroke();
  }
  ctx.strokeStyle = accent;
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(-70, -2);
  ctx.lineTo(-126, 40 - (level % 2) * 40);
  ctx.moveTo(70, -2);
  ctx.lineTo(126, 30 + (level % 3) * 14);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.arc(-30 + i * 15, 8 + (i % 2) * 20, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  if (hit > 0) {
    ctx.globalAlpha = Math.min(0.58, hit * 1.7);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(0, 0, 118, 150, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawActor(image, sx, sy, sw, sh, dx, dy, dw, dh, amount, hit, cast) {
  const bob = Math.sin(performance.now() / 260) * amount;
  if (!image.complete) return;
  const hitShake = hit > 0 ? (Math.random() - 0.5) * 16 : 0;
  const castScale = cast > 0 ? 1 + Math.sin(performance.now() / 40) * 0.025 : 1;
  const drawW = dw * castScale;
  const drawH = dh * castScale;
  const drawX = dx + hitShake - (drawW - dw) / 2;
  const drawY = dy + bob - (drawH - dh) / 2;
  if (cast > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.55, cast * 1.7);
    ctx.shadowColor = "#fff06a";
    ctx.shadowBlur = 34;
    ctx.fillStyle = "rgba(255, 240, 106, 0.24)";
    ctx.beginPath();
    ctx.ellipse(dx + dw / 2, dy + dh * 0.72, dw * 0.48, dh * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.drawImage(image, sx, sy, sw, sh, drawX, drawY, drawW, drawH);
  if (hit > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.62, hit * 1.8);
    ctx.filter = "brightness(2.4) saturate(0.5)";
    ctx.drawImage(image, sx, sy, sw, sh, drawX, drawY, drawW, drawH);
    ctx.restore();
  }
}

function drawProjectiles() {
  state.projectiles.forEach((projectile) => {
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.shadowColor = projectile.color;
    ctx.shadowBlur = projectile.kind === "big" ? 42 : 22;
    if (projectile.owner === "player" && projectile.kind === "big") {
      ctx.strokeStyle = projectile.color;
      ctx.lineCap = "round";
      ctx.lineWidth = 26;
      ctx.globalAlpha = 0.82;
      ctx.beginPath();
      ctx.moveTo(-150, -10);
      ctx.lineTo(150, -10);
      ctx.moveTo(-150, 10);
      ctx.lineTo(150, 10);
      ctx.stroke();
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(-155, 0);
      ctx.lineTo(155, 0);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (projectile.owner === "player" && projectile.kind === "small") {
      ctx.rotate(Math.sin(performance.now() / 70) * 0.18);
      ctx.strokeStyle = projectile.color;
      ctx.lineCap = "round";
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(-42, 26);
      ctx.quadraticCurveTo(0, -30, 48, -18);
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(48, -18, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }
    if (projectile.kind === "big") {
      ctx.strokeStyle = projectile.color;
      ctx.lineWidth = 7;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(0, 0, projectile.size + 16 + Math.sin(performance.now() / 60) * 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.rotate(performance.now() / 280);
      for (let i = 0; i < 6; i += 1) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(projectile.size + 10, 0);
        ctx.lineTo(projectile.size + 24, 0);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = projectile.color;
    ctx.beginPath();
    ctx.arc(0, 0, projectile.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = projectile.coreColor;
    ctx.font = `900 ${Math.max(20, projectile.kind === "big" ? 32 - projectile.label.length : 40 - projectile.label.length * 2)}px ui-rounded, system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(projectile.label, 0, 1);
    ctx.restore();
  });
}

function drawRings() {
  state.rings.forEach((ring) => {
    const alpha = Math.max(0, ring.life / ring.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = ring.width;
    ctx.shadowColor = ring.color;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
}

function drawParticles() {
  state.particles.forEach((particle) => {
    ctx.globalAlpha = Math.max(0, particle.life);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function drawFloatingTexts() {
  state.floatingTexts.forEach((item) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, item.life / item.maxLife);
    ctx.fillStyle = item.color;
    ctx.strokeStyle = "#17324d";
    ctx.lineWidth = 5;
    ctx.font = "900 42px ui-rounded, system-ui";
    ctx.textAlign = "center";
    ctx.strokeText(item.text, item.x, item.y);
    ctx.fillText(item.text, item.x, item.y);
    ctx.restore();
  });
}

function drawScreenFlashes() {
  state.screenFlashes.forEach((item) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, item.life / item.maxLife);
    ctx.fillStyle = item.color;
    ctx.fillRect(-40, -40, canvas.width + 80, canvas.height + 80);
    ctx.restore();
  });
}

function loop(now) {
  const delta = Math.min(0.033, (now - state.lastTime) / 1000);
  state.lastTime = now;
  update(delta, now);
  draw();
  syncDebugState();
  requestAnimationFrame(loop);
}

function syncDebugState() {
  const heroSheetsLoaded = Object.values(spriteImages.heroActions).every((image) => image.complete && image.naturalWidth > 0);
  const kaijuSheetsLoaded = Object.values(spriteImages.kaijuActions).every((image) => image.complete && image.naturalWidth > 0);
  document.body.dataset.heroAction = state.heroAction;
  document.body.dataset.monsterAction = state.monsterAction;
  document.body.dataset.heroSheetsLoaded = String(heroSheetsLoaded);
  document.body.dataset.kaijuActionSheetsLoaded = String(kaijuSheetsLoaded);
}

document.addEventListener("game-debug-start", (event) => {
  startGame(event.detail?.hero || "nova");
});

document.addEventListener("game-debug-force-actions", (event) => {
  const detail = event.detail || {};
  setActorAction("hero", detail.heroAction || "idle", 3);
  setActorAction("monster", detail.monsterAction || "idle", 3);
  syncDebugState();
});

document.querySelectorAll(".character-choice").forEach((button) => {
  button.addEventListener("click", () => selectHero(button.dataset.hero));
});

document.querySelectorAll(".difficulty-choice").forEach((button) => {
  button.addEventListener("click", () => selectDifficulty(button.dataset.difficulty));
});

ui.answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleAnswer(ui.answerInput.value);
});

ui.startButton.addEventListener("click", startSelectedGame);
ui.refreshWordButton.addEventListener("click", refreshCurrentWord);
ui.micButton.addEventListener("click", toggleMic);
ui.musicButton.addEventListener("click", toggleMusic);
ui.restartButton.addEventListener("click", restartGame);
ui.musicVolume.addEventListener("input", () => {
  state.musicVolume = Number(ui.musicVolume.value) / 100;
  updateAudioVolumes();
});
ui.sfxVolume.addEventListener("input", () => {
  state.sfxVolume = Number(ui.sfxVolume.value) / 100;
  updateAudioVolumes();
});

window.__gameDebug = {
  actionIndex,
  startGame,
  setActorAction,
  getState() {
    return {
      started: state.started,
      hero: state.hero,
      heroAction: state.heroAction,
      monsterAction: state.monsterAction,
      level: state.level,
      playerHp: state.playerHp,
      monsterHp: state.monsterHp,
      difficulty: state.difficulty,
      challenge: state.challenge,
    };
  },
  assetStatus() {
    const imageStatus = (image) => ({
      complete: Boolean(image?.complete),
      width: image?.naturalWidth || 0,
      height: image?.naturalHeight || 0,
    });
    return {
      heroActions: Object.fromEntries(Object.entries(spriteImages.heroActions).map(([key, image]) => [key, imageStatus(image)])),
      kaijuActions: Object.fromEntries(Object.entries(spriteImages.kaijuActions).map(([key, image]) => [key, imageStatus(image)])),
    };
  },
  forceActions(heroAction, monsterAction) {
    setActorAction("hero", heroAction, 3);
    setActorAction("monster", monsterAction, 3);
  },
  submitAnswer(value) {
    handleAnswer(value);
  },
  createDebugChallenge(owner = "player") {
    return createChallenge(owner);
  },
  refreshCurrentWord,
};

initProgress();
selectHero(state.selectedHero);
selectDifficulty(state.difficulty);
selectLevel(state.selectedLevel);
setupRecognition();
if (window.location.protocol === "file:") {
  ui.micButton.textContent = "請用 localhost";
  ui.heardText.textContent = "語音請用 http://localhost:5173 開啟，直接開 HTML 會反覆要求麥克風權限";
}
updateHud();
requestAnimationFrame(loop);

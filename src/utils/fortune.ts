// src/utils/fortune.ts

function seededRand(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

export const FORTUNE_LEVELS = [
  { label:'大吉', emoji:'🌟', color:'#f59e0b' },
  { label:'中吉', emoji:'✨', color:'#34d399' },
  { label:'吉',   emoji:'🍀', color:'#60a5fa' },
  { label:'小吉', emoji:'🌸', color:'#a78bfa' },
  { label:'末吉', emoji:'🌙', color:'#8b89a8' },
  { label:'凶',   emoji:'🌧', color:'#f87171' },
];

const FORTUNE_MESSAGES: Record<string, string[]> = {
  '大吉':['今日は何をやっても絶好調！積極的に動くと良いことが。','運気が頂点に。思い切った決断が吉と出る日。','周りからの評価も高まる一日。自信を持って行動しよう。'],
  '中吉':['全体的に流れが良い日。コツコツ動くと成果が出る。','対人運◎ 誰かと話すと新しいヒントが見つかるかも。','午後から運気が上昇。焦らず着実に進もう。'],
  '吉':  ['穏やかで安定した一日。無理せず過ごすのがベスト。','小さな気遣いが後で大きなプラスになる日。','いつも通りが一番。丁寧に過ごすと運が味方する。'],
  '小吉':['油断は禁物だけど、丁寧に動けばちゃんと報われる。','ひと呼吸おいてから行動すると結果が変わってくる。','小さな幸せを見逃さないで。それが積み重なる日。'],
  '末吉':['今日は守りの日。派手な動きより準備に徹しよう。','焦らなくてOK。じっくり考える時間に使うと吉。','運気の充電期間。今日の休息が明日の力になる。'],
  '凶':  ['ちょっと注意が必要な日。慎重に、ゆっくりと。','無理に動かず、周りを観察することに集中しよう。','今日のモヤモヤは一時的。明日は必ず上向くはず！'],
};

const LUCKY_ITEMS = ['☕ コーヒー','🍵 緑茶','🌸 桜色のもの','📚 本','🎵 音楽','🌿 観葉植物','🧢 帽子','👟 スニーカー','🌊 水色のもの','🍊 みかん','🕯 キャンドル','📝 手帳','🌙 月モチーフ','⭐ 星型のもの','🍫 チョコレート','🌺 花','🎨 赤いもの','💛 黄色いもの','🪴 多肉植物','🧣 マフラー','💎 アクセサリー','🍋 レモン','🎋 竹','🔮 丸いもの','🌈 カラフルなもの','🗝 鍵モチーフ','🧸 ぬいぐるみ','🪙 小銭','📿 数珠・ブレスレット','🌻 ひまわり'];
const LUCKY_COLORS = [{name:'ゴールド',hex:'#f59e0b'},{name:'ラベンダー',hex:'#a78bfa'},{name:'エメラルド',hex:'#34d399'},{name:'スカイブルー',hex:'#60a5fa'},{name:'コーラルピンク',hex:'#f472b6'},{name:'サンセットオレンジ',hex:'#fb923c'},{name:'ミントグリーン',hex:'#6ee7b7'},{name:'ローズレッド',hex:'#f87171'},{name:'パールホワイト',hex:'#f1f5f9'},{name:'ネイビー',hex:'#818cf8'},{name:'テラコッタ',hex:'#d97706'},{name:'セージグリーン',hex:'#a3e635'}];
const LUCKY_NUMBERS = [1,2,3,4,5,6,7,8,9,11,12,15,17,21,24,33];

export function getTodayFortune(birthDate: Date) {
  const today = new Date();
  const tk = today.getFullYear()*10000+(today.getMonth()+1)*100+today.getDate();
  const dk = birthDate.getFullYear()*10000+(birthDate.getMonth()+1)*100+birthDate.getDate();
  const rand = seededRand((tk ^ dk) * 31 + tk);
  const weights = [5,15,25,25,20,10];
  const total = weights.reduce((a,b)=>a+b,0);
  let r = rand() * total, li = 0;
  for (let i=0;i<weights.length;i++) { r-=weights[i]; if(r<=0){li=i;break;} }
  const level = FORTUNE_LEVELS[li];
  const msgs  = FORTUNE_MESSAGES[level.label];
  return {
    level,
    message: msgs[Math.floor(rand()*msgs.length)],
    item:    LUCKY_ITEMS[Math.floor(rand()*LUCKY_ITEMS.length)],
    color:   LUCKY_COLORS[Math.floor(rand()*LUCKY_COLORS.length)],
    number:  LUCKY_NUMBERS[Math.floor(rand()*LUCKY_NUMBERS.length)],
    luck:  (li===0?85:li===5?20:40)+Math.floor(rand()*30),
    love:  30+Math.floor(rand()*60),
    work:  30+Math.floor(rand()*60),
    money: 30+Math.floor(rand()*60),
  };
}

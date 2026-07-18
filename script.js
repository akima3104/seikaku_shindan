/* ============================================================
   せいかく診断 - データ定義
   5つのステータス(積極性/忍耐力/発想力/思いやり/俊敏さ)の
   「一番伸びている値」と「一番低い値」の組み合わせから
   25種類のタイプを診断するロジック。
   ============================================================ */

const TRAITS = {
  atk: { label: "積極性", short: "積極" },
  def: { label: "忍耐力", short: "忍耐" },
  spa: { label: "発想力", short: "発想" },
  spd: { label: "思いやり", short: "思いやり" },
  spe: { label: "俊敏さ", short: "俊敏" },
};

// レーダーチャートに描く順番(五角形の頂点、上から時計回り)
const TRAIT_ORDER = ["atk", "def", "spa", "spd", "spe"];

const QUESTIONS = [
  { trait: "atk", text: "自分の意見は、はっきりと相手に伝える方だ" },
  { trait: "atk", text: "人と競い合うことに、やりがいを感じる" },
  { trait: "atk", text: "グループの中では、自分から前に出て引っ張ることが多い" },

  { trait: "def", text: "困難なことでも、最後まで粘り強くやり遂げる" },
  { trait: "def", text: "地道な作業やコツコツ続けることが苦にならない" },
  { trait: "def", text: "すぐに結果が出なくても、辛抱強く続けられる" },

  { trait: "spa", text: "人とは違う、独自のアイデアを思いつくことが多い" },
  { trait: "spa", text: "常識にとらわれず、自由な発想で物事を考える" },
  { trait: "spa", text: "芸術や創作活動に強く惹かれる" },

  { trait: "spd", text: "相手の気持ちの変化に、敏感に気づく方だ" },
  { trait: "spd", text: "争いごとやもめごとは、できるだけ避けたい" },
  { trait: "spd", text: "周りの人を思いやる気持ちを、何よりも大切にしている" },

  { trait: "spe", text: "何かを決めるとき、スピード重視で判断する" },
  { trait: "spe", text: "思い立ったら、すぐに行動に移すタイプだ" },
  { trait: "spe", text: "せっかちだと、人からよく言われる" },
  { trait: "spe", text: "じっくり考えるより、まず動いてみることが多い" },
];

const LIKERT = [
  { value: 1, label: "全くそう思わない" },
  { value: 2, label: "あまりそう思わない" },
  { value: 3, label: "どちらとも言えない" },
  { value: 4, label: "ややそう思う" },
  { value: 5, label: "とてもそう思う" },
];

// key: "上がるステータス-下がるステータス"
const NATURES = {
  "atk-atk": { name: "がんばりや", tagline: "地に足のついた努力家", desc: "どんな場面でも真正面から粘り強く取り組む、バランスの取れたタイプ。特別に尖った部分がない分、誰とでも自然体で付き合える。" },
  "atk-def": { name: "さみしがり", tagline: "情熱的なリーダー", desc: "自分の意志を強く押し出し、周りを引っ張っていく力がある一方で、コツコツと粘り強く続けることは後回しになりがち。" },
  "atk-spa": { name: "いじっぱり", tagline: "曲げない意志の人", desc: "一度決めたことは最後までやり抜く芯の強さを持つが、突飛な発想や柔軟な方向転換はやや苦手。" },
  "atk-spd": { name: "やんちゃ", tagline: "自由奔放なチャレンジャー", desc: "思い立ったら積極的に前へ進む行動力があるが、周囲への気配りは二の次になりやすい。" },
  "atk-spe": { name: "ゆうかん", tagline: "堂々たる挑戦者", desc: "物おじせず堂々と前に出る度胸の持ち主だが、スピード勝負や瞬発的な対応はあまり得意でない。" },

  "def-atk": { name: "ずぶとい", tagline: "動じない盾", desc: "何があっても粘り強く踏ん張れる忍耐力が持ち味だが、自分の意見を強く主張するのは控えめ。" },
  "def-def": { name: "すなお", tagline: "誠実な守り手", desc: "コツコツと物事を積み重ねる、素直で忍耐強いタイプ。目立たないが信頼を積み重ねていく。" },
  "def-spa": { name: "わんぱく", tagline: "頼れるマイペース", desc: "粘り強さで周囲を安心させる存在だが、奇抜な発想やひらめきはあまり得意でない。" },
  "def-spd": { name: "のうてんき", tagline: "楽天的などっしり屋", desc: "何事にも動じず、粘り強くマイペースを貫くタイプだが、繊細な気配りやフォローはやや苦手。" },
  "def-spe": { name: "のんき", tagline: "ゆったり忍耐タイプ", desc: "焦らず粘り強く構えることができる反面、スピード感のある対応には欠ける。" },

  "spa-atk": { name: "ひかえめ", tagline: "静かな発想家", desc: "独創的なアイデアを内に秘めているが、それを強く主張するのは苦手で、控えめに振る舞う。" },
  "spa-def": { name: "おっとり", tagline: "自由な夢想家", desc: "ユニークな着想にあふれた発想力の持ち主だが、地道にコツコツ続ける粘り強さはやや弱い。" },
  "spa-spa": { name: "てれや", tagline: "気まぐれな創造者", desc: "発想力に富み、独自の世界観を持っているが、それをどう表現するかはその時の気分次第。" },
  "spa-spd": { name: "うっかりや", tagline: "無邪気なひらめき屋", desc: "斬新な発想を次々と生み出せるのが持ち味だが、周囲への配慮を忘れがち。" },
  "spa-spe": { name: "れいせい", tagline: "冷静な着想家", desc: "じっくりアイデアを練り上げるタイプで、勢い任せの行動には出にくい。" },

  "spd-atk": { name: "おだやか", tagline: "穏やかな聞き役", desc: "人の気持ちに寄り添うのが得意な、優しく穏やかな性格。ただし自己主張は控えめ。" },
  "spd-def": { name: "おとなしい", tagline: "静かな思いやり屋", desc: "優しさと思いやりを兼ね備えたタイプだが、物事をコツコツ続ける粘り強さにはやや欠ける。" },
  "spd-spa": { name: "しんちょう", tagline: "気配り上手な慎重派", desc: "周囲への配慮が細やかで信頼されやすいが、突飛な発想を出すのはあまり得意でない。" },
  "spd-spd": { name: "きまぐれ", tagline: "つかみどころのない優しさ", desc: "思いやりのある性格だが、その時々の気分で振る舞いや表現の仕方が変わりやすい。" },
  "spd-spe": { name: "なまいき", tagline: "マイペースな共感者", desc: "人の気持ちをしっかり汲み取れるが、スピード感のある行動にはあまり向かない。" },

  "spe-atk": { name: "おくびょう", tagline: "慎重なスピード派", desc: "フットワークが軽く反応も早いが、自分の意見を強く主張するのは苦手。" },
  "spe-def": { name: "せっかち", tagline: "せかせか行動派", desc: "素早く動くのが得意な反面、コツコツ粘り強く続けることはあまり得意でない。" },
  "spe-spa": { name: "ようき", tagline: "明るい瞬発力タイプ", desc: "スピーディーに動くムードメーカーだが、独創的な発想を出すのはやや苦手。" },
  "spe-spd": { name: "むじゃき", tagline: "天真爛漫な行動派", desc: "素早く無邪気に動く行動力があるが、周囲への配慮は後回しになりがち。" },
  "spe-spe": { name: "まじめ", tagline: "実直な行動派", desc: "何事にもすぐ着手できる、まっすぐで誠実なタイプ。特別な弱点が目立たないバランス型。" },
};

/* ============================================================
   状態管理
   ============================================================ */
const state = {
  index: 0,
  answers: new Array(QUESTIONS.length).fill(null),
};

const els = {
  screenIntro: document.getElementById("screen-intro"),
  screenQuiz: document.getElementById("screen-quiz"),
  screenResult: document.getElementById("screen-result"),
  btnStart: document.getElementById("btn-start"),
  btnBack: document.getElementById("btn-back"),
  btnRetry: document.getElementById("btn-retry"),
  btnSaveImage: document.getElementById("btn-save-image"),
  btnShareX: document.getElementById("btn-share-x"),
  progressFill: document.getElementById("progress-fill"),
  progressLabel: document.getElementById("progress-label"),
  traitTag: document.getElementById("quiz-trait-tag"),
  question: document.getElementById("quiz-question"),
  options: document.getElementById("quiz-options"),
  resultName: document.getElementById("result-name"),
  resultTagline: document.getElementById("result-tagline"),
  resultDesc: document.getElementById("result-desc"),
  resultPentagon: document.getElementById("result-pentagon"),
  resultStats: document.getElementById("result-stats"),
};

function showScreen(el) {
  [els.screenIntro, els.screenQuiz, els.screenResult].forEach((s) =>
    s.classList.remove("is-active")
  );
  el.classList.add("is-active");
}

function renderQuestion() {
  const q = QUESTIONS[state.index];
  els.traitTag.textContent = `STATUS: ${TRAITS[q.trait].label}`;
  els.question.textContent = q.text;
  els.progressFill.style.width = `${(state.index / QUESTIONS.length) * 100}%`;
  els.progressLabel.textContent = `Q${state.index + 1} / ${QUESTIONS.length}`;
  els.btnBack.disabled = state.index === 0;

  els.options.innerHTML = "";
  LIKERT.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.innerHTML = `<span class="quiz-option-num">${opt.value}</span><span>${opt.label}</span>`;
    btn.addEventListener("click", () => selectAnswer(opt.value));
    els.options.appendChild(btn);
  });
}

function selectAnswer(value) {
  state.answers[state.index] = value;
  if (state.index < QUESTIONS.length - 1) {
    state.index += 1;
    renderQuestion();
  } else {
    computeResult();
  }
}

function goBack() {
  if (state.index > 0) {
    state.index -= 1;
    renderQuestion();
  }
}

function computeAverages() {
  const sums = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  const counts = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  QUESTIONS.forEach((q, i) => {
    sums[q.trait] += state.answers[i] ?? 3;
    counts[q.trait] += 1;
  });
  const avgs = {};
  Object.keys(sums).forEach((k) => (avgs[k] = sums[k] / counts[k]));
  return avgs;
}

function computeResult() {
  const avgs = computeAverages();
  const keys = Object.keys(avgs);
  let upKey = keys[0];
  let downKey = keys[0];
  keys.forEach((k) => {
    if (avgs[k] > avgs[upKey]) upKey = k;
    if (avgs[k] < avgs[downKey]) downKey = k;
  });

  // 差が僅かな場合はバランス型(対角線=同じステータス)として扱う
  if (avgs[upKey] - avgs[downKey] < 0.4) {
    downKey = upKey;
  }

  const nature = NATURES[`${upKey}-${downKey}`];
  renderResult(nature, avgs, upKey, downKey);
}

function buildPentagonPoints(values, cx, cy, maxR) {
  // values: {atk,def,spa,spd,spe} 1-5 -> 0-1 に正規化して座標を出す
  const angleStep = (Math.PI * 2) / TRAIT_ORDER.length;
  return TRAIT_ORDER.map((key, i) => {
    const ratio = Math.max(0, Math.min(1, (values[key] - 1) / 4));
    const r = maxR * (0.18 + ratio * 0.82);
    const angle = -Math.PI / 2 + i * angleStep;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function buildOutlinePoints(cx, cy, maxR) {
  const angleStep = (Math.PI * 2) / TRAIT_ORDER.length;
  return TRAIT_ORDER.map((_, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const x = cx + maxR * Math.cos(angle);
    const y = cy + maxR * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function renderResult(nature, avgs, upKey, downKey) {
  els.resultName.textContent = nature.name;
  els.resultTagline.textContent = nature.tagline;
  els.resultDesc.textContent = nature.desc;

  const cx = 110, cy = 110, r = 92;
  const fillPoints = buildPentagonPoints(avgs, cx, cy, r);
  const outlinePoints = buildOutlinePoints(cx, cy, r);

  const labelPositions = TRAIT_ORDER.map((key, i) => {
    const angle = -Math.PI / 2 + i * ((Math.PI * 2) / TRAIT_ORDER.length);
    const lx = cx + (r + 20) * Math.cos(angle);
    const ly = cy + (r + 20) * Math.sin(angle);
    return `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" class="pentagon-label">${TRAITS[key].short}</text>`;
  }).join("");

  els.resultPentagon.innerHTML = `
    <svg viewBox="0 0 220 220">
      <polygon points="${outlinePoints}" class="pentagon-outline"></polygon>
      <polygon points="${fillPoints}" class="pentagon-fill"></polygon>
      ${labelPositions}
    </svg>`;

  const style = document.createElement("style");
  style.textContent = `
    .pentagon-outline{ fill:none; stroke:#efe4e8; stroke-width:1.5; }
    .pentagon-fill{ fill:#ff6f9122; stroke:#ff6f91; stroke-width:2.5; transition: all .6s ease; }
    .pentagon-label{ font-family:"M PLUS Rounded 1c",sans-serif; font-weight:700; font-size:11px; fill:#8c8797; }
  `;
  els.resultPentagon.appendChild(style);

  els.resultStats.innerHTML = TRAIT_ORDER.map((key) => {
    const val = avgs[key];
    const filledCount = Math.max(1, Math.min(5, Math.round(val)));
    const cls = key === upKey && upKey !== downKey ? "is-up" : key === downKey && upKey !== downKey ? "is-down" : "";
    const segments = Array.from({ length: 5 }, (_, i) =>
      `<span class="segment ${i < filledCount ? `filled ${cls}` : ""}"></span>`
    ).join("");
    return `
      <div class="stat-row">
        <span class="stat-label">${TRAITS[key].label}</span>
        <span class="stat-segments">${segments}</span>
        <span class="stat-value">${val.toFixed(1)}</span>
      </div>`;
  }).join("");

  const shareText = `【せいかく診断】私のタイプは「${nature.name}」でした!\n${nature.tagline}\n#せいかく診断`;
  els.btnShareX.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  showScreen(els.screenResult);
}

function resetQuiz() {
  state.index = 0;
  state.answers = new Array(QUESTIONS.length).fill(null);
  renderQuestion();
  showScreen(els.screenQuiz);
}

async function saveResultImage() {
  const target = document.getElementById("result-card");
  const originalLabel = els.btnSaveImage.textContent;
  els.btnSaveImage.textContent = "画像を作成中...";
  els.btnSaveImage.disabled = true;
  try {
    const canvas = await html2canvas(target, {
      backgroundColor: "#fffaf5",
      scale: 2,
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = `せいかく診断_${els.resultName.textContent}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    els.btnSaveImage.textContent = "保存に失敗しました";
    setTimeout(() => (els.btnSaveImage.textContent = originalLabel), 1800);
    els.btnSaveImage.disabled = false;
    return;
  }
  els.btnSaveImage.textContent = originalLabel;
  els.btnSaveImage.disabled = false;
}

els.btnStart.addEventListener("click", () => {
  showScreen(els.screenQuiz);
  renderQuestion();
});
els.btnBack.addEventListener("click", goBack);
els.btnRetry.addEventListener("click", resetQuiz);
els.btnSaveImage.addEventListener("click", saveResultImage);

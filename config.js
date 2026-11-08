/* =====================================================================
 *  麻辣烫价格大挑战！ — 게임 설정 파일 (선생님용)
 * ---------------------------------------------------------------------
 *  ✏️ 이 부분만 고치면 재료·가격·제한 시간을 바꿀 수 있습니다.
 *  (배포된 index.html 안에도 이 블록이 그대로 들어 있어서,
 *   GitHub에서 index.html을 직접 수정해도 바로 반영됩니다.)
 *
 *  - id     : 영어 고유 이름 (그림과 연결됨, 바꾸지 마세요)
 *             새 재료를 추가하면 그림 대신 emoji가 표시됩니다.
 *  - zh     : 중국어 이름
 *  - pinyin : 병음 (주문서에 표시)
 *  - ko     : 한국어 뜻 (주문서에는 숨김, 결과 화면에만 표시)
 *  - price  : 가격 (元)
 *  - group  : 주문서 구역 (meat / ball / veg / staple)
 * ===================================================================== */
window.MALATANG_CONFIG = {
  // 주문서 제한 시간(초). 주소 뒤에 ?time=90 을 붙여도 바꿀 수 있음
  time: 60,

  // (결과 화면에서 목표 가격을 입력했을 때) 차이가 이 값(元) 이하이면 "太棒了！非常接近！"
  closeRange: 3,

  ingredients: [
    { id: "beef",      zh: "牛肉",     pinyin: "niúròu",        ko: "소고기",   price: 5, group: "meat" },
    { id: "lamb",      zh: "羊肉",     pinyin: "yángròu",       ko: "양고기",   price: 5, group: "meat" },
    { id: "shrimp",    zh: "虾",       pinyin: "xiā",           ko: "새우",     price: 4, group: "meat" },
    { id: "sausage",   zh: "香肠",     pinyin: "xiāngcháng",    ko: "소시지",   price: 3, group: "meat" },
    { id: "niuwa",     zh: "牛蛙",     pinyin: "niúwā",         ko: "황소개구리", price: 6, group: "meat" },
    { id: "maodu",     zh: "毛肚",     pinyin: "máodǔ",         ko: "천엽(소 위)", price: 5, group: "meat" },
    { id: "wucanrou",  zh: "午餐肉",   pinyin: "wǔcānròu",      ko: "런천미트(햄)", price: 3, group: "meat" },
    { id: "yaxue",     zh: "鸭血",     pinyin: "yāxuè",         ko: "오리 선지", price: 3, group: "meat" },

    { id: "fishball",  zh: "鱼丸",     pinyin: "yúwán",         ko: "어묵",     price: 3, group: "ball" },
    { id: "meatball",  zh: "丸子",     pinyin: "wánzi",         ko: "완자",     price: 3, group: "ball" },
    { id: "fuzhu",     zh: "腐竹",     pinyin: "fǔzhú",         ko: "푸주",     price: 3, group: "ball" },
    { id: "tofu",      zh: "豆腐",     pinyin: "dòufu",         ko: "두부",     price: 2, group: "ball" },
    { id: "quailegg",  zh: "鹌鹑蛋",   pinyin: "ānchúndàn",     ko: "메추리알", price: 2, group: "ball" },
    { id: "yudoufu",   zh: "鱼豆腐",   pinyin: "yúdòufu",       ko: "생선 두부", price: 2, group: "ball" },
    { id: "xiebang",   zh: "蟹棒",     pinyin: "xièbàng",       ko: "게맛살",   price: 2, group: "ball" },

    { id: "qingcai",   zh: "青菜",     pinyin: "qīngcài",       ko: "청경채",   price: 1, group: "veg" },
    { id: "baicai",    zh: "白菜",     pinyin: "báicài",        ko: "배추",     price: 1, group: "veg" },
    { id: "enoki",     zh: "金针菇",   pinyin: "jīnzhēngū",     ko: "팽이버섯", price: 1, group: "veg" },
    { id: "potato",    zh: "土豆",     pinyin: "tǔdòu",         ko: "감자",     price: 2, group: "veg" },
    { id: "lotus",     zh: "莲藕",     pinyin: "lián'ǒu",       ko: "연근",     price: 2, group: "veg" },
    { id: "muer",      zh: "木耳",     pinyin: "mù'ěr",         ko: "목이버섯", price: 2, group: "veg" },
    { id: "haidai",    zh: "海带",     pinyin: "hǎidài",        ko: "다시마",   price: 1, group: "veg" },

    { id: "fentiao",   zh: "粉条",     pinyin: "fěntiáo",       ko: "당면",     price: 2, group: "staple" },
    { id: "kuanfen",   zh: "宽粉",     pinyin: "kuānfěn",       ko: "넓적 당면", price: 2, group: "staple" },
    { id: "noodles",   zh: "方便面",   pinyin: "fāngbiànmiàn",  ko: "라면",     price: 2, group: "staple" },
    { id: "niangao",   zh: "芝士年糕", pinyin: "zhīshì niángāo", ko: "치즈떡",  price: 3, group: "staple" },
  ],

  // 맵기 (가격 없음, 하나만 선택). level 0~3 → 국물 색이 달라짐
  spice: [
    { id: "bula",    zh: "不辣", pinyin: "bú là",    ko: "안 매운맛",   level: 0 },
    { id: "weila",   zh: "微辣", pinyin: "wēi là",   ko: "약간 매운맛", level: 1 },
    { id: "zhongla", zh: "中辣", pinyin: "zhōng là", ko: "중간 매운맛", level: 2 },
    { id: "tela",    zh: "特辣", pinyin: "tè là",    ko: "아주 매운맛", level: 3 },
  ],

  // 주문서 구역 이름
  groups: [
    { id: "meat",   zh: "荤菜类",     ko: "고기 · 해산물" },
    { id: "ball",   zh: "丸子 · 豆制品", ko: "완자 · 콩 제품" },
    { id: "veg",    zh: "蔬菜 · 菌菇",  ko: "채소 · 버섯" },
    { id: "staple", zh: "主食类",     ko: "면 · 떡" },
  ],
};

/*
 * MEGI MINT app archive data
 *
 * 새 앱을 추가할 때는 아래 MEGI_MINT_APPS 배열에 객체 하나만 추가하면
 * 메인 화면의 앱 카드/모바일 앱 목록/번호/PRODUCT 개수가 자동으로 갱신됩니다.
 *
 * accent1 / accent2는 선택값입니다.
 * - 앱 고유 색상이 있으면 직접 지정합니다.
 * - 생략하면 MEGI_MINT_APP_ACCENTS 팔레트가 앱 순서대로 자동 순환됩니다.
 *
 * 각 앱의 메인 카드 문구는 locales.en / locales.ko / locales.ja에서 관리합니다.
 * 상세 소개와 개인정보처리방침의 본문 번역은 각 앱 전용 폴더에서 관리합니다.
 * 상세/방침 HTML 파일은 각각 apps/, privacy/ 아래에 두고
 * appUrl / privacyUrl 경로를 연결합니다.
 */
var MEGI_MINT_APP_ACCENTS = [
  { accent1: "#FFF4D8", accent2: "#EEE9FF" },
  { accent1: "#E2F8F2", accent2: "#EAF3FF" },
  { accent1: "#FFE9E0", accent2: "#F3E9FF" },
  { accent1: "#E7F6FF", accent2: "#E9EEFF" },
  { accent1: "#EFF7DF", accent2: "#FFF0DA" },
  { accent1: "#FCEAF2", accent2: "#EEE9FF" }
];

var MEGI_MINT_APPS = [
  {
    id: "oneulchai",
    image: "img/apps/oneulchai/symbol.png",
    appUrl: "apps/oneulchai.html",
    privacyUrl: "privacy/oneulchai.html",
    accent1: "#FFF1CE",
    accent2: "#E8E2FF",
    locales: {
      en: {
        name: "DayDelta",
        nameSecondary: "OneulChai",
        category: "DAILY PATTERNS",
        tagline: "Predict, reflect, and discover your day",
        description: "Record what you expect from your day, reflect on how it went, and discover your personal patterns.",
        imageAlt: "DayDelta app icon"
      },
      ko: {
        name: "오늘차이",
        nameSecondary: "OneulChai",
        category: "DAILY PATTERN",
        tagline: "예상하고, 돌아보며 알아가는 나의 하루",
        description: "오늘을 예상하고 하루를 돌아보며, 나만의 패턴을 기록하는 앱입니다.",
        imageAlt: "오늘차이 앱 심볼"
      },
      ja: {
        name: "今日のちがい",
        nameSecondary: "OneulChai",
        category: "日々のパターン",
        tagline: "予想して、振り返って、見つける自分の一日",
        description: "一日の予想と振り返りを記録し、自分だけのパターンを見つけるアプリです。",
        imageAlt: "今日のちがい アプリアイコン"
      }
    }
  }
];

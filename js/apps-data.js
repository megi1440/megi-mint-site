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
 * 상세 페이지와 개인정보처리방침 페이지는 각각 apps/, privacy/ 아래에
 * 별도 HTML 파일을 만든 뒤 appUrl / privacyUrl 경로만 연결합니다.
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
    name: "오늘차이",
    nameEn: "OneulChai",
    category: "DAILY PATTERN",
    tagline: "예상하고, 돌아보며 알아가는 나의 하루",
    description: "오늘을 예상하고 하루를 돌아보며, 나만의 패턴을 기록하는 앱입니다.",
    image: "img/apps/oneulchai/symbol.png",
    imageAlt: "오늘차이 앱 심볼",
    appUrl: "apps/oneulchai.html",
    privacyUrl: "privacy/oneulchai.html",
    accent1: "#FFF1CE",
    accent2: "#E8E2FF"
  }
];

/**
 * 日本語の都市名から英語の都市名へのマッピング
 * OpenWeatherMap APIは英語の都市名のみ対応しているため、
 * 日本語入力をサポートするための変換テーブル
 */

type CityMapping = {
  [key: string]: string;
};

/**
 * 日本の主要都市の日英対応表
 * キー: 日本語の都市名（漢字、ひらがな、カタカナ）
 * 値: 英語の都市名
 */
export const CITY_NAME_MAP: CityMapping = {
  // 東京
  '東京': 'Tokyo',
  'とうきょう': 'Tokyo',
  'トウキョウ': 'Tokyo',

  // 大阪
  '大阪': 'Osaka',
  'おおさか': 'Osaka',
  'オオサカ': 'Osaka',

  // 京都
  '京都': 'Kyoto',
  'きょうと': 'Kyoto',
  'キョウト': 'Kyoto',

  // 名古屋
  '名古屋': 'Nagoya',
  'なごや': 'Nagoya',
  'ナゴヤ': 'Nagoya',

  // 札幌
  '札幌': 'Sapporo',
  'さっぽろ': 'Sapporo',
  'サッポロ': 'Sapporo',

  // 福岡
  '福岡': 'Fukuoka',
  'ふくおか': 'Fukuoka',
  'フクオカ': 'Fukuoka',

  // 神戸
  '神戸': 'Kobe',
  'こうべ': 'Kobe',
  'コウベ': 'Kobe',

  // 横浜
  '横浜': 'Yokohama',
  'よこはま': 'Yokohama',
  'ヨコハマ': 'Yokohama',

  // 広島
  '広島': 'Hiroshima',
  'ひろしま': 'Hiroshima',
  'ヒロシマ': 'Hiroshima',

  // 仙台
  '仙台': 'Sendai',
  'せんだい': 'Sendai',
  'センダイ': 'Sendai',

  // 千葉
  '千葉': 'Chiba',
  'ちば': 'Chiba',
  'チバ': 'Chiba',

  // 川崎
  '川崎': 'Kawasaki',
  'かわさき': 'Kawasaki',
  'カワサキ': 'Kawasaki',

  // さいたま
  'さいたま': 'Saitama',
  'サイタマ': 'Saitama',

  // 北九州
  '北九州': 'Kitakyushu',
  'きたきゅうしゅう': 'Kitakyushu',
  'キタキュウシュウ': 'Kitakyushu',

  // 新潟
  '新潟': 'Niigata',
  'にいがた': 'Niigata',
  'ニイガタ': 'Niigata',

  // 浜松
  '浜松': 'Hamamatsu',
  'はままつ': 'Hamamatsu',
  'ハママツ': 'Hamamatsu',

  // 熊本
  '熊本': 'Kumamoto',
  'くまもと': 'Kumamoto',
  'クマモト': 'Kumamoto',

  // 静岡
  '静岡': 'Shizuoka',
  'しずおか': 'Shizuoka',
  'シズオカ': 'Shizuoka',

  // 岡山
  '岡山': 'Okayama',
  'おかやま': 'Okayama',
  'オカヤマ': 'Okayama',

  // 鹿児島
  '鹿児島': 'Kagoshima',
  'かごしま': 'Kagoshima',
  'カゴシマ': 'Kagoshima',

  // 長崎
  '長崎': 'Nagasaki',
  'ながさき': 'Nagasaki',
  'ナガサキ': 'Nagasaki',

  // 金沢
  '金沢': 'Kanazawa',
  'かなざわ': 'Kanazawa',
  'カナザワ': 'Kanazawa',

  // 那覇
  '那覇': 'Naha',
  'なは': 'Naha',
  'ナハ': 'Naha',

  // 奈良
  '奈良': 'Nara',
  'なら': 'Nara',
  'ナラ': 'Nara',
};

/**
 * 日本語の都市名を英語に変換する
 * マッピングに存在しない場合は元の文字列をそのまま返す
 * @param cityName 都市名（日本語または英語）
 * @returns 英語の都市名
 */
export function translateCityName(cityName: string): string {
  const trimmedCity = cityName.trim();
  return CITY_NAME_MAP[trimmedCity] || trimmedCity;
}

/**
 * 都市名が日本語のマッピングに存在するかチェック
 * @param cityName 都市名
 * @returns マッピングに存在する場合はtrue
 */
export function isMappedCity(cityName: string): boolean {
  return cityName.trim() in CITY_NAME_MAP;
}

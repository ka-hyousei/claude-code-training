/**
 * 多言語の都市名から英語の都市名へのマッピング
 * OpenWeatherMap APIは英語の都市名のみ対応しているため、
 * 日本語・中国語・韓国語入力をサポートするための変換テーブル
 */

type CityMapping = {
  [key: string]: string;
};

/**
 * 主要都市の多言語対応表
 * キー: 現地語の都市名（漢字、ひらがな、カタカナ、簡体字、繁体字、ハングル）
 * 値: 英語の都市名
 */
export const CITY_NAME_MAP: CityMapping = {
  // ============================================
  // 日本の主要都市
  // ============================================
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

  // ============================================
  // 中国の主要都市
  // ============================================

  // 北京 (Beijing)
  '北京': 'Beijing',
  'běijīng': 'Beijing',
  'ペキン': 'Beijing',
  'ベイジン': 'Beijing',

  // 上海 (Shanghai)
  '上海': 'Shanghai',
  'shànghǎi': 'Shanghai',
  'シャンハイ': 'Shanghai',

  // 広州 (Guangzhou)
  '广州': 'Guangzhou',
  '廣州': 'Guangzhou',
  'guǎngzhōu': 'Guangzhou',
  'カントン': 'Guangzhou',

  // 深圳 (Shenzhen)
  '深圳': 'Shenzhen',
  'shēnzhèn': 'Shenzhen',
  'シンセン': 'Shenzhen',

  // 成都 (Chengdu)
  '成都': 'Chengdu',
  'chéngdū': 'Chengdu',
  'セイト': 'Chengdu',

  // 杭州 (Hangzhou)
  '杭州': 'Hangzhou',
  'hángzhōu': 'Hangzhou',
  'ハンジョウ': 'Hangzhou',

  // 武漢 (Wuhan)
  '武汉': 'Wuhan',
  '武漢': 'Wuhan',
  'wǔhàn': 'Wuhan',
  'ブカン': 'Wuhan',

  // 西安 (Xi\'an)
  '西安': 'Xi\'an',
  'xīān': 'Xi\'an',
  'シーアン': 'Xi\'an',

  // 南京 (Nanjing)
  '南京': 'Nanjing',
  'nánjīng': 'Nanjing',
  'ナンキン': 'Nanjing',

  // 重慶 (Chongqing)
  '重庆': 'Chongqing',
  '重慶': 'Chongqing',
  'chóngqìng': 'Chongqing',
  'チョンチン': 'Chongqing',

  // 天津 (Tianjin)
  '天津': 'Tianjin',
  'tiānjīn': 'Tianjin',
  'テンシン': 'Tianjin',

  // 香港 (Hong Kong)
  '香港': 'Hong Kong',
  'xiānggǎng': 'Hong Kong',
  'ホンコン': 'Hong Kong',

  // 台北 (Taipei)
  '台北': 'Taipei',
  '臺北': 'Taipei',
  'táiběi': 'Taipei',
  'タイペイ': 'Taipei',

  // ============================================
  // 韓国の主要都市
  // ============================================

  // ソウル (Seoul)
  '서울': 'Seoul',
  'ソウル': 'Seoul',
  '首爾': 'Seoul',

  // 釜山 (Busan)
  '부산': 'Busan',
  'プサン': 'Busan',
  '釜山': 'Busan',

  // 仁川 (Incheon)
  '인천': 'Incheon',
  'インチョン': 'Incheon',
  '仁川': 'Incheon',

  // 大邱 (Daegu)
  '대구': 'Daegu',
  'テグ': 'Daegu',
  '大邱': 'Daegu',

  // 大田 (Daejeon)
  '대전': 'Daejeon',
  'テジョン': 'Daejeon',
  '大田': 'Daejeon',

  // 光州 (Gwangju)
  '광주': 'Gwangju',
  'クァンジュ': 'Gwangju',
  '光州': 'Gwangju',

  // 済州 (Jeju)
  '제주': 'Jeju',
  'チェジュ': 'Jeju',
  '濟州': 'Jeju',

  // ============================================
  // その他アジアの主要都市
  // ============================================

  // シンガポール
  'シンガポール': 'Singapore',
  '新加坡': 'Singapore',
  'xīnjiāpō': 'Singapore',

  // バンコク (Thailand)
  'バンコク': 'Bangkok',
  '曼谷': 'Bangkok',

  // クアラルンプール (Malaysia)
  'クアラルンプール': 'Kuala Lumpur',
  '吉隆坡': 'Kuala Lumpur',

  // ジャカルタ (Indonesia)
  'ジャカルタ': 'Jakarta',
  '雅加达': 'Jakarta',

  // マニラ (Philippines)
  'マニラ': 'Manila',
  '马尼拉': 'Manila',

  // ハノイ (Vietnam)
  'ハノイ': 'Hanoi',
  '河内': 'Hanoi',

  // ホーチミン (Vietnam)
  'ホーチミン': 'Ho Chi Minh City',
  '胡志明市': 'Ho Chi Minh City',
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

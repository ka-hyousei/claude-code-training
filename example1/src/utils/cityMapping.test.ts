import { translateCityName, isMappedCity, CITY_NAME_MAP } from './cityMapping';

describe('cityMapping', () => {
  describe('translateCityName', () => {
    it('日本語の都市名（漢字）を英語に変換する', () => {
      expect(translateCityName('東京')).toBe('Tokyo');
      expect(translateCityName('大阪')).toBe('Osaka');
      expect(translateCityName('京都')).toBe('Kyoto');
    });

    it('日本語の都市名（ひらがな）を英語に変換する', () => {
      expect(translateCityName('とうきょう')).toBe('Tokyo');
      expect(translateCityName('おおさか')).toBe('Osaka');
      expect(translateCityName('きょうと')).toBe('Kyoto');
    });

    it('日本語の都市名（カタカナ）を英語に変換する', () => {
      expect(translateCityName('トウキョウ')).toBe('Tokyo');
      expect(translateCityName('オオサカ')).toBe('Osaka');
      expect(translateCityName('キョウト')).toBe('Kyoto');
    });

    it('中国語の都市名（簡体字）を英語に変換する', () => {
      expect(translateCityName('北京')).toBe('Beijing');
      expect(translateCityName('上海')).toBe('Shanghai');
      expect(translateCityName('广州')).toBe('Guangzhou');
    });

    it('中国語の都市名（繁体字）を英語に変換する', () => {
      expect(translateCityName('臺北')).toBe('Taipei');
      expect(translateCityName('廣州')).toBe('Guangzhou');
    });

    it('中国語の都市名（ピンイン）を英語に変換する', () => {
      expect(translateCityName('běijīng')).toBe('Beijing');
      expect(translateCityName('shànghǎi')).toBe('Shanghai');
    });

    it('韓国語の都市名（ハングル）を英語に変換する', () => {
      expect(translateCityName('서울')).toBe('Seoul');
      expect(translateCityName('부산')).toBe('Busan');
      expect(translateCityName('인천')).toBe('Incheon');
    });

    it('韓国語の都市名（カタカナ）を英語に変換する', () => {
      expect(translateCityName('ソウル')).toBe('Seoul');
      expect(translateCityName('プサン')).toBe('Busan');
    });

    it('マッピングに存在しない都市名はそのまま返す', () => {
      expect(translateCityName('London')).toBe('London');
      expect(translateCityName('Paris')).toBe('Paris');
      expect(translateCityName('New York')).toBe('New York');
    });

    it('前後の空白を除去して変換する', () => {
      expect(translateCityName('  東京  ')).toBe('Tokyo');
      expect(translateCityName(' 大阪 ')).toBe('Osaka');
    });

    it('空文字列の場合は空文字列を返す', () => {
      expect(translateCityName('')).toBe('');
      expect(translateCityName('   ')).toBe('');
    });
  });

  describe('isMappedCity', () => {
    it('マッピングに存在する都市名の場合はtrueを返す', () => {
      expect(isMappedCity('東京')).toBe(true);
      expect(isMappedCity('とうきょう')).toBe(true);
      expect(isMappedCity('トウキョウ')).toBe(true);
    });

    it('マッピングに存在しない都市名の場合はfalseを返す', () => {
      expect(isMappedCity('London')).toBe(false);
      expect(isMappedCity('Paris')).toBe(false);
    });

    it('前後の空白を除去してチェックする', () => {
      expect(isMappedCity('  東京  ')).toBe(true);
      expect(isMappedCity(' London ')).toBe(false);
    });
  });

  describe('CITY_NAME_MAP', () => {
    it('主要都市のマッピングが定義されている', () => {
      // 各都市に対して漢字、ひらがな、カタカナの3パターンが存在することを確認
      const majorCities = ['東京', 'とうきょう', 'トウキョウ'];
      majorCities.forEach(city => {
        expect(CITY_NAME_MAP[city]).toBeDefined();
        expect(CITY_NAME_MAP[city]).toBe('Tokyo');
      });
    });

    it('すべてのマッピングの値が文字列である', () => {
      Object.values(CITY_NAME_MAP).forEach(value => {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });
});

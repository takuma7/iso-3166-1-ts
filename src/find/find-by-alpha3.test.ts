import { findByAlpha3 } from './find-by-alpha3';

test('findByAlpha3', () => {
  expect(findByAlpha3('USA')).toMatchInlineSnapshot(`
    Object {
      "alpha2": "US",
      "alpha3": "USA",
      "name": "United States of America (the)",
      "name_fr": "États-Unis d'Amérique (les)",
      "numeric": "840",
    }
  `);
  expect(findByAlpha3('usa')).toMatchInlineSnapshot(`
    Object {
      "alpha2": "US",
      "alpha3": "USA",
      "name": "United States of America (the)",
      "name_fr": "États-Unis d'Amérique (les)",
      "numeric": "840",
    }
  `);
  expect(findByAlpha3('US')).toBeUndefined();
  expect(findByAlpha3('us')).toBeUndefined();
  expect(findByAlpha3('')).toBeUndefined();
  expect(findByAlpha3('ZZZ')).toBeUndefined();
});

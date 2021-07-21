import { findByAlpha2 } from './find-by-alpha2';

test('findByAlpha2', () => {
  expect(findByAlpha2('US')).toMatchInlineSnapshot(`
    Object {
      "alpha2": "US",
      "alpha3": "USA",
      "name": "United States of America (the)",
      "name_fr": "États-Unis d'Amérique (les)",
      "numeric": "840",
    }
  `);
  expect(findByAlpha2('us')).toMatchInlineSnapshot(`
    Object {
      "alpha2": "US",
      "alpha3": "USA",
      "name": "United States of America (the)",
      "name_fr": "États-Unis d'Amérique (les)",
      "numeric": "840",
    }
  `);
  expect(findByAlpha2('jp')).toMatchInlineSnapshot(`
    Object {
      "alpha2": "JP",
      "alpha3": "JPN",
      "name": "Japan",
      "name_fr": "Japon (le)",
      "numeric": "392",
    }
  `);
  console.log(findByAlpha2('jp'));
  expect(findByAlpha2('USA')).toBeUndefined();
  expect(findByAlpha2('usa')).toBeUndefined();
  expect(findByAlpha2('')).toBeUndefined();
  expect(findByAlpha2('zz')).toBeUndefined();
});

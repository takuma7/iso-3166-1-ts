import { findByNumeric } from './find-by-numeric';

test('findByAlpha3', () => {
  expect(findByNumeric(840)).toMatchInlineSnapshot(`
    Object {
      "alpha2": "US",
      "alpha3": "USA",
      "name": "United States of America (the)",
      "name_fr": "États-Unis d'Amérique (les)",
      "numeric": "840",
    }
  `);
  expect(findByNumeric('840')).toMatchInlineSnapshot(`
    Object {
      "alpha2": "US",
      "alpha3": "USA",
      "name": "United States of America (the)",
      "name_fr": "États-Unis d'Amérique (les)",
      "numeric": "840",
    }
  `);
  expect(findByNumeric('004')).toMatchInlineSnapshot(`
    Object {
      "alpha2": "AF",
      "alpha3": "AFG",
      "name": "Afghanistan",
      "name_fr": "Afghanistan (l')",
      "numeric": "004",
    }
  `);
  expect(findByNumeric(4)).toMatchInlineSnapshot(`
    Object {
      "alpha2": "AF",
      "alpha3": "AFG",
      "name": "Afghanistan",
      "name_fr": "Afghanistan (l')",
      "numeric": "004",
    }
  `);
  expect(findByNumeric('')).toBeUndefined();
  expect(findByNumeric(0)).toBeUndefined();
  expect(findByNumeric(1234)).toBeUndefined();
});

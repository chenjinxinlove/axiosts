import { isDate, isPlainObject, isFormData, isURLSearchParams } from "../../../../../Desktop/资料-1/ts-axios/src/helpers/util";

describe('helpers:util', () => {
  describe('isXX', () => {
    test('should validate Date', () => {
      expect(isDate(new Date())).toBeTruthy();
      expect(isDate(Date.now())).toBeFalsy();
    })

    test('should validate PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy();
      expect(isPlainObject(new Date())).toBeFalsy();
    })

    test('should validate FormData', () => {
      expect(isFormData(new FormData())).toBeTruthy();
      expect(isFormData({})).toBeFalsy();
    })

    test('should validata URLSearchParams', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy();
      expect(isURLSearchParams('foo=1&bar=2')).toBeFalsy();
    })
  })
})

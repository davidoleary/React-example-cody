import { expect } from 'chai';

import { isValidBarcode, isCharCodeNumerical, isEnterKey } from './utils';

describe('utils', () => {
  // isValidBarcode
  describe('isValidBarcode', () => {
    it('Should return true if passed an integer between 1 and 13 digits', () => {
      expect(isValidBarcode(0)).to.be.true;
      expect(isValidBarcode(1234567890123)).to.be.true;
      expect(isValidBarcode(12345)).to.be.true;
    });

    it('Should return false if passed nothing, or anything except a number', () => {
      expect(isValidBarcode()).to.be.false;
      expect(isValidBarcode("string")).to.be.false;
      expect(isValidBarcode(undefined)).to.be.false;
      expect(isValidBarcode({})).to.be.false;
      expect(isValidBarcode([])).to.be.false;
    });

    it('Should return false if passed a non integer', () => {
      expect(isValidBarcode(0.7)).to.be.false;
      expect(isValidBarcode(1.6)).to.be.false;
      expect(isValidBarcode(123.4)).to.be.false;
    });

    it('Should return false if passed an integer longer than 13 characters', () => {
      expect(isValidBarcode(12345678901234567890)).to.be.false;
    });
  });

  // isCharCodeNumerical
  describe('isCharCodeNumerical', () => {
    it('Should return true if passed an (integer) keycode that corresponds to a number key', () => {
      // keycode 52 === number 4 on keyboard
      expect(isCharCodeNumerical(52)).to.be.true;
    });

    it('Should return false if not passed a valid numerical keycode value', () => {
      expect(isCharCodeNumerical()).to.be.false;
      expect(isCharCodeNumerical("string")).to.be.false;
      expect(isCharCodeNumerical(undefined)).to.be.false;
      expect(isCharCodeNumerical({})).to.be.false;
      expect(isCharCodeNumerical([])).to.be.false;
      // keycode 74 === letter j on keyboard
      expect(isCharCodeNumerical(74)).to.be.false;
    });
  });

  // isEnterKey
  describe('isEnterKey', () => {
    it('Should return false if the value sent to isEnterKey is anything other than 13', () => {
      expect(isEnterKey(0)).to.be.false;
      expect(isEnterKey(12)).to.be.false;
      expect(isEnterKey()).to.be.false;
      expect(isEnterKey("string")).to.be.false;
      expect(isEnterKey(undefined)).to.be.false;
      expect(isEnterKey({})).to.be.false;
      expect(isEnterKey([])).to.be.false;
    });

    it('Should return true if isEnterKey is passed the enter keycode', () => {
      expect(isEnterKey(13)).to.be.true;
    });
  });

});
const getObjectKeyByValue = require('../../../../../app/routes/utils/get-object-key-by-value');

describe('getObjectKeyByValue', () => {
  it('should return the key for a given value in the object', () => {
    const object = { a: 1, b: 2, c: 3 };
    const value = 2;
    const expectedKey = 'b';

    const result = getObjectKeyByValue(object, value);

    expect(result).to.equal(expectedKey);
  });

  it('should return undefined if the value is not found in the object', () => {
    const object = { a: 1, b: 2, c: 3 };
    const value = 4;

    const result = getObjectKeyByValue(object, value);

    expect(result).to.be.undefined;
  });
  
});
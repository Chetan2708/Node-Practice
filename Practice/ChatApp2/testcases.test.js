const sum = require('./testcases'); 


describe('sum function', () => {
  test('should return the correct sum of two positive numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  test('should return the correct sum of a positive and a negative number', () => {
    expect(sum(5, -3)).toBe(2);
  });

  test('should return zero if both numbers are zero', () => {
    expect(sum(0, 0)).toBe(0);
  });

});

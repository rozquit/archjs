const sum = (a, b) => a + b

// eslint-disable-next-line no-undef
describe('Sample Test', () => {
  // eslint-disable-next-line no-undef
  it('should return 3 as the result of the function', () => {
    // set timeout to prevent false positives with tests
    // eslint-disable-next-line no-undef
    expect(sum(1, 2)).toBe(3)
  })
})

import { render } from '../src'

describe('template-engine:index', () => {
  test('index:render should replace the variable with the value in given context', () => {
    expect(render(`{% name %}`, { name: 'Roshan' })).toBe('Roshan')
  })

  test('index:render should replace variable inside html', () => {
    expect(render(`<h1>{% name %}</h1>`, { name: 'UlkaJS' })).toBe(
      '<h1>UlkaJS</h1>'
    )
  })

  test('index:render should skip the escape tags', () => {
    expect(render(`\\{% name %}`, { name: 'Roshan' })).toBe('{% name %}')
  })

  test('index:render should return empty string on `undefined`', () => {
    expect(render(`{% undefined %}`)).toBe('')
  })

  test('index:render should return the joined array', () => {
    expect(render(`{% [1, 2, 3, 4] %}`)).toBe('1234')
  })

  test('index:render variable declaration should work', () => {
    expect(render(`{% const name = "UlkaJs" %}{% name %}`).trim()).toBe(
      'UlkaJs'
    )
  })

  test('index:render, should include the included file', () => {
    expect(typeof render(`{% include("LICENSE") %}`)).toBe('string')
  })

  test('index:render should throw error on invalid base option', () => {
    expect(
      // @ts-ignore
      () => render(`{% include("LICENSE") %}`, {}, { base: null })
    ).toThrowError()
  })

  test('index:render should throw error on invalid include', () => {
    expect(() =>
      render(`{% include("somethingthatsnotfound") %}`)
    ).toThrowError()
  })
})

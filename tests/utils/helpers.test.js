const helpers = require("../../src/utils/helpers")
const path = require("path")

const cwd = process.cwd()

const { absolutePath, generateHash } = helpers

describe("Absolute path function", () => {
  test("Should return the absolute path", () => {
    const absPath = path
      .relative(cwd, absolutePath("/src/utils/helpers.js"))
      .split(path.sep)
      .join("/")

    expect(absPath).toBe("src/utils/helpers.js")
  })

  test("Should return current working directory in provded empty string", () => {
    const absPath = absolutePath("")

    expect(absPath).toBe(cwd)
  })

  test("Should throw an error if arg is not string", () => {
    expect(absolutePath).toThrow("Path provided should be string")
  })
})

describe("generateHash function", () => {
  test("should return hash from a string", () => {
    expect(generateHash("strongword")).not.toBe("strongword")
  })

  test("should return hash for empty string if noting provided", () => {
    expect(generateHash()).not.toBe("")
  })
})

describe("Should export the expected helpers function", () => {
  expect(helpers).toMatchInlineSnapshot(`
    Object {
      "absolutePath": [Function],
      "copyAssets": [Function],
      "generateHash": [Function],
      "getConfigs": [Function],
      "spinner": [Function],
    }
  `)
})

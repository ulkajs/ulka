const path = require("path")
const fs = require("fs")
const { allFiles, mkdir, rmdir } = require("../../../src/utils/ulka-fs")

const replaceSepWithSlash = file =>
  path.relative(__dirname, file).split(path.sep).join("/")

const allFilesTestDir = path.join(__dirname, "resources", "test-all-files")
const dirTestDir = path.join(__dirname, "resources", "test-dir")

describe("all files function", () => {
  test("should return the list of all files on ext-.js", () => {
    const files = allFiles(allFilesTestDir).map(replaceSepWithSlash)

    expect(files).toMatchInlineSnapshot(`
        Array [
          "resources/test-all-files/1-dir/1-1-dir/1-1.js",
          "resources/test-all-files/1-dir/1-1-dir/1-1.json",
          "resources/test-all-files/1-dir/1.js",
          "resources/test-all-files/1-dir/1.json",
          "resources/test-all-files/2-dir/2.js",
          "resources/test-all-files/2-dir/2.json",
        ]
      `)
  })

  test("should return the list of all .js files on ext=.js", () => {
    const files = allFiles(allFilesTestDir, ".js").map(replaceSepWithSlash)

    expect(files).toMatchInlineSnapshot(`
        Array [
          "resources/test-all-files/1-dir/1-1-dir/1-1.js",
          "resources/test-all-files/1-dir/1.js",
          "resources/test-all-files/2-dir/2.js",
        ]
      `)
  })

  test("should return the list of all files in ext array", () => {
    const files = allFiles(allFilesTestDir, [".js", ".json"]).map(
      replaceSepWithSlash
    )
    expect(files).toMatchInlineSnapshot(`
      Array [
        "resources/test-all-files/1-dir/1-1-dir/1-1.js",
        "resources/test-all-files/1-dir/1-1-dir/1-1.json",
        "resources/test-all-files/1-dir/1.js",
        "resources/test-all-files/1-dir/1.json",
        "resources/test-all-files/2-dir/2.js",
        "resources/test-all-files/2-dir/2.json",
      ]
    `)
  })

  test("should return filePath in a string of path to file is provided", () => {
    const files = allFiles(path.join(allFilesTestDir, "1-dir", "1.js")).map(
      replaceSepWithSlash
    )

    expect(files).toMatchInlineSnapshot(`
        Array [
          "resources/test-all-files/1-dir/1.js",
        ]
      `)
  })

  test("should throw error on fail", () => {
    expect(() => allFiles(path.join(allFilesTestDir, "hehe"))).toThrowError()
  })
})

describe("mkdir and rmdir function", () => {
  const createDir = path.join(dirTestDir, "recurse", "dir")
  const removeDir = path.join(dirTestDir, "recurse")

  test("should create directory", () => {
    mkdir(createDir)
    expect(fs.existsSync(createDir)).toBe(true)
  })

  test("should delete the directory and throw error if dir doesn't exist", () => {
    fs.writeFileSync(path.join(createDir, "index.html"), "Test String") // rmdir should delete this file too.

    rmdir(removeDir)
    expect(fs.existsSync(removeDir)).toBe(false)

    expect(() => rmdir(removeDir)).toThrow(
      `Provided directory ${removeDir} doesn't exist`
    )
  })
})

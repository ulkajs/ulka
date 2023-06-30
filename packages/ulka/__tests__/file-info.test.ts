import path from 'path'
import { FileInfo } from '../src/FileInfo'

describe('ulka:fileinfo', () => {
  test('fileinfo:buffer should be undefined if read is not called', () => {
    expect(new FileInfo(path.join(__dirname, 'index.test.ts')).buffer).toBe(
      undefined
    )
  })

  test('fileinfo:buffer should have buffer after read', async () => {
    expect(
      (await new FileInfo(path.join(__dirname, 'index.test.ts')).read())
        .buffer instanceof Buffer
    ).toBe(true)
  })

  test('fileinfo:read should return the object', async () => {
    expect(
      (await new FileInfo(
        path.join(__dirname, 'index.test.ts')
      ).read()) instanceof FileInfo
    ).toBe(true)
  })

  test('fileinfo:str should return empty string if read function is not called', () => {
    expect(new FileInfo(path.join(__dirname, 'index.test.ts')).str).toBe('')
  })

  test('fileinfo:str should return content if read function is called', async () => {
    const fileinfo = await new FileInfo(
      path.join(__dirname, 'index.test.ts')
    ).read()

    expect(fileinfo.str).not.toBe('')
  })

  test('fileinfo:parsedpath should give the parsed path', () => {
    expect(new FileInfo(__dirname).parsedpath).toEqual(path.parse(__dirname))
  })
})

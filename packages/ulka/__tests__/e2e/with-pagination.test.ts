import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import readdir from 'recursive-readdir'

import { build, setup } from '../../src'

const cwd = path.join(__dirname, 'resources', 'with-pagination')

beforeAll(async () => {
  const ulka = await setup(cwd, 'build', 'ulka-config.js')
  await build(ulka)
})

afterAll(() => {
  rimraf.sync(path.join(cwd, '_site'))
})

describe('e2e:with-pagination', () => {
  let files: string[] = []
  beforeAll(async () => {
    files = await readdir(path.join(cwd, '_site'))
  })

  test('should have all the paginated files written', async () => {
    expect(files.filter((f) => f.includes('page')).length).toEqual(3)
  })

  test('each files should have expected contents', () => {
    const contents = files
      .sort()
      .map((file) => fs.readFileSync(file, 'utf-8').replace(/\s/g, ''))
      .filter((f) => f)

    expect(contents).toEqual([
      '<h1>Post-1</h1><h1>Post-2</h1>',
      '<h1>Post-3</h1>',
      '<h1>1</h1><h1>2</h1><h1>3</h1><h1>4</h1>',
      '<h1>5</h1><h1>6</h1><h1>7</h1><h1>8</h1>',
      '<h1>9</h1><h1>10</h1>',
    ])
  })
})

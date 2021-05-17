import os from 'os'
import c from 'ansi-colors'

export function clearConsole() {
  console.clear()
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  )
}

export function getNetworkAddress() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const intrfce of interfaces[name]!) {
      const { address, family, internal } = intrfce
      if (family === 'IPv4' && !internal) {
        return address
      }
    }
  }
}

export function box(str: string, padding = 3) {
  const ch = {
    e: ' ',
    top: c.green('─'),
    left: c.green('│'),
    right: c.green('│'),
    bottom: c.green('─'),
    topLeft: c.green('╭'),
    topRight: c.green('╮'),
    bottomLeft: c.green('╰'),
    bottomRight: c.green('╯'),
  }

  const arr = str.split('\n').map((v, i, a) => {
    return i !== 0 && i !== a.length - 1 ? ch.e.repeat(padding) + v : v
  })

  const max = Math.max(...arr.map((l) => c.unstyle(l).length)) + padding

  if (process.stdout.columns < max + padding) return str.split('\n').join('\n ')

  return arr
    .map((l, i) => {
      const length = c.unstyle(l).length

      let left = ch.left
      let right = ch.right
      let space = ch.e.repeat(max - length)

      if (i === 0) {
        left = ch.topLeft
        right = ch.topRight
        space = ch.top.repeat(max - length)
      }

      if (i === arr.length - 1) {
        left = ch.bottomLeft
        right = ch.bottomRight
        space = ch.bottom.repeat(max - length)
      }

      return left + l + space + right
    })
    .join('\n')
}

import os from 'os'

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

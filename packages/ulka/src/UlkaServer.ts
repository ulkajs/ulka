import ws from 'ws'
import fs from 'fs'
import url from 'url'
import path from 'path'
import http from 'http'
import c from 'ansi-colors'
import mime from 'mime-types'
import getPort from 'get-port'

import { box, getNetworkAddress, liveReloadScript } from './utils'

export const ip = getNetworkAddress()
export class UlkaServer {
  public server: http.Server
  public wss: { send(data: string): void; reload(): void; reloadCss(): void }

  constructor(public base: string, public port: number) {
    this.server = this.createServer()
    this.wss = wsServer(this.server)
  }

  async findPort() {
    this.port = await getPort({
      port: getPort.makeRange(this.port, this.port + 10),
    })
    return this
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log('')
      this.log()
    })
  }

  private createServer() {
    return http.createServer(this.requestListener.bind(this))
  }

  private requestListener(req: http.IncomingMessage, res: http.ServerResponse) {
    const { pathname } = new url.URL(req.url!, `http://localhost:${this.port}`)

    let filepath = path.join(this.base, pathname)
    let exists = fs.existsSync(filepath)

    if (exists) {
      if (fs.statSync(filepath).isDirectory()) {
        exists = fs.existsSync(path.join(filepath, 'index.html'))
      }
    }

    if (!exists) {
      res.statusCode = 404
      let message = 'Not Found :('
      const possible404File = path.join(this.base, '404.html')
      if (fs.existsSync(possible404File)) {
        message = fs.readFileSync(possible404File, 'utf-8')
        res.setHeader('Content-Type', 'text/html')
      }
      return res.end(message)
    }

    if (fs.statSync(filepath).isDirectory()) {
      filepath = path.join(filepath, 'index.html')
    }

    let data: string | Buffer = fs.readFileSync(filepath)

    const { ext } = path.parse(filepath)

    if (ext === '.html') {
      data = data.toString() + liveReloadScript()
    }

    res.setHeader('Content-Type', mime.contentType(ext) || 'text/plain')
    res.end(data)
  }

  log() {
    const local = c.bold('- Local:    ') + `http://localhost:${this.port}`
    const network = c.bold('- Network:  ') + `http://${ip}:${this.port}`
    const listening = c.greenBright(`Listening...`)

    const log = box(`\n\n${listening}\n\n${local}\n${network}\n\n`)
    console.log(log)
  }
}

function wsServer(server: http.Server) {
  const wss = new ws.Server({ server })

  wss.on('connection', (socket) => socket.send('Live Server Connected'))

  return {
    send(data: string) {
      wss.clients.forEach((client) => client.send(data))
    },
    reload() {
      this.send('reload')
    },
    reloadCss() {
      this.send('reload-css')
    },
  }
}

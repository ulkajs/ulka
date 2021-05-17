import ws from 'ws'
import fs from 'fs'
import url from 'url'
import path from 'path'
import http from 'http'
import c from 'ansi-colors'
import mime from 'mime-types'
import getPort from 'get-port'

export class UlkaServer {
  public server: http.Server
  public wss: ReturnType<typeof wsServer>

  public middlewares: ((
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) => any)[] = []

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

    this.middlewares.forEach((m) => m(req, res))

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
    const local = `http://localhost:${this.port}`
    const listening = c.greenBright(`Listening...`)

    const log = `\n\n${listening}\n\n${local}\n\n`
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

function liveReloadScript() {
  return `<script>
if ('WebSocket' in window) {
  const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
  const address = protocol + window.location.host + window.location.pathname;
  const ws = new WebSocket(address);
      
  ws.addEventListener('message', e => {
    if(e.data === "reload"){
      location.reload()
    }else if(e.data === "reload-css"){
      const links = document.querySelectorAll("link[rel='stylesheet']")
      links.forEach(link => (link.href += ""))
    }else {
      console.log(e.data)
    }
  });
}else {
    console.warn("Your browser doesn't support websockets, so can't live reload")
}
</script>`
}

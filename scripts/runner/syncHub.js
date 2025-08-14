/* eslint-disable */
import http from 'http'
import { WebSocketServer } from 'ws'

const server = http.createServer((req,res)=>{ res.writeHead(200); res.end('ok') })
const wss = new WebSocketServer({ noServer: true })

const rooms = new Map() // roomId -> { leader: ws|null, followers: Set<ws> }

function getRoom(roomId){
  if (!rooms.has(roomId)) rooms.set(roomId, { leader: null, followers: new Set() })
  return rooms.get(roomId)
}

server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname !== '/ws') { socket.destroy(); return }
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, url)
  })
})

wss.on('connection', (ws, url) => {
  const roomId = url.searchParams.get('room') || 'default'
  const role = url.searchParams.get('role') || 'follower'
  const room = getRoom(roomId)
  if (role === 'leader'){
    room.leader = ws
  } else {
    room.followers.add(ws)
  }

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString())
      if (role === 'leader'){
        for (const f of room.followers){ try { f.send(JSON.stringify(msg)) } catch{} }
      }
    } catch{}
  })
  ws.on('close', () => {
    if (role === 'leader' && room.leader === ws) room.leader = null
    if (role !== 'leader') room.followers.delete(ws)
  })
})

const PORT = process.env.SYNC_PORT || 4700
server.listen(PORT, () => console.log('SyncHub listening on', PORT))
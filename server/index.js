const server = require('http').createServer((resquest, response) => {
    response.writeHead(204, { 
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Methods": 'OPTIONS, GET, POST',
    })
    response.end('hey there!')
})

const { emit } = require('process')
const socketIo = require('socket.io')
const io = socketIo(server, { 
    cors :{
        origin: '*',
        credentials: false
    }
})

io.on('connection', socket => {
    console.log('connection', socket.id)
    socket.on('join-room', (roomId, userId) => {
        // Adicionar Usuarios em uma mesma sala:
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
        socket.on('disconnect', () => {
            console.log('disconnected', roomId, userId)
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

const startServer = () => {
    const { address, port } = server.address()
    console.info(`app running at ${address}:${port}`)
}

server.listen(process.env.PORT || 3000, startServer)
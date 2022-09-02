const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')


    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.emit('message', {
            text: message,
            createdAt: new Date().getTime()

        });
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {

        io.emit('locationMessage', { text: `https://google.com/maps?q=${coords.latitude},${coords.longitude}`, createdAt: new Date().getTime() })

        callback()
    })

    socket.on('disconnect', (message) => {
        io.emit('message', { message: 'A user has left!', createdAt: new Date().getTime() })

    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
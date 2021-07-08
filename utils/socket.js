const http = require('http')
const io = require('socket.io')(http)

exports.socket = () => {
    io.on('connection',(socket)=>{
        console.log('Connected: ' + socket.userId )

        socket.on('disconnect', ()=>{
            console.log('Disconnected: ' + socket.userId)
        })
    })
}

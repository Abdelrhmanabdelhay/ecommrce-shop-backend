import {Server} from 'socket.io';

// Initialize Socket.IO
 export const webSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5000', // Adjust this to your frontend URL
        methods: ['GET', 'POST']
    }
});
// Socket.IO connection
let adminSocketId = [];
io.on('connection', (socket) => {
    console.log(`🔗 New client connected: ${socket.id}`);
    
    // Store admin socket ID
    socket.on('adminConnected', (data) => {
        adminSocketId.push(socket.id);
        console.log(`Admin connected: ${socket.id}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
        adminSocketId = adminSocketId.filter(id => id !== socket.id);
    });
}
);
    return io;
}
export const notfiyAdmin = (message,data) => {
    if (adminSocketId.length > 0) {
        adminSocketId.forEach((id) => {
            io.to(id).emit('notification', { message, data });
        });
    }
}
// // In server.js
// const jwt = require('jsonwebtoken');

// // Socket.io middleware for authentication
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) {
//     return next(new Error('Authentication error: Token not provided'));
//   }
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return next(new Error('Authentication error: Invalid token'));
//     }
//     socket.user = decoded; // Attach user info to the socket object
//     next();
//   });
// });

// // Then, in your 'sendMessage' handler, use the authenticated user ID
// socket.on('sendMessage', async ({ groupId, content }) => {
//     const senderId = socket.user.id; // Use the ID from the verified token
//     // ... rest of the logic
// });
const cfg = require('../cfg.json');

module.exports = () => {
    global.io.emit(global.floob.started ? 'playersOnline' : 'lobby', Object.values(io.sockets.clients().connected).map(socket => ({
        cardURL: socket.request.user.cardURL,
        avatarURL: socket.request.user.avatarURL,
        name: socket.request.username,
    })));
};
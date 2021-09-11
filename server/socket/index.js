const cfg = require('../cfg');
const appendToAvatarURL = '?size=15';

const start = require('./start');
const chat = require('./chat');
const vote = require('./vote');
const guess = require('./guess');
const playersOnline = require('./playersOnline');

function initIo (server, sessionStore) {
    const io = require('socket.io').listen(server);

    io.use(require('passport.socketio').authorize({
        key: 'floob.session',
        secret: cfg.secret,
        store: sessionStore,
        cookieParser: require('cookie-parser'),
        fail: (data, message, error, accept) => {accept(null, false);}, //If user is not logged in as a member, allow them to create a socket connection anyway
    }));

    io.on('connect', socket => {
        if (socket.request.user.logged_in) {
            if (Object.values(io.sockets.clients().connected).filter(sock => sock.request.user.id == socket.request.user.id).length > 1 && !cfg.dev) { //if there's already a socket logged in with this socket's user
                socket.emit('requireLogin');
                socket.disconnect();
            }
            if (socket.request.user.cardURL == undefined)
                socket.request.user.cardURL = `${cfg.identificatorHost}/card/${socket.request.user.id}.png?o=l&t=u&b&bg`;
            if (!socket.request.user.avatarURL.endsWith(appendToAvatarURL))
                socket.request.user.avatarURL += appendToAvatarURL;
            socket.emit('auth', socket.request.user);
        } else {
            socket.emit('requireLogin');
            socket.disconnect();
            return;
        }

        if (global.floob.started)
            socket.emit('start', global.floob.safe(true));

        setTimeout(playersOnline, 250);

        socket.on('start', start); 
        socket.on('chat', message => chat(message, socket));
        socket.on('vote', option => vote(option, socket));
        socket.on('guess', (aspect, opinion, on) => guess(aspect, opinion, on));

        socket.on('disconnect', playersOnline);
    });


    return io;
}

module.exports = initIo;
const fs = require('fs');

module.exports = (message, socket=null) => {
    if (global.floob && typeof message == 'string') {
        let stream = fs.createWriteStream('./log.txt', {
            flags: 'a',
            autoClose: true,
        });

        let msg;

        if (socket != null) {
            message = message.trim();
            if (message.length > 0 && message.length <= 99) {
                msg = {
                    message: message,
                    user: {
                        cardURL: socket.request.user.cardURL,
                        avatarURL: socket.request.user.avatarURL,
                        name: socket.request.username,
                    },
                };
            }
        } else {
            msg = {log: message};
        }

        if (msg != undefined) {
            global.io.emit('message', msg);
            stream.write(`\n${JSON.stringify(msg)}`);
        }

        stream.close();
    }
};
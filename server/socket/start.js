const fs = require('fs');
const numPath = '../floobNum.json';
const playersOnline = require('./playersOnline');

const Floob = require('../Floob');

module.exports = () => {
    if (global.floob.started) return;

    fs.writeFileSync('./log.txt', '');
    global.floob = new Floob();

    setTimeout(() => {
        global.io.emit('start', global.floob.safe(true));
        playersOnline();
        global.floob.new = false;
    }, 50);
};
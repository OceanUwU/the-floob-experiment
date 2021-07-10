module.exports = (aspect, opinion, on) => {
    if (global.floob && global.floob.aspectGuesses.hasOwnProperty(aspect) && (opinion === null || (Number.isInteger(opinion) && opinion >= -10 && opinion <= 10)) && typeof on == 'boolean') {
        global.floob.aspectGuesses[aspect] = global.floob.aspectGuesses[aspect].filter(o => o != opinion);
        if (on) global.floob.aspectGuesses[aspect].push(opinion);
        global.io.emit('aspectGuesses', global.floob.aspectGuesses);
    }
};
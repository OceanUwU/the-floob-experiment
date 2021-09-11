module.exports = (option, socket) => {
    if (global.floob && global.floob.allowVoting && (option == null || global.floob.options.hasOwnProperty(option))) {
        global.floob.votes = global.floob.votes.map(voteOption => {
            let index = voteOption.indexOf(socket.request.user.id)
            if (index > -1)
                voteOption.splice(index, 1);
            return voteOption;
        });
        if (option != null)
            global.floob.votes[option].push(socket.request.user.id);
        global.floob.emitUpdate();
    }
};
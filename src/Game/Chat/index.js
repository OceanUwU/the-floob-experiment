import React from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import PlayerIcon from '../../PlayerIcon';
import MessageInput from './MessageInput';
import { makeStyles } from '@material-ui/core/styles';
import socket from '../../socket';
import aspects from '../../data/aspects.json';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        right: 0,
        bottom: 0,
        width: '30%',
        height: 360,
        border: '1px solid #0000003f',
        background: 'aliceblue',
        borderTopLeftRadius: 7,
        zIndex: 9560,
    },

    online: {
        height: 17,
        overflowX: 'hidden',
        background: '#4287f53f',
        BorderBottom: '1px solid #0000002f',
        whiteSpace: 'nowrap',
    },

    chat: {
        height: 288,
        overflowY: 'scroll',
        wordBreak: 'break-word',
        paddingLeft: 5,
    },

    '@keyframes messageReceived': {
        '0%': {
            transform: 'scaleY(0)',
        },
        '100%': {
            transform: 'scaleY(1)',
        },
    },

    newMessage: {
        animation: `$messageReceived 250ms ${theme.transitions.easing.easeInOut}`
    },

    input: {
        whiteSpace: 'nowrap',
    },
}));

function formatText(text) {
    let words = text.split(' ')
    return (
        <span>{words.map((word, index) => {
            let space = index == 0 ? '' : ' ';
            if (word.startsWith('#')) {
                let hashtag = word.replace(/\W/g,'').toLowerCase();
                let aspect = null;
                if (aspects.hasOwnProperty(hashtag))
                    aspect = hashtag
                else if (aspects.some(a => a == hashtag))
                    aspect = aspects.indexOf(aspects.find(a => a == hashtag))
                if (aspect != null)
                    return (<Tooltip title={`#${aspect} #${aspects[aspect]}`} PopperProps={{style: {zIndex: 100000}}}>
                        <span>{space}<img style={{verticalAlign: 'middle'}} height={20} src={`/img/aspects/${aspect}.png`} /></span>
                    </Tooltip>);
            }
            return `${space}${word}`;
        })}</span>
    );
}

export default function Chat(props) {
    const classes = useStyles();
    const chatRef = React.createRef();
    const [messages, setMessages] = React.useState(props.messages.split('\n').slice(1).map(message => ({...JSON.parse(message), new: 0})));
    const [online, setOnline] = React.useState([]);

    
    React.useEffect(() => {
        if (messages[messages.length-1].new == 2) {
            messages[messages.length-1].new = 1;
            setMessages(messages);
        }
        let children = chatRef.current.children;
        if (children.length > 0) {
            let lastMessage = children[children.length - 1];
            if (!lastMessage.seen) {
                lastMessage.seen = true;
                let scrollTopMax = chatRef.current.scrollHeight - chatRef.current.clientHeight - chatRef.current.clientTop;
                if (scrollTopMax - chatRef.current.scrollTop < lastMessage.clientHeight + 35) {
                    chatRef.current.scrollTop = scrollTopMax;
                }
            } else {
                lastMessage.classList.remove(classes.online);
            }
        }
    });

    React.useEffect(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight - chatRef.current.clientHeight - chatRef.current.clientTop;

        socket.on('message', message => setMessages(prevMessages => {
            prevMessages[prevMessages.length-1].new = 0;
            message.new = 2;
            prevMessages.push(message);
            return JSON.parse(JSON.stringify(prevMessages));
        }));
        socket.on('playersOnline', players => {
            setOnline(players);
            setMessages(prevMessages => [...prevMessages.map(prevMessage => ({...prevMessage, new: 0}))]);
        });

        return () => {
            socket.off('message');
            socket.off('playersOnline');
        };
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.online}>
                {online.map(player => <PlayerIcon key={player.avatarURL} player={player} />)}
            </div>

            <div ref={chatRef} className={classes.chat}>
                {messages.map((message, index) => (
                    <div class={message.new == 2 ? classes.newMessage : null} key={index}>
                        {
                            message.hasOwnProperty('message')
                            ?
                            <div>
                                <Typography>
                                    <PlayerIcon player={message.user} showUsername/>
                                    : {formatText(message.message)}
                                </Typography>
                            </div>
                            :
                            <Typography color="textSecondary">{formatText(message.log)}</Typography>
                        }
                    </div>
                ))}
            </div>

            <div className={classes.input}>
                <MessageInput />
            </div>
        </div>
    );
};
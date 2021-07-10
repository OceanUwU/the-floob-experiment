import React from 'react';
import { Typography, Button } from '@material-ui/core';
import PlayerIcon from './PlayerIcon';
import socket from './socket';


export default function StartScreen(props) {
    return (
        <div style={{textAlign: 'center'}}>
            <Typography>
                <span>You're logged in as </span>
                <PlayerIcon player={socket.user} showUsername />
                <a href="/logout"> Logout</a>
            </Typography>

            <Typography>
                {props.players.length} player{props.players.length == 1 ? '' : 's'} waiting - {props.players.map(player => (<PlayerIcon key={player.id} player={player} />))}
            </Typography>

            <Button variant="contained" color="primary" onClick={() => socket.emit('start')}>Start</Button>
        </div>
    );
};
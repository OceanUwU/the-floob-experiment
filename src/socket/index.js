import React from 'react';
import ReactDOM from 'react-dom';
import socketIOClient from 'socket.io-client';

import LoginScreen from '../LoginScreen';
import StartScreen from '../StartScreen';
import DeathScreen from '../DeathScreen';
import Home from '../Home';
import Game from '../Game/';

var previousFloob = null;//{"day":1,"HP":-6,"maxHP":-4,"originalMaxHP":1,"happiness":-2,"clothing":"13","voteType":"Meal","votingAllowed":false,"options":["6","5"],"votes":[1,0],"voteTime":0,"name":"Floob 113","new":false,"aspectGuesses":[[-1, 1, null],[0, 3, null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null]],"messages":"\n{\"log\":\"Floob 113 was adopted!\"}\n{\"log\":\"===<<< Day 1 >>>===\"}\n{\"log\":\"positive message\"}\n{\"log\":\"negative message\"}\n{\"log\":\"positive message\"}","maxVoteTime":45,"opinions":[0,3,2,-2,-2,0,-1,-1,0,-1,-1,3,0,0,0,3,0,2,-1,1,0,-1,1,-1,1,-2,-3,1,0,-1]};

var socket = socketIOClient();

socket.on('connect', () => console.log('connected'));
//socket.on('disconnect', () => setTimeout(() => window.location.reload(), 1500));

socket.on('requireLogin', () => {
    socket.off('disconnect');
    socket.disconnect();
    ReactDOM.render(<div><LoginScreen /><Home /></div>, document.getElementById('root'));
});

socket.on('auth', user => socket.user = user);

socket.on('lobby', players => console.log(':D'));
socket.on('lobby', players => ReactDOM.render(<div>{previousFloob != null ? <DeathScreen floob={previousFloob} /> : null}<StartScreen players={players} /><Home /></div>, document.getElementById('root')));

socket.on('start', floob => ReactDOM.render(<Game floob={floob} />, document.getElementById('root')));

socket.on('die', floob => previousFloob = floob);

export default socket;
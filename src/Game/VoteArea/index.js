import React from 'react';
import { Typography, Box, Button, LinearProgress, Popover } from '@material-ui/core';
import socket from '../../socket';
import { makeStyles } from '@material-ui/core/styles';

import aspects from '../../data/aspects.json';
import clothes from '../../data/clothes.json';
import places from '../../data/places.json';
import toys from '../../data/toys.json';
import food from '../../data/food.json';
import AspectGuessing from './AspectGuessing';

const types = {
    'Clothing': 'clothes',
    'Place': 'places',
    'Toy': 'toys',
    'Meal': 'food',
    'Research?': 'yesno',
};
const typeObjects =  {
    'Clothing': clothes,
    'Place': places,
    'Toy': toys,
    'Meal': food,
    'Research?': [
        {
            name: 'no',
            filename: 'no',
            aspects: [],
        },
        {
            name: 'yes',
            filename: 'yes',
            aspects: [],
        }
    ],
}

const aspectImageSize = 50;
const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        width: '30%',
        left: 0,
        bottom: 0,
        zIndex: 100,
    },
    buttons: {
        display: 'flex',
    },
    voteArea: {
        height: 360,
        border: '1px solid #0000003f',
        background: 'aliceblue',
        borderTopRightRadius: 20,
    },
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },

    aspectContainer: {
        position: 'relative',
        display: 'inline-block'
    },
    effectImage: {
        position: 'relative',
        top: 10,
        left: 0,
        width: aspectImageSize,
        height: aspectImageSize,
    },
    aspectImage: {
        position: 'absolute',
        top: 10,
        left: 0,
        width: aspectImageSize,
        height: aspectImageSize,
    },
}));

function AspectIcon(props) {
    const classes = useStyles();

    return (
        <span className={classes.aspectContainer}>
            <img className={classes.effectImage} height={20} src={`/img/aspectEffects/${props.effect}.png`} />
            <img className={classes.aspectImage} height={20} src={`/img/aspects/${props.aspect}.png`} />
        </span>
    );
}

function Option(props) {
    const classes = useStyles();

    let [anchorEl, setAnchorEl] = React.useState(null);
    let handlePopoverOpen = event => setAnchorEl(event.currentTarget);
    let handlePopoverClose = () => setAnchorEl(null);
    let open = Boolean(anchorEl);

    //console.log(typeObjects[props.vote.type][props.vote.options[props.option]], props.vote.options[props.option], props.vote.options, props.option);

    let item;
    if (props.vote.type == 'Research') {
        item = typeObjects[props.vote.options[props.option][0]][props.vote.options[props.option][1]];
    } else
        item = typeObjects[props.vote.type][props.vote.options[props.option]];
    

    item.name = item.name[0].toUpperCase() + item.name.slice(1);

    return (
        <Box key={`${props.vote.type}${props.option}`} display="flex" alignItems="center">
            <Box minWidth={90}>
                <Button
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                    onClick={() => {
                        props.pick(props.option);
                        socket.emit('vote', Number(props.option));
                    }}
                    variant="outlined"
                    size="small"
                    color={props.picked == props.option ? 'secondary' : 'default'}
                    disabled={!props.vote.votingAllowed}
                >
                    <img
                        width={50}
                        height={50}
                        src={`/img/${types[props.vote.type == 'Research' ? props.vote.options[props.option][0] : props.vote.type]}/icons/${item.filename}.png`}
                        alt={item.name}
                    />
                </Button>

                <Popover
                    className={classes.popover}
                    classes={{paper: classes.paper}}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                >
                    <Typography variant="h6">{item.name}</Typography>
                    {(() => {
                        switch(props.vote.type) {
                            case 'Clothing':
                                return (
                                    <div>
                                        <Typography>Effects: {item.effects.length == 0 ? 'None' : item.effects.map(effect => <AspectIcon aspect={effect.aspect} effect={effect.direction} />)}</Typography>
                                        <Typography>Aspects: {item.aspects.length == 0 ? 'None' : item.aspects.map(aspect => <AspectIcon aspect={aspect} effect={'none'} />)}</Typography>
                                    </div>
                                );
                            
                            default:
                                return (
                                    <Typography>
                                        {item.aspects.map(aspect => (
                                            <AspectIcon aspect={aspect} effect={(() => {
                                                if (props.vote.clothing == null)
                                                    return 'none';
                                                else {
                                                    let effectFound = clothes[props.vote.clothing].effects.find(clothingEffect => clothingEffect.aspect == aspect);
                                                    if (effectFound == undefined)
                                                        return 'none';
                                                    else
                                                        return effectFound.direction;
                                                }
                                            })()} />
                                        ))}
                                    </Typography>
                                );
                        }
                    })()}
                </Popover>
            </Box>

            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" color="secondary" value={(props.vote.votes[props.option] / props.highestVote) * 100} />
            </Box>

            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{props.vote.votes[props.option]}</Typography>
            </Box>
        </Box>
    );
}

export default function VoteArea(props) {
    const classes = useStyles();

    let highestVote = props.vote.votes.reduce((a,b)=>a>b?a:b,1);
    let [picked, pick] = React.useState(null);

    React.useEffect(() => {
        socket.on('newVote', () => { //when a new ote starts
            pick(null); //set the client's picked option to none
        });

        return () => {
            socket.off('newVote');
        };
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.buttons}>
                <AspectGuessing aspectGuesses={props.aspectGuesses} />
            </div>

            <div className={classes.voteArea}>
                <Box display="flex" alignItems="center">
                    <Box width="100%" mr={1}>
                        <LinearProgress variant="determinate" color="primary" value={(props.vote.voteTime / props.vote.maxVoteTime) * 100} />
                    </Box>

                    <Box minWidth={65}>
                        <Typography variant="body2" color="textSecondary">{props.vote.voteTime}s/{props.vote.maxVoteTime}s</Typography>
                    </Box>
                </Box>

                <Typography variant="h4">{props.vote.type}</Typography>

                {Object.keys(props.vote.options).map(option => <Option vote={props.vote} option={option} picked={picked} pick={pick} highestVote={highestVote} />)}
            </div>
        </div>
    );
};
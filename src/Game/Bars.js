import React from 'react';
import { LinearProgress, Popover, Typography }  from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        border: '1px solid black',
        height: 15,
        borderRadius: '100px',
    },
    bar: {
        backgroundColor: '#0000ff',
    },
}))(LinearProgress);

const HalfLinearProgress = withStyles((theme) => ({
    root: {
        width: '50%',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
}))(BorderLinearProgress);

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        left: 10,
        top: 10,
        width: '20%',
        zIndex: 90,
    },
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
    HPbar: {backgroundColor: '#1a90ff'},
    negativeHappinessBar: {backgroundColor: '#ff0000'},
    positiveHappinessBar: {backgroundColor: '#00ff00'},
}));

export default function Bars(props) {
    const classes = useStyles();

    let [anchorEl1, setAnchorEl1] = React.useState(null);
    let handlePopoverOpen1 = event => setAnchorEl1(event.currentTarget);
    let handlePopoverClose1 = () => setAnchorEl1(null);
    let open1 = Boolean(anchorEl1);

    let [anchorEl2, setAnchorEl2] = React.useState(null);
    let handlePopoverOpen2 = event => setAnchorEl2(event.currentTarget);
    let handlePopoverClose2 = () => setAnchorEl2(null);
    let open2 = Boolean(anchorEl2);

    return (
        <div className={classes.root}>
            <Popover
                className={classes.popover}
                classes={{paper: classes.paper}}
                open={open1}
                anchorEl={anchorEl1}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose1}
                disableRestoreFocus
            >
                <Typography variant="h6">HP: {props.HP}/{props.maxHP} ({Math.round(props.HP/props.maxHP*100)}%)</Typography>
                <Typography>Each day, Floob loses 5 maximum HP from aging. Floob's original maximum HP was {props.originalMaxHP}.</Typography>
                <Typography>Hover over the happiness bar to learn how HP is gained and lost.</Typography>
                <Typography>At 0 HP, Floob dies.</Typography>
            </Popover>
            <div
                onMouseEnter={handlePopoverOpen1}
                onMouseLeave={handlePopoverClose1}
            >
                <BorderLinearProgress
                    classes={{bar: classes.HPbar}}
                    variant="determinate"
                    value={props.HP/props.originalMaxHP*100}
                />
                <span style={{
                    position: 'relative',
                    width: 1,
                    height: 15,
                    background: props.maxHP != props.originalMaxHP ? 'black' : '#00000000',
                    display: 'block',
                    marginLeft: -1,
                    left: `${props.maxHP/props.originalMaxHP*100}%`,
                    top: -15-1,
                }} />
            </div>


            <Popover
                className={classes.popover}
                classes={{paper: classes.paper}}
                open={open2}
                anchorEl={anchorEl2}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose2}
                disableRestoreFocus
            >
                <Typography variant="h6">Happiness: {props.happiness}</Typography>
                <Typography>Happiness ranges from -{20} to {20}.</Typography>
                <Typography>Happiness is gained and lost from doing actions. Each floob has a different opinion on every aspect (ranging from {-2} to {2}).</Typography>
                <Typography>Each aspect that Floob has to go through when doing any action will add its opinion of that aspect to its happiness.</Typography>
                <Typography>Most pieces of clothing have effects on them, which will modify Floob's opinion on the aspect they affect.</Typography>
                <Typography>Floob's happiness value is only updated at the end of the day. At that time, Floob's happiness is added to its HP.</Typography>
            </Popover>
            <div
                onMouseEnter={handlePopoverOpen2}
                onMouseLeave={handlePopoverClose2}
                style={{display: 'flex'}}
            >
                <HalfLinearProgress 
                    style={{transform: 'scaleX(-1)'}}
                    classes={{bar: classes.negativeHappinessBar}}
                    variant="determinate"
                    value={props.happiness < 0 ? -props.happiness/20*100 : 0}
                />
                <HalfLinearProgress 
                    style={{marginLeft: -2,}}
                    classes={{bar: classes.positiveHappinessBar}}
                    variant="determinate"
                    value={props.happiness > 0 ? props.happiness/20*100 : 0}
                />
            </div>
        </div>
    );
}
import React from 'react';
import socket from '../socket';
import { Popover, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clothes from '../data/clothes.json';
import places from '../data/places.json';
import toys from '../data/toys.json';
import foods from '../data/food.json';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        backgroundSize: 'auto 100vh',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top',
        backgroundColor: 'black',
        overflow: 'hidden',
    },

    floobDiv: {
        display: 'block',
        marginLeft: '50vw',
        transform: 'translateX(-50%)',
    },

    floobImage: {
        height: '100%',
        width: '100%',
        margin: '0 auto',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },

    floobOverlay: {
        height: '100%',
        width: '100%',
        margin: '0 auto',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
    },

    '@keyframes foodFade': {
        '0%': {
            opacity: 1,
        },
        '100%': {
            opacity: 0,
        },
    },

    foodImage: {
        animation: `$foodFade 2800ms linear`,
        opacity: 0,
    },
}));

const defaultEnvironment = {
    filename: 'home',
    floob: {
        size: 100,
        rotate: 0,
        x: 0,
        y: 15
    }
};

export default function FloobImage(props) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handlePopoverOpen = event => setAnchorEl(event.currentTarget);
    const handlePopoverClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);

    const clothing = props.clothing == null ? {
        name: 'undecided',
        filename: 'blank',
        effects: [],
        aspects: [],
    } : clothes[props.clothing];
    clothing.name = clothing.name[0].toUpperCase() + clothing.name.slice(1); //capitalise the first letter of the clothing's name

    const [environment, setEnvironment] = React.useState(defaultEnvironment);
    const [toy, setToy] = React.useState(-1);
    const [food, setFood] = React.useState(-1);

    React.useEffect(() => {
        socket.on('place', newPlace => setEnvironment(newPlace == -1 ? defaultEnvironment : places[newPlace]));
        socket.on('toy', newToy => setToy(newToy));
        socket.on('food', newFood => setFood(newFood));

        return () => {
            socket.off('place');
            socket.off('toy');
            socket.off('food');
        };
    }, []);

    return (
        <div
            className={classes.root}
            style={{
                backgroundImage: `url("/img/places/backgrounds/${environment.filename}.png")`,
            }}
        >
            <Popover
                className={classes.popover}
                classes={{paper: classes.paper}}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                onClose={handlePopoverClose}
                onClick={handlePopoverClose}
                disableRestoreFocus
                >
                <Typography variant="h6">{props.name}</Typography>
                <Typography>{props.age} day{props.age == 1 ? null : 's'} old</Typography>
                <Typography>Wearing: {clothing.name}</Typography>
            </Popover>

            <div
                className={classes.floobDiv}
                onClick={handlePopoverOpen}
                style={{
                    width: `${environment.floob.size}vh`,
                    height: `${environment.floob.size}vh`,
                }}
            >
                <img
                    className={classes.floobImage}
                    src="/img/floob.png"
                    style={{
                        marginLeft: `${environment.floob.x}vh`,
                        marginTop: `${environment.floob.y}vh`,
                        transform: `rotate(${environment.floob.rotate}deg)`,
                    }}
                />
                <img
                    className={classes.floobOverlay}
                    src={`/img/clothes/overlays/${clothing.filename}.png`}
                    style={{
                        marginLeft: `${environment.floob.x}vh`,
                        marginTop: `${environment.floob.y}vh`,
                        transform: `rotate(${environment.floob.rotate}deg)`,
                    }}
                />
                {toy == -1 ? null : 
                    <span className={classes.floobOverlay} style={{
                        marginLeft: `${environment.floob.x}vh`,
                        marginTop: `${environment.floob.y}vh`,
                        transform: `rotate(${environment.floob.rotate}deg)`,
                    }}>
                        <img
                            src={`/img/toys/icons/${toys[toy].filename}.png`}
                            style={{
                                width: '30%',
                                height: '30%',
                                marginLeft: '10%',
                                marginTop: '58%',
                                transform: 'rotate(30deg)',
                            }}
                        />
                    </span>
                }
                {food == -1 ? null : 
                    <span className={classes.floobOverlay} style={{
                        marginLeft: `${environment.floob.x}vh`,
                        marginTop: `${environment.floob.y}vh`,
                        transform: `rotate(${environment.floob.rotate}deg)`,
                    }}>
                        <img
                            className={classes.foodImage}
                            src={`/img/food/icons/${foods[food].filename}.png`}
                            style={{
                                width: '22%',
                                height: '22%',
                                marginLeft: '39%',
                                marginTop: '51%',
                            }}
                        />
                    </span>
                }
            </div>
        </div>
    );
}
import React from 'react';
import numberToText from 'number-to-text';
import 'number-to-text/converters/en-us';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const animationTime = 6000;

const useStyles = makeStyles((theme) => ({
    '@keyframes fade': {
        '0%': {
            opacity: 0,
        },
        '33%': {
            opacity: 1,
        },
        '67%': {
            opacity: 1,
        },
        '100%': {
            opacity: 0,
        },
    },

    root: {
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0,
        display: 'none',
        width: '100vw',
        height: '100vh',
        zIndex: 9500,
        background: 'black',
        animation: `$fade ${animationTime}ms ${theme.transitions.easing.easeInOut}`,

    },

    text: {
        color: 'white !important',
        fontFamily: '\'Great Vibes\', cursive',
        //fontStyle: 'italic',
        position: 'relative',
        textAlign: 'center',
        top: '50%',
        transform: 'translateY(-50%)',
    },
}));

var day = null;

export default function NewDay(props) {
    const classes = useStyles();

    let ref = React.createRef();

    React.useEffect(() => {
        if (props.day != day) {
            day = props.day;
            
            let current = ref.current;
            current.style.display = 'block';
            setTimeout(() => {
                current.style.display = 'none';
            }, animationTime-50);
        }
    });
    
    return (
        <div ref={ref} className={classes.root}>
            <Typography className={classes.text} variant="h1">Day {numberToText.convertToText(props.day)}</Typography>
        </div>
    );
};
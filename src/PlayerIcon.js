import React from 'react';
import { Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    profileImage: {
        border: '1px solid #0000007f',
        height: 15,
        borderRadius: 5,
        marginBottom: -4,
    },
    
    username: {
        fontSize: 14,
        fontVariant: 'small-caps',
    },

    popover: {
        pointerEvents: 'none',
    },
}));

export default function PlayerIcon(props) {
    const classes = useStyles();

    let [anchorEl, setAnchorEl] = React.useState(null);
    let handlePopoverOpen = event => setAnchorEl(event.currentTarget);
    let handlePopoverClose = () => setAnchorEl(null);
    let open = Boolean(anchorEl);

    return (
        <span>
            {/*<Tooltip title={<img src={props.player.cardURL} />} placement="top" PopperProps={{style: {zIndex: 100000}}}>*/}
            <img
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                className={classes.profileImage}
                src={props.player.avatarURL}
            />
            <Popover
                className={classes.popover}
                style={{zIndex: 100000, lineHeight: 0}}
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
                disableRestoreFocus
            >
                <img src={props.player.cardURL} />
            </Popover>
                {props.showUsername ? <span className={classes.username}>{props.player.name}</span> : null}
            {/*</Tooltip>*/}
        </span>
    );
};
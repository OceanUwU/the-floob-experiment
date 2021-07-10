import React from 'react';
import socket from '../../socket';
import PlayerIcon from '../../PlayerIcon';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

const maxMessageLength = 99;

const useStyles = theme => ({
    joinLabel: {
        display: 'inline-block',
        marginTop: 22,
        marginRight: 4,
    },
    textField: {
        width: '100%',
    },
    textInput: {
    },
});

class CodeInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
        };
        this.changeInput = this.changeInput.bind(this);
        this.tryCode = this.tryCode.bind(this);
        this.focusChat = this.focusChat.bind(this);
        this.inputRef = React.createRef();
    }

    changeInput(event) {
        this.setState({code: event.target.value});
    }

    tryCode() {
        this.setState({code: ''});
        setTimeout(() => this.inputRef.current.blur(), 0);
        socket.emit('chat', this.state.code);
    }

    focusChat(e) {
        if (e.key == 'Enter' && document.activeElement != this.inputRef.current)
            this.inputRef.current.focus();
    }

    componentDidMount() {
        document.addEventListener('keydown', this.focusChat);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.focusChat);
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <FormControl className={classes.textField} variant="filled">
                    <InputLabel htmlFor="messageInput">
                        <PlayerIcon player={socket.user} /> Message ({this.state.code.length}/{maxMessageLength})
                    </InputLabel>

                    <FilledInput
                        id="messageInput"
                        type="text"
                        value={this.state.code}
                        onChange={this.changeInput}
                        autoComplete="off"
                        inputProps={{
                            className: classes.textInput,
                            maxLength: maxMessageLength,
                            onKeyDown: e => {if (e.key == 'Enter') this.tryCode()},
                        }}
                        inputRef={this.inputRef}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Join"
                                    onClick={this.tryCode}
                                    edge="end"
                                >
                                    <SendIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </div>
        );
    }
}

export default withStyles(useStyles)(CodeInput);
import React from 'react';
import { Table, TableHead, TableRow, TableBody, TableCell, ButtonGroup, Button, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import aspects from '../../data/aspects.json';
import socket from '../../socket/';

const useStyles = makeStyles((theme) => ({

    aspectImg: {
        margin: '-25%',
        width: 100,
    },

    opinion: {
        display: 'flex',
        justifyContent: 'space-between',
        width: 352,
    },
}));

export default function AspectGuessingTable(props) {
    let classes = useStyles();

    return (
        <Table style={{width: 'auto', margin: 'auto'}}>
            <TableHead>
                <TableRow>
                    <TableCell>Aspect</TableCell>
                    <TableCell align="right">Opinion</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {aspects.map((aspect, index) => (
                    <TableRow key={aspect}>
                        <TableCell><Tooltip title={`#${index} #${aspect}`}><img src={`/img/aspects/${index}.png`} className={classes.aspectImg} style={{zIndex: 13001}} /></Tooltip></TableCell>
                        <TableCell align="right">
                            <div className={classes.opinion}>
                                <ButtonGroup variant="outlined" size="small">
                                    {[-3, -2, -1, 0, 1, 2, 3].map(num => (
                                        <Button key={num} style={{background: props.aspectGuesses[index].includes(num) ? 'lightgrey' : 'white', ...(props.opinions && props.opinions[index] == num ? {border: '2px solid black', zIndex: 2} : {})}} onClick={props.editable ? () => socket.emit('guess', index, num, !props.aspectGuesses[index].includes(num)) : null}>{num < 0 ? '-' : (num > 0 ? '+' : '0')}</Button>
                                    ))}
                                </ButtonGroup>

                                <Button variant="outlined" size="small" style={{background: props.aspectGuesses[index].includes(null) ? 'lightgrey' : 'white'}} onClick={props.editable ? () => socket.emit('guess', index, null, !props.aspectGuesses[index].includes(null)) : null}>?</Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
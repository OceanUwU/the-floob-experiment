import React from 'react';
import { Typography, Button } from '@material-ui/core';

export default function LoginScreen() {
    return (
        <div style={{textAlign: 'center'}}>
            <Button variant="contained" color="secondary" href="/login" style={{marginTop: 20}}>Login</Button>
        </div>
    );
};
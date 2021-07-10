import React from 'react';
import { Button } from '@material-ui/core';
import intro from './intro.mp4';

export default function Intro() {
    let videoRef = React.createRef();
    let removeVideo = () => videoRef.current.parentElement.remove();
    //React.useEffect(() => videoRef.current.addEventListener('ended', () => removeVideo(), false), []);

    return (
        <div>
            <video playsInline autoPlay muted ref={videoRef} onEnded={e=>e.target.parentElement.remove()} style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 10000,
                background: 'black',
            }}>
                <source src={intro} type="video/mp4" />
            </video>

            <Button size="small" variant="contained" color="primary" onClick={removeVideo} style={{
                position: 'absolute',
                right: 5,
                top: 5,
                zIndex: 10001,
            }}>
                »
            </Button>
        </div>
    );
};
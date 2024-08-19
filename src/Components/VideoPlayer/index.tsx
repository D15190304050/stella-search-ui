import React, { useRef, useEffect } from 'react';
import ReactPlayer from 'react-player'
import {Row} from "antd";

const VideoPlayer = ({videoPlayUrl}) => {

    return (
        <Row>
            <ReactPlayer
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
                width={1200}
                height={675}
                url={videoPlayUrl}
                controls={true}
                playing={true}
            />
        </Row>
    );
};

export default VideoPlayer;
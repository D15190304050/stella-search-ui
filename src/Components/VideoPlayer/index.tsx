import React, { useRef, useEffect } from 'react';
import ReactPlayer from 'react-player'

const VideoPlayer = ({videoPlayUrl}) => {

    return (
        <div>
            <ReactPlayer url={videoPlayUrl}
            controls={true}
            playing={true}/>
        </div>
    );
};

export default VideoPlayer;
import React, { useRef, useEffect } from 'react';
import ReactPlayer from 'react-player'

const VideoPlayer = () => {

    return (
        <div>
            {/*<video src="http://localhost:10074/stella-videos/videoUpload-2-1720254711804-e7b551a2-75e7-4eab-afa9-dc769f7cc330.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20240812%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240812T131838Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=c48836a381a6b52bcd23fe4756275045ba736759a49cca65300f41511260196f"*/}
            {/*controls={true}/>*/}
            <ReactPlayer url="http://localhost:10074/stella-videos/converted_1.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20240812%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240812T135730Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=1e2f8e592c5cde6da5b539f7c50799d0a40688699ae4b3f1e868919fedf824ff"
            controls={true}
            playing={true}/>
        </div>
    );
};

export default VideoPlayer;
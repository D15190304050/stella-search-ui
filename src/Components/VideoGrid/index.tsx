import {VideoPlayInfo} from "../../dtos/VideoPlayInfo.ts";
import {Row} from 'antd';
import VideoCard from "../VideoCard";

const VideoCountIn1Row: number = 6;

const VideoGrid = ({videoPlayInfos}: { videoPlayInfos: VideoPlayInfo[] }) =>
{
    const videoPlayInfoSlices: VideoPlayInfo[][] = [];
    for (let i = 0; i < videoPlayInfos.length; i += VideoCountIn1Row)
        videoPlayInfoSlices.push(videoPlayInfos.slice(i, i + VideoCountIn1Row));

    return (
        videoPlayInfoSlices.map((videoPlayInfoSlice: VideoPlayInfo[]) =>
            (
                <Row key={"Row" + videoPlayInfoSlice[0].id} gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    {videoPlayInfoSlice.map((videoPlayInfo: VideoPlayInfo) => (
                        <VideoCard key={videoPlayInfo.id} videoPlayInfo={videoPlayInfo}/>
                    ))}
                </Row>
            ))
    );
}

export default VideoGrid;
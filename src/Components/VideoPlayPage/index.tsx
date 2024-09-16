import React, {useEffect, useState} from "react";
import {VideoInfo} from "../../dtos/VideoInfo.ts";
import {Button, Col, Collapse, message, Row, Space, Spin} from "antd";
import {LikeOutlined, MessageOutlined, PlayCircleOutlined, StarOutlined} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import RouteQueryParams from "../../constants/RouteQueryParams.ts";
import axiosWithInterceptor from "../../axios/axios.tsx";
import qs from "qs";
import IconText from "../IconText";
import VideoPlayer from "../VideoPlayer";
import VideoCommentArea from "../VideoCommentArea";
import {isNullOrUndefined} from "../../commons/Common.ts";

const { Panel } = Collapse;

const VideoPlayPage = () =>
{
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    const location = useLocation();
    const queryParams: URLSearchParams = new URLSearchParams(location.search);
    const videoIdString: string | null = queryParams.get(RouteQueryParams.VideoId);
    const videoId: number = parseInt(videoIdString);
    if (isNaN(videoId))
    {
        message.error("Invalid video ID.")
            .then(x => navigate("/"));
    }

    useEffect(() =>
    {
        (async () =>
        {
            const videoInfoResponse = await axiosWithInterceptor.get("/api/video/play",
                {
                    params: { videoId: videoId },
                    paramsSerializer: params => qs.stringify(params)
                });

            const videoInfo: VideoInfo = videoInfoResponse.data.data;

            setVideoInfo(videoInfo);
            setLoading(false);
        })();
    }, [videoId]);

    return (
        <Spin spinning={loading}>
            <h1>{videoInfo?.title}</h1>

            <Space style={{marginBottom: "10px"}}>
                <IconText icon={PlayCircleOutlined} text={videoInfo?.playCount + ""}/>
                <IconText icon={MessageOutlined} text={videoInfo?.commentCount + ""}/>
                <span>{videoInfo?.modificationTime.toString()}</span>
            </Space>

            <VideoPlayer videoPlayUrl={videoInfo?.videoPlayUrl}/>

            {/* Introduction. */}
            <Collapse style={{textAlign: "left"}} items={[{
                key: 1,
                label: "Introduction",
                children: videoInfo?.introduction,
            }]}/>

            {/* Like & favorites */}
            <Row style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                marginTop: '10px',
            }}>
                <Col>
                    <Button>
                        <LikeOutlined/>
                    </Button>
                </Col>
                <Col span={1} style={{textAlign: "left", marginLeft: "10px"}}>
                    <span>{videoInfo?.likeCount + ""}</span>
                </Col>
                <Col>
                    <Button><StarOutlined/></Button>
                </Col>
                <Col style={{textAlign: "left", marginLeft: "10px"}}>
                    <span>{videoInfo?.favoritesCount + ""}</span>
                </Col>
            </Row>

            <VideoCommentArea videoId={videoId}/>
        </Spin>
    );
}

export default VideoPlayPage;
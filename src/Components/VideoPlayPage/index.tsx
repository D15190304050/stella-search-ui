import React, {useEffect, useState} from "react";
import {VideoInfo} from "../../dtos/VideoInfo.ts";
import {isNullOrUndefined} from "../../commons/Common.ts";
import {message, Space, Spin} from "antd";
import {LikeOutlined, MessageOutlined, PlayCircleOutlined, StarOutlined} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import RouteQueryParams from "../../constants/RouteQueryParams.ts";
import axiosWithInterceptor from "../../axios/axios.tsx";
import qs from "qs";
import IconText from "../IconText";
import VideoPlayer from "../VideoPlayer";

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
            <Space>
                <IconText icon={PlayCircleOutlined} text={videoInfo?.playCount + ""}/>
                <IconText icon={StarOutlined} text={videoInfo?.favoritesCount + ""}/>
                <IconText icon={LikeOutlined} text={videoInfo?.likeCount + ""}/>
                <IconText icon={MessageOutlined} text={videoInfo?.commentCount + ""}/>
                <span>{videoInfo?.modificationTime.toString()}</span>
            </Space>

            <VideoPlayer videoPlayUrl={videoInfo?.videoPlayUrl}/>
            <p>Introduction: {videoInfo?.introduction}</p>
        </Spin>
    );
}

export default VideoPlayPage;
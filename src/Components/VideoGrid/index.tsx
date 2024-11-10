import {VideoPlayInfo} from "../../dtos/VideoPlayInfo.ts";
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Typography, Button } from 'antd';
import VideoCard from "../VideoCard";

const { Meta } = Card;
const { Title, Text } = Typography;

const VideoGrid = ({videoPlayInfos}: { videoPlayInfos: VideoPlayInfo[] }) =>
{
    return (
        <Row gutter={[16, 16]}>
            {videoPlayInfos.map((videoPlayInfo: VideoPlayInfo) =>
                (
                    <Col xs={24} sm={12} md={8} lg={6} xl={6} key={videoPlayInfo.id}>
                        <VideoCard videoPlayInfo={videoPlayInfo}/>
                    </Col>
                )
            )}
        </Row>
    );
}

export default VideoGrid;
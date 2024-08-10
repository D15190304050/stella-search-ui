import React, {useEffect, useState} from "react";
import {Avatar, Button, Col, Divider, List, Pagination, Row, Space} from "antd";
import {EditOutlined, LikeOutlined, MessageOutlined, StarOutlined} from "@ant-design/icons";
import {createSearchParams, useNavigate} from "react-router-dom";
import {NavigateFunction} from "react-router/dist/lib/hooks";
import RoutePaths from "../../constants/RoutePaths.ts";
import axiosWithInterceptor from "../../axios/axios.tsx";
import {PaginationParam} from "../../dtos/CommonQueryParams.ts";
import qs from "qs";
import {VideoInfo} from "../../dtos/VideoInfo.ts";

const ColPush: number = 6;
const ColSpan: number = 12;

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

const data = Array.from({ length: 3 }).map((_, i) => ({
    id: i,
    href: 'https://ant.design',
    title: `ant design part ${i}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
    description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    starCount: 0,
    likeCount: 1,
    commentCount: 2,
}));

const VideoManagement = () =>
{
    const navigate: NavigateFunction = useNavigate();
    const [videoCount, setVideoCount] = useState(25);
    const [videoInfos, setVideoInfos] = useState<VideoInfo[]>([]);

    const jumpToUpload = () =>
    {
        navigate(RoutePaths.VideoUploading);
    }

    const getVideoInfos = async (page: number, pageSize: number) =>
    {
        const param: PaginationParam =
            {
                pageCapacity: pageSize,
                pageIndex: page,
            };

        const response = await axiosWithInterceptor.get("/api/video/list", {
            params: param,
            paramsSerializer: params => qs.stringify(params)
        });

        const videoInfos: VideoInfo[] = response.data.data;
        setVideoInfos(videoInfos);
    }

    const onPageChange = async (page: number, pageSize: number) =>
    {
        await getVideoInfos(page, pageSize);
    }

    const onBtEditClick = (id: number) =>
    {
        const searchParams = createSearchParams({
            videoId: id.toString(),
        });

        const destinationUrl: string = RoutePaths.VideoUpdate + "?" + searchParams.toString();
        navigate(destinationUrl);
    }

    useEffect(() =>
    {
        (async () =>
        {
            const videoCountResponse = await axiosWithInterceptor.get("/api/video/count");
            const videoCount = videoCountResponse.data.data;
            setVideoCount(videoCount);

            await getVideoInfos(1, 10);
        })();
    }, []);


    return (
        <div>
            <Row>
                <Col span={24}>
                    <h2>Video management</h2>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Divider/>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Row>
                        <Col span={3}>
                            <h3 style={{textAlign: "left", lineHeight: "15px"}}>Total videos: {videoCount}</h3>
                        </Col>
                        <Col push={18} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <Button type="primary" onClick={jumpToUpload}>Upload new</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row style={{textAlign: "left"}}>
                <Col span={24}>
                    <List
                        // itemLayout="vertical"
                        itemLayout="horizontal"
                        size="large"
                        dataSource={videoInfos}
                        renderItem={(item) => (
                            <List.Item
                                key={item.title}
                                actions={[
                                    <IconText icon={StarOutlined} text={item.favoritesCount + ""} key={"list-star-o-" + item.id} />,
                                    <IconText icon={LikeOutlined} text={item.likeCount + ""} key={"list-like-o-" + item.id} />,
                                    <IconText icon={MessageOutlined} text={item.commentCount + ""} key={"list-message-" + item.id} />,
                                    <Button type="primary" icon={<EditOutlined />} onClick={() => onBtEditClick(item.id)} key={"list-bt-edit-" + item.id}>Edit</Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.coverUrl} />}
                                    title={<a href={item.videoUrl}>{item.title}</a>}
                                    description={item.introduction}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Pagination
                        total={videoCount}
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total) => `Total videos: ${total}`}
                        onChange={onPageChange}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default VideoManagement;
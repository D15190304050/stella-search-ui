import {VideoPlayInfo} from "../../dtos/VideoPlayInfo.ts";
import { Card, Typography, Button } from 'antd';

const { Meta } = Card;
const { Title, Text } = Typography;

const VideoCard = ({videoPlayInfo}: { videoPlayInfo: VideoPlayInfo }) =>
{
    return (
        <Card
            cover={<img alt={videoPlayInfo.title} src={videoPlayInfo.coverUrl} />}
            actions={[
                <Button type="primary">播放</Button>,
                <Button>收藏</Button>,
            ]}
        >
            <Meta
                title={<Title level={5}>{videoPlayInfo.title}</Title>}
                description={
                    <Text>{videoPlayInfo.introduction}</Text>
                }
            />
        </Card>
    );
}

export default VideoCard;
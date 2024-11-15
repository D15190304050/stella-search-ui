import {VideoPlayInfo} from "../../dtos/VideoPlayInfo.ts";
import {Col} from 'antd';
import {useEffect, useRef} from "react";
import RoutePaths from "../../constants/RoutePaths.ts";
import RouteQueryParams from "../../constants/RouteQueryParams.ts";

const VideoCard = ({videoPlayInfo}: { videoPlayInfo: VideoPlayInfo }) =>
{
    const colRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() =>
    {
        const setImageSize = () => {
            if (colRef.current && imgRef.current) {
                const width = colRef.current.offsetWidth;
                imgRef.current.style.width = `${width - 8}px`;
                imgRef.current.style.height = `${width - 8}px`;
            }
        };

        setImageSize();
        window.addEventListener('resize', setImageSize);

        return () =>
        {
            window.removeEventListener('resize', setImageSize);
        };
    }, []);

    return (
        <Col ref={colRef} span={4} style={{textAlign: "left"}}>
            <a
                href={`${RoutePaths.VideoPlayPage}?${RouteQueryParams.VideoId}=${videoPlayInfo.id}`}
                style={{ color: "black" }}
            >
                <img
                    ref={imgRef}
                    alt={videoPlayInfo.title}
                    src={videoPlayInfo.coverUrl}
                    style={{objectFit: "cover"}}
                />
                <div>{videoPlayInfo.title}</div>
                <div>{videoPlayInfo.creatorName}</div>
            </a>
        </Col>
    );
}

export default VideoCard;
import VideoInfoSetter from "../VideoInfoSetter";
import {useLocation, useNavigate} from "react-router-dom";
import RouteQueryParams from "../../constants/RouteQueryParams.ts";
import {isNullOrUndefined} from "../../commons/Common.ts";
import {NavigateFunction} from "react-router/dist/lib/hooks";
import {message} from "antd";
import {useEffect, useState} from "react";

const VideoUpdate = () =>
{
    const [enabled, setEnabled] = useState<boolean>(false);

    const location = useLocation();
    const navigate: NavigateFunction = useNavigate();

    const queryParams: URLSearchParams = new URLSearchParams(location.search);
    const videoId: string | null = queryParams.get(RouteQueryParams.VideoId);

    const noVideoId: boolean = (videoId === null);
    const sourceVideoId: number = noVideoId ?  -1 : parseInt(videoId as string);

    const showErrorVideoId = () =>
    {
        message.error("Invalid video ID.")
            .then(x => navigate("/"));
    }

    useEffect(() =>
    {
        if (noVideoId)
            showErrorVideoId();
        else
        {
            if (isNaN(sourceVideoId))
                showErrorVideoId();
            else
                setEnabled(true);
        }
    }, []);

    return enabled ? (<VideoInfoSetter sourceVideoId={sourceVideoId}/>) : <div></div>;
}

export default VideoUpdate;
import {useEffect, useState} from "react";
import {VideoBaseInfo, VideoPlayInfo} from "../../dtos/VideoPlayInfo.ts";
import {Button, Checkbox, Col, Collapse, message, Modal, Row, Space, Spin, Tooltip, Popover } from "antd";
import {
    LikeFilled,
    LikeOutlined,
    MessageOutlined,
    PlayCircleOutlined, PlusOutlined,
    StarFilled,
    StarOutlined
} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import RouteQueryParams from "../../constants/RouteQueryParams.ts";
import axiosWithInterceptor, {jsonHeader} from "../../axios/axios.tsx";
import qs from "qs";
import IconText from "../IconText";
import VideoPlayer from "../VideoPlayer";
import VideoCommentArea from "../VideoCommentArea";
import {PlaylistWithVideoCheck, SetVideoFavoritesRequest} from "../../dtos/Playlist.ts";
import PlaylistCreator from "../PlaylistCreator";
import {TranscriptSummary} from "../../dtos/TranscriptSummary.ts";

const VideoPlayPage = () =>
{
    const [videoInfo, setVideoInfo] = useState<VideoPlayInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [favoriteCount, setFavoriteCount] = useState<number>(0);
    const [currentUserLikes, setCurrentUserLikes] = useState<boolean>(false);
    const [currentUserFavorites, setCurrentUserFavorites] = useState<boolean>(false);
    const [playlists, setPlaylists] = useState<PlaylistWithVideoCheck[]>([]);
    const [playlistModalVisible, setPlaylistModalVisible] = useState<boolean>(false);
    const [openAddPlaylistModal, setOpenAddPlaylistModal] = useState<boolean>(false);
    const [checkedPlaylistIds, setCheckedPlaylistIds] = useState<number[]>([]);
    const [summary, setSummary] = useState<TranscriptSummary | null>(null);

    const navigate = useNavigate();

    const location = useLocation();
    const queryParams: URLSearchParams = new URLSearchParams(location.search);
    const videoIdString: string | null = queryParams.get(RouteQueryParams.VideoId);
    const videoId: number = parseInt(videoIdString as string);
    if (isNaN(videoId))
    {
        message.error("Invalid video ID.")
            .then(x => navigate("/"));
    }

    const changeLikeStatus = () =>
    {
        const videoBaseInfo: VideoBaseInfo = { videoId: videoId };
        if (!currentUserLikes)
        {
            axiosWithInterceptor.post("/api/video/like", videoBaseInfo, jsonHeader)
                .then(response =>
                {
                    const success: boolean = response.data.data;
                    if (success)
                    {
                        setCurrentUserLikes(true);
                        setLikeCount(likeCount + 1);
                    }
                    else
                        message.error("Error updating like status: " + response.data.message);
                })
        }
        else
        {
            axiosWithInterceptor.post("/api/video/cancel-like", videoBaseInfo, jsonHeader)
                .then(response =>
                {
                    const success: boolean = response.data.data;
                    if (success)
                    {
                        setCurrentUserLikes(false);
                        setLikeCount(likeCount - 1);
                    }
                    else
                        message.error("Error updating like status: " + response.data.message);
                })
        }
    }

    const openPlaylistModal = () =>
    {
        axiosWithInterceptor.get("/api/playlist/playlist-with-checks", {
            params: {videoId},
            paramsSerializer: params => qs.stringify(params)
        })
            .then(response =>
            {
                const playlistWithChecks: PlaylistWithVideoCheck[] = response.data.data;
                setPlaylists(playlistWithChecks);
                const checkedPlaylistIds: number[] = playlistWithChecks.filter(playlist => playlist.containsVideo).map(playlist => playlist.id);
                setCheckedPlaylistIds(checkedPlaylistIds);
                setPlaylistModalVisible(true);
            });
    }

    const handleNewPlaylist = (newPlaylist: PlaylistWithVideoCheck) =>
    {
        setPlaylists([...playlists, newPlaylist]);
    }

    const closePlaylistModal = () =>
    {
        setPlaylistModalVisible(false);
    }

    const openNewPlaylistModal = () =>
    {
        setOpenAddPlaylistModal(true);
    }

    const setVideoFavorites = () =>
    {
        const request: SetVideoFavoritesRequest =
            {
                videoId: videoId,
                playlistIds: checkedPlaylistIds,
            };

        axiosWithInterceptor.post("/api/playlist/set-favorites", request, jsonHeader)
            .then(response =>
            {
                const success = response.data.success;
                if (success)
                {
                    message.info("Successfully added into playlist(s).");
                    setPlaylistModalVisible(false);

                    // Set favorite count.
                    // If the current user favored it before, and do not favor it now, decrease favorite count.
                    // If the current user did not favor it before, and favorite it now, increase favorite count.
                    if (currentUserFavorites && checkedPlaylistIds.length === 0)
                        setFavoriteCount(favoriteCount - 1);
                    else if (!currentUserFavorites && checkedPlaylistIds.length > 0)
                        setFavoriteCount(favoriteCount + 1);

                    setCurrentUserFavorites(checkedPlaylistIds.length > 0);
                }
                else
                    message.error(response.data.message);
            });
    }

    const getSummary = () =>
    {
        axiosWithInterceptor.get("/api/video/summary", {
            params: {videoId: videoId},
            paramsSerializer: params => qs.stringify(params)
        }).then(response =>
        {
            if (response.data.success)
                setSummary(response.data.data);
            else
                message.error(response.data.message);
        });
    }

    const setSummaryContent = () =>
    {
        if (summary === null)
            return (<div>There is no summary for this video.</div>);
        else
        {
            let keyId: number = 1;
            const innerDivs = summary.summary.replaceAll("\"", "").split("\n").map(x =>
            {
                return (<div key={keyId++}>{x}</div>);
            });
            return (
                <div>{innerDivs}</div>
            );
        }
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

            const videoInfo: VideoPlayInfo = videoInfoResponse.data.data;

            setVideoInfo(videoInfo);
            setLikeCount(videoInfo.likeCount);
            setFavoriteCount(videoInfo.favoritesCount);
            setCurrentUserLikes(videoInfo.userLikes);
            setCurrentUserFavorites(videoInfo.userFavorites);
            getSummary();
            setLoading(false);
        })();
    }, [videoId]);

    return (
        <Spin spinning={loading}>
            <Modal
                open={playlistModalVisible}
                title="Add to favorite playlists"
                onCancel={closePlaylistModal}
                onOk={setVideoFavorites}
            >
                <PlaylistCreator
                    handleNewPlaylist={handleNewPlaylist}
                    openAddPlaylistModal={openAddPlaylistModal}
                    setOpenAddPlaylistModal={setOpenAddPlaylistModal}
                />
                <Checkbox.Group
                    defaultValue=
                        {
                            playlists
                                .filter(playlist => playlist.containsVideo)
                                .map(playlist => (playlist.id))
                        }
                    onChange={setCheckedPlaylistIds}
                >
                    <Row>
                        {playlists.map(playlist => (
                            <Col span={24} key={playlist.id}>
                                <Tooltip title={playlist.description}>
                                    <Checkbox value={playlist.id}>{playlist.name}</Checkbox>
                                </Tooltip>
                            </Col>
                        ))}
                    </Row>
                </Checkbox.Group>

                <Row>
                    <Button onClick={openNewPlaylistModal}>
                        <PlusOutlined/>
                        Create new playlist
                    </Button>
                </Row>
            </Modal>

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
                    <Button onClick={changeLikeStatus}>
                        {currentUserLikes ? <LikeFilled/> : <LikeOutlined/>}
                    </Button>
                </Col>
                <Col style={{textAlign: "left", marginLeft: "10px"}}>
                    <span>{likeCount}</span>
                </Col>
                <Col>
                    <Button onClick={openPlaylistModal}>
                        {currentUserFavorites ? <StarFilled/> : <StarOutlined/>}
                    </Button>
                </Col>
                <Col style={{textAlign: "left", marginLeft: "10px"}}>
                    <span>{favoriteCount}</span>
                </Col>
                <Col span={20} style={{textAlign: "right"}}>
                    <Popover content={setSummaryContent()} title="Summary" trigger="click">
                        <Button>Show summary</Button>
                    </Popover>
                </Col>
            </Row>

            <VideoCommentArea videoId={videoId}/>
        </Spin>
    );
}

export default VideoPlayPage;
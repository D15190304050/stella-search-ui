import {useEffect, useState} from 'react';
import {Layout, Menu, Button, Modal, Form, message, Input, Tooltip, Spin} from 'antd';
import {PlaylistInfo, PlaylistWithVideoCheck} from "../../dtos/Playlist.ts";
import axiosWithInterceptor, {jsonHeader} from "../../axios/axios.tsx";
import {PlusCircleOutlined} from "@ant-design/icons";
import {VideoPlayInfo} from "../../dtos/VideoPlayInfo.ts";
import VideoGrid from "../VideoGrid";
import PlaylistCreator from "../PlaylistCreator";

const { Sider, Content } = Layout;

const PlaylistPage = () => {
    const [playlists, setPlaylists] = useState<PlaylistInfo[]>([]);
    const [currentPlaylistKey, setCurrentPlaylistKey] = useState<string>("");
    const [openAddPlaylistModal, setOpenAddPlaylistModal] = useState<boolean>(false);

    const [videoPlayInfos, setVideoPlayInfos] = useState<VideoPlayInfo[]>([]);
    const [loading, setLoading] = useState(false);

    const showPlaylistContents = ({key}: { key: string }) => {
        setCurrentPlaylistKey(key);

        // axiosWithInterceptor.get("");
    };

    const renderMenuItem = (playlistInfo: PlaylistInfo) =>
        (
            <Tooltip title={playlistInfo.description}>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <span>{playlistInfo.name}</span>
                    <span>{playlistInfo.videoCount}</span>
                </div>
            </Tooltip>
        );

    const handleNewPlaylist = (newPlaylist: PlaylistWithVideoCheck) =>
    {
        setPlaylists([...playlists, newPlaylist]);
        setCurrentPlaylistKey(newPlaylist.id.toString());
    }

    const openNewPlaylistModal = () =>
    {
        setOpenAddPlaylistModal(true);
    }

    useEffect(() => {
        (async () => {
                const response = await axiosWithInterceptor.get("/api/playlist/list");
                const playlists: PlaylistInfo[] = response.data.data;

                setPlaylists(playlists);
                
                if (playlists.length > 0)
                    setCurrentPlaylistKey(playlists[0].id.toString());
            }
        )();
    }, []);

    return (
        <div>
            <PlaylistCreator
                handleNewPlaylist={handleNewPlaylist}
                openAddPlaylistModal={openAddPlaylistModal}
                setOpenAddPlaylistModal={setOpenAddPlaylistModal}
            />
            <Layout style={{ minHeight: '60vh' }}>
                <Sider width={256}>
                    <Button style={{width: '100%'}} onClick={openNewPlaylistModal}>
                        <PlusCircleOutlined/>
                        Add new playlist
                    </Button>
                    <Menu
                        onClick={showPlaylistContents}
                        selectedKeys={[currentPlaylistKey]}
                        mode="inline"
                        style={{ height: '100%', borderRight: 0, textAlign: 'left' }}
                        items={playlists.map((playlist) =>
                            (
                                {
                                    key: playlist.id.toString(),
                                    label: renderMenuItem(playlist),
                                }
                            ))}
                    />
                </Sider>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 360 }}>
                    <Spin spinning={loading} size="large" tip="Loading..." delay={500}>
                        <VideoGrid videoPlayInfos={videoPlayInfos}/>
                    </Spin>
                </Content>
            </Layout>
        </div>
    );
}

export default PlaylistPage;
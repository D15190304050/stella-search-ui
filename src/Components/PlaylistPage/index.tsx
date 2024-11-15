import React, {useEffect, useState} from 'react';
import {Layout, Menu, Button, Modal, Form, message, Input, Tooltip, Spin, Pagination, Dropdown, MenuProps} from 'antd';
import {
    PlaylistInfo,
    PlaylistWithVideoCheck,
    UpdatePlaylistInfoRequest,
    VideoPlayInfoInPlaylistRequest
} from "../../dtos/Playlist.ts";
import axiosWithInterceptor, {jsonHeader} from "../../axios/axios.tsx";
import {PlusCircleOutlined} from "@ant-design/icons";
import {VideoPlayInfo} from "../../dtos/VideoPlayInfo.ts";
import VideoGrid from "../VideoGrid";
import PlaylistCreator from "../PlaylistCreator";
import qs from "qs";
import PlaylistMenuItem from "../PlaylistMenuItem";

const DefaultPageSize: number = 24;
const { Sider, Content } = Layout;

const PlaylistPage = () =>
{
    const [pageCapacity, setPageCapacity] = useState<number>(DefaultPageSize);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [playlists, setPlaylists] = useState<PlaylistInfo[]>([]);
    const [currentPlaylistKey, setCurrentPlaylistKey] = useState<string>("");
    const [currentHoverPlaylistKey, setCurrentHoverPlaylistKey] = useState<string>("");
    const [openAddPlaylistModal, setOpenAddPlaylistModal] = useState<boolean>(false);
    const [openEditPlaylistModal, setOpenEditPlaylistModal] = useState<boolean>(false);
    const [openDeletePlaylistModal, setOpenDeletePlaylistModal] = useState<boolean>(false);
    const [videoCountInPlaylist, setVideoCountInPlaylist] = useState<number>(0);
    const [videoPlayInfos, setVideoPlayInfos] = useState<VideoPlayInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [editPlaylistForm] = Form.useForm();

    const findCurrentEditingPlaylist = (): PlaylistInfo =>
    {
        return playlists.filter(x => x.id.toString() === currentHoverPlaylistKey)[0];
    }

    const initAndOpenEditPlaylistModal = (): void =>
    {
        const playlist: PlaylistInfo = findCurrentEditingPlaylist();

        editPlaylistForm.setFieldsValue({
            name: playlist.name,
            description: playlist.description
        });

        setOpenEditPlaylistModal(true);
    }

    const showPlaylistContents = ({key}: { key: string }) =>
    {
        setCurrentPlaylistKey(key);
        setPageIndex(1);
        getVideoInfoInPlaylist(key, 1, pageCapacity);
    };

    const renderMenuItem = (playlistInfo: PlaylistInfo) =>
        (
            <PlaylistMenuItem
                key={playlistInfo.id}
                playlistInfo={playlistInfo}
                initAndOpenEditPlaylistModal={initAndOpenEditPlaylistModal}
                setOpenDeletePlaylistModal={setOpenDeletePlaylistModal}
                setCurrentHoverPlaylistKey={setCurrentHoverPlaylistKey}
            />
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

    const getVideoInfoInPlaylist = (selectedPlaylistKey: string, page: number, pageSize: number) =>
    {
        setLoading(true);
        setPageIndex(page);
        setPageCapacity(pageSize);

        const playlistId: number = parseInt(selectedPlaylistKey);
        const request: VideoPlayInfoInPlaylistRequest =
            {
                playlistId,
                pageIndex: page,
                pageCapacity: pageSize,
            };

        axiosWithInterceptor.get("/api/video/in-playlist",
            {
                params: request,
                paramsSerializer: params => qs.stringify(params)
            })
            .then(response =>
            {
                const videoPlayInfosInPlaylist: VideoPlayInfo[] = response.data.data.data;
                const videoCountInPlaylist: number = response.data.data.total;

                setVideoCountInPlaylist(videoCountInPlaylist);
                setVideoPlayInfos(videoPlayInfosInPlaylist);
                setLoading(false);
            });
    }

    const onPageChange = (page: number, pageSize: number) => getVideoInfoInPlaylist(currentPlaylistKey, page, pageSize);

    const deletePlaylist = () =>
    {
        const request = {id: parseInt(currentHoverPlaylistKey)};
        axiosWithInterceptor.post("/api/playlist/delete", request, jsonHeader)
            .then(response =>
            {
                if (response.data.success)
                {
                    setOpenDeletePlaylistModal(false);
                    loadPage();
                }
                else
                    message.error(response.data.message);
            });
    }

    const updatePlaylist = () =>
    {
        const request: UpdatePlaylistInfoRequest = {
            id: parseInt(currentHoverPlaylistKey),
            name: editPlaylistForm.getFieldValue("name"),
            description: editPlaylistForm.getFieldValue("description"),
        };

        axiosWithInterceptor.post("/api/playlist/modify", request, jsonHeader)
            .then(response =>
            {
                const currentEditingPlaylist: PlaylistInfo = findCurrentEditingPlaylist();
                currentEditingPlaylist.name = request.name;
                currentEditingPlaylist.description = request.description;
                message.info("Edit success!");
                setOpenEditPlaylistModal(false);
            })
    }

    const loadPage = async () =>
    {
        setVideoCountInPlaylist(0);
        setPlaylists([]);
        setVideoPlayInfos([]);
        const response = await axiosWithInterceptor.get("/api/playlist/list");
        const playlists: PlaylistInfo[] = response.data.data;

        setPlaylists(playlists);

        if (playlists.length > 0)
        {
            const playlistKey = playlists[0].id.toString();
            setCurrentPlaylistKey(playlistKey);
            getVideoInfoInPlaylist(playlistKey, pageIndex, pageCapacity);
        }
    }

    useEffect(() => {
        (async () => await loadPage())();
    }, []);

    return (
        <div>
            <PlaylistCreator
                handleNewPlaylist={handleNewPlaylist}
                openAddPlaylistModal={openAddPlaylistModal}
                setOpenAddPlaylistModal={setOpenAddPlaylistModal}
            />
            <Modal
                open={openDeletePlaylistModal}
                title={`Are you sure to delete playlist?`}
                onOk={deletePlaylist}
                onCancel={() => setOpenDeletePlaylistModal(false)}
            >

            </Modal>
            <Modal
                open={openEditPlaylistModal}
                title="Edit playlist"
                onOk={updatePlaylist}
                onCancel={() => setOpenEditPlaylistModal(false)}
            >
                <Form form={editPlaylistForm}
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 18 }}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the name of your playlist!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the description of your playlist!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
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
                        {playlists.length > 0 ? <VideoGrid videoPlayInfos={videoPlayInfos}/> : "You do not have any playlist now."}
                        <Pagination
                            current={pageIndex}
                            total={videoCountInPlaylist}
                            showQuickJumper
                            showTotal={(total) => `Total videos: ${total}`}
                            onChange={onPageChange}
                            defaultPageSize={DefaultPageSize}
                        />
                    </Spin>
                </Content>
            </Layout>
        </div>
    );
}

export default PlaylistPage;
import {Form, Input, message, Modal} from "antd";
import axiosWithInterceptor, {jsonHeader} from "../../axios/axios.tsx";
import {PlaylistInfo, PlaylistWithVideoCheck} from "../../dtos/Playlist.ts";
import React from "react";
import {useForm} from "antd/es/form/Form";

const PlaylistCreator = ({handleNewPlaylist, openAddPlaylistModal, setOpenAddPlaylistModal}: {
    handleNewPlaylist: null | ((PlaylistInfo: PlaylistWithVideoCheck) => void),
    openAddPlaylistModal: boolean,
    setOpenAddPlaylistModal: React.Dispatch<React.SetStateAction<boolean>>
}) =>
{
    const [form] = useForm();

    const submitNewPlaylistRequest = () =>
    {
        form.validateFields()
            .then(values =>
            {
                axiosWithInterceptor.post("/api/playlist/create", values, jsonHeader)
                    .then(response =>
                    {
                        const newPlaylist: PlaylistWithVideoCheck = response.data.data;
                        if (handleNewPlaylist)
                            handleNewPlaylist(newPlaylist);

                        message.info("Create new playlist successfully.");
                        setOpenAddPlaylistModal(false);
                    })
            })
            .catch(error =>
            {
                message.error(error);
            });
    }

    const cancelNewPlaylistRequest = () =>
    {
        setOpenAddPlaylistModal(false);
    };

    return (
        <Modal
            title="New playlist"
            open={openAddPlaylistModal}
            onOk={submitNewPlaylistRequest}
            onCancel={cancelNewPlaylistRequest}
            okText="Submit"
            cancelText="Cancel"
        >
            <Form
                form={form}
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
                    rules={[{ required: true, message: 'Please input the description of the playlist!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default PlaylistCreator;
import {Dropdown, MenuProps, Tooltip} from "antd";
import {PlaylistInfo} from "../../dtos/Playlist.ts";
import React, {useState} from "react";
import {MoreOutlined} from "@ant-design/icons";

const DropdownMenuKeys =
    {
        edit: "Edit",
        delete: "Delete",
    };

const playlistDropdownMenu: MenuProps['items'] = [
    {
        key: DropdownMenuKeys.edit,
        label: "Edit",
    },
    {
        key: DropdownMenuKeys.delete,
        label: "Delete",
    }
];

const PlaylistMenuItem = (
    {
        playlistInfo,
        initAndOpenEditPlaylistModal,
        setOpenDeletePlaylistModal,
        setCurrentHoverPlaylistKey,
    }
        : {
        playlistInfo: PlaylistInfo,
        initAndOpenEditPlaylistModal: () => void,
        setOpenDeletePlaylistModal: React.Dispatch<React.SetStateAction<boolean>>,
        setCurrentHoverPlaylistKey: React.Dispatch<React.SetStateAction<string>>,
    }) =>
{
    const [isHover, setHover] = useState<boolean>(false);

    const handlePlaylistDropdown = (e) =>
    {
        // Stop propagation so that the menu key of the playlist will not be selected.
        e.domEvent.stopPropagation();
        switch (e.key)
        {
            case DropdownMenuKeys.edit:
                initAndOpenEditPlaylistModal();
                break;
            case DropdownMenuKeys.delete:
                setOpenDeletePlaylistModal(true);
                break;
        }
    }

    const mouseEnter = () =>
    {
        setHover(true);
        setCurrentHoverPlaylistKey(playlistInfo.id.toString());
    }

    return (
        <Tooltip key={playlistInfo.id} title={playlistInfo.description}>
            <div
                style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}
                onMouseEnter={mouseEnter}
                onMouseLeave={() => setHover(false)}
            >
                <span>{playlistInfo.name}</span>
                <Dropdown
                    trigger={["hover"]}
                    menu={{items: playlistDropdownMenu, onClick: handlePlaylistDropdown}}
                >
                    <span>{isHover ? <MoreOutlined/> : playlistInfo.videoCount}</span>
                </Dropdown>
            </div>
        </Tooltip>
    );
}

export default PlaylistMenuItem;
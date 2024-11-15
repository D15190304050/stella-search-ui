import {PaginationParam} from "./CommonQueryParams.ts";

interface PlaylistInfo
{
    id: number;
    userId: number;
    name: string;
    description: string;
    videoCount: number;
}

interface PlaylistWithVideoCheck extends PlaylistInfo
{
    videoId: number;
    containsVideo: boolean;
}

interface SetVideoFavoritesRequest
{
    videoId: number,
    playlistIds: number[],
}

interface VideoPlayInfoInPlaylistRequest extends PaginationParam
{
    playlistId: number
}

interface UpdatePlaylistInfoRequest
{
    id: number,
    name: string,
    description: string,
}

export type {
    PlaylistInfo,
    PlaylistWithVideoCheck,
    SetVideoFavoritesRequest,
    VideoPlayInfoInPlaylistRequest,
    UpdatePlaylistInfoRequest
}
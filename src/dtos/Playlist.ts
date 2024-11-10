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

export type {PlaylistInfo, PlaylistWithVideoCheck, SetVideoFavoritesRequest}
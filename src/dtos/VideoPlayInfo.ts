interface VideoPlayInfo
{
    id: number,
    nameInOss: string,
    title: string,
    coverUrl: string,
    introduction: string,
    creationTime: Date,
    modificationTime: Date,
    playCount: number,
    favoritesCount: number,
    likeCount: number,
    commentCount: number,
    videoPlayUrl: string,
    userLikes: boolean,
    userFavorites: boolean,
    creatorName: string,
}

interface SetVideoInfoRequest
{
    title: string;
    coverUrl: string;
    videoCreationType: number;
    section: number;
    labels: number[];
    introduction?: string;
    videoId: number;
}

interface NewVideoUploadingTaskRequest
{
    videoChunkCount: number,
    videoFileExtension: string,
}

interface VideoChunkUploadingRequest
{
    videoUploadingTaskId: string,
    videoChunkIndex: number,
    videoChunk: Blob
}

interface ComposeVideoChunksRequest
{
    videoUploadingTaskId: string,
}

interface VideoBaseInfo
{
    videoId: number;
}

export type
{
    VideoPlayInfo,
    SetVideoInfoRequest,
    NewVideoUploadingTaskRequest,
    VideoChunkUploadingRequest,
    ComposeVideoChunksRequest,
    VideoBaseInfo
}
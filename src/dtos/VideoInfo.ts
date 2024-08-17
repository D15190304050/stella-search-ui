interface VideoInfo
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

export type {VideoInfo, SetVideoInfoRequest, NewVideoUploadingTaskRequest, VideoChunkUploadingRequest, ComposeVideoChunksRequest}
interface VideoInfo
{
    id: number,
    videoUrl: string,
    title: string,
    coverUrl: string,
    introduction: string,
    uploadedTime: Date,
    playCount: number,
    favoritesCount: number,
    likeCount: number,
    commentCount: number,
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
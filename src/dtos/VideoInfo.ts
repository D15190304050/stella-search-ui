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

export type {VideoInfo, NewVideoUploadingTaskRequest, VideoChunkUploadingRequest, ComposeVideoChunksRequest}
interface VideoInfo
{
    id: number,
    videoUrl: string,
    title: string,
    avatarUrl: string,
    description: string,
    uploadedTime: number,
    playCount: number,
    collectionCount: number,
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
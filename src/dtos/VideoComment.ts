import {PaginationParam} from "./CommonQueryParams.ts";

interface VideoComment
{
    id: number;
    userId: number;
    nickname: string;
    avatarUrl: string;
    content: string;
    creationTime: Date;
}

interface AddCommentsRequest
{
    videoId: number;
    content: string;
    parentId: number;
}

interface GetVideoCommentsRequest extends PaginationParam
{
    videoId: number;
}

export type { VideoComment, AddCommentsRequest, GetVideoCommentsRequest};
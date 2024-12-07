import {JSX} from "react";
import {PaginationParam} from "./CommonQueryParams.ts";

interface FollowCount
{
    followingCount: number;
    followerCount: number;
}

interface FollowMenuItem
{
    key: string,
    icon: JSX.Element,
    title: string,
    count: number,
}

interface UserFollowingInfo
{
    userId: number;
    nickname: string;
    avatarUrl: string;
    followingTime: Date;
}

interface UserFollowingInfoWithState extends UserFollowingInfo
{
    followState: boolean;
}

export const convertToUserFollowingInfoWithState = (userFollowingInfo: UserFollowingInfo) =>
{
    return {
        ...userFollowingInfo,
        followState: true,
    };
}


export type {FollowCount, FollowMenuItem, UserFollowingInfo, UserFollowingInfoWithState}
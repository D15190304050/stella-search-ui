import {JSX} from "react";

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
    followState: boolean;
}

interface UserFollowCount
{
    followingCount: number,
    followerCount: number,
}

export type {FollowMenuItem, UserFollowingInfo, UserFollowCount}
import {JSX} from "react";

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
    followState: boolean;
}

export type {FollowCount, FollowMenuItem, UserFollowingInfo}
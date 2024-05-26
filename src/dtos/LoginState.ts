interface LoginState
{
    id: number;
    username: string;
    nickname: string;
    avatarUrl?: string;
    token?: string;
}

export type {LoginState};
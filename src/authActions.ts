import {LoginState} from "./dtos/LoginState.ts";

export const setUserInfo = (userInfo: LoginState | null) => ({
    type: 'LOGIN_USER',
    payload: userInfo,
});

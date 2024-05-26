import axiosWithInterceptor from "../../axios/axios.tsx";
import {LoginState} from "../../dtos/LoginState.ts";
import {setUserInfo} from "../../authActions.ts";
import {Dispatch} from "redux";
import AuthKeys from "../../constants/AuthKeys.ts";
import {isNullOrUndefined} from "../../commons/Common.ts";
import Cookies from "universal-cookie";

function setSsoCookie(cookies: Cookies, token: string): void
{
    cookies.set(AuthKeys.SsoCookieName, token, {path: "/"});
}

async function getLoginState()
{
    const response = await axiosWithInterceptor.get("/api/account/login-state");
    const data = response.data;

    if (data.success)
        return data.data as LoginState;
    else
        return null;
}

async function refreshLoginState(dispatch: Dispatch)
{
    try
    {
        const loginState: LoginState | null = await getLoginState();
        if (loginState !== null)
        {
            dispatch(setUserInfo(loginState));
            return true;
        }
    }
    catch (error)
    {
        console.log("Error when getting login state = ", error);
    }

    return false;
}

async function getLoginStateFromCookie(dispatch: Dispatch)
{
    const cookies: Cookies = new Cookies();

    let loginStateCookie: string | null = cookies.get(AuthKeys.SsoCookieName);

    if (isNullOrUndefined(loginStateCookie))
        loginStateCookie = localStorage.getItem(AuthKeys.SsoCookieName);

    if (loginStateCookie !== null)
    {
        setSsoCookie(cookies, loginStateCookie);
        return await refreshLoginState(dispatch);
    }

    return false;
}

function logout(dispatch: Dispatch)
{
    const cookies: Cookies = new Cookies();
    cookies.remove(AuthKeys.SsoCookieName);

    localStorage.removeItem(AuthKeys.SsoCookieName);

    dispatch(setUserInfo(null));
}

export {getLoginState, refreshLoginState, getLoginStateFromCookie, logout};
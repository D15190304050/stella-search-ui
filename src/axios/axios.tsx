import axios from "axios";
import AuthKeys from "../constants/AuthKeys.ts";

const axiosWithInterceptor = axios.create({
    timeout: 1000 * 60 * 5,
    withCredentials: true,
    headers:
    {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    }
})

axiosWithInterceptor.interceptors.request.use(
    config =>
    {
        const token: string | null = localStorage.getItem(AuthKeys.SsoCookieName);
        if (token)
        {
            config.headers[AuthKeys.Authorization] = token;
        }

        return config;
    },
    error =>
    {
        return Promise.reject(error);
    }
);

axiosWithInterceptor.interceptors.response.use(
    response =>
    {
        const responseStatus = response.status;

        // console.log("responseStatus = ", responseStatus)

        switch (responseStatus) {
            case 401:
            case 403:
                // Jump to unauthorized page.
                console.log("zzz");
                break;
            case 404:
                break;
            case 200:
                return response;
        }
    },
    error =>
    {
        console.log("error = ", error);
        return Promise.reject(error);
    }
)

const jsonHeader = {headers: {"Content-Type": "application/json"}};
const formHeader = {headers: {"Content-Type": "multipart/form-data"}};

export default axiosWithInterceptor;

export {jsonHeader, formHeader};
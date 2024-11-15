import { Card, Button, Checkbox, Form, Input, message, Spin, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import axiosWithInterceptor, {jsonHeader} from "../../axios/axios";
import "./index.scss"
import AuthKeys from "../../constants/AuthKeys.js";
import {getLoginStateFromCookie, refreshLoginState} from "../../apis/login/LoginStateHandler.ts";
import {useDispatch} from "react-redux";
import {Dispatch} from "redux";
import {NavigateFunction} from "react-router/dist/lib/hooks";
import {isNullOrUndefined} from "../../commons/Common.ts";

const Login = () => {
    const location = useLocation();
    const cookies = new Cookies();
    const [loading, setLoading] = useState<boolean>(false);

    const navigate: NavigateFunction = useNavigate();

    const queryParams: URLSearchParams = new URLSearchParams(location.search);
    const redirectUrlParam: string | null = queryParams.get(AuthKeys.RedirectUrl);
    const redirectUrl: string = isNullOrUndefined(redirectUrlParam) ? "/" : "/" + redirectUrlParam;

    const dispatch: Dispatch = useDispatch();

    useEffect(() =>
    {
        (async () =>
        {
            const loginSuccess: boolean = await getLoginStateFromCookie(dispatch);
            if (loginSuccess)
                navigate(redirectUrl);
        })();
    }, []);

    const onFinish = async (loginInfo) => {
        loginInfo.redirectUrl = redirectUrl;
        console.log('Success:', loginInfo);
        setLoading(true);

        const loginResponse = await axiosWithInterceptor.post("/api/login", loginInfo, jsonHeader);

        setLoading(false);
        const result = loginResponse.data;

        if (result.success)
        {
            // Save JWT token once login success.
            const data = result.data;
            const token = data.accessToken;
            console.log("data =", data);
            localStorage.setItem(AuthKeys.SsoCookieName, token);
            cookies.set(AuthKeys.SsoCookieName, token, {path: "/"});

            await refreshLoginState(dispatch);
            navigate(redirectUrl);
        }
        else
            message.error("Incorrect username / password.");
    };

    const onFinishFailed = (errorInfo) =>
    {
        console.log('Failed:', errorInfo);
    };

    const jumpToRegisterPage = () =>
    {
        navigate("/register");
    }

    return (
        <div>
            <Spin spinning={loading} size="large" tip="Loading..." delay={500}>
                <div className="wrap-container">
                    <div className="white-background">
                        <img src="/src/assets/Eagle.webp" className="image-background" />
                    </div>
                    <div className="login-wrap">
                        <Card
                            title="Stella search"
                            bordered={false}
                            style={{
                                width: 500, // Card width: 500 px.
                            }}
                        >
                            <Form
                                name="basic"
                                labelCol={{
                                    span: 8,
                                }}
                                wrapperCol={{
                                    span: 16,
                                }}
                                style={{
                                    maxWidth: 600,
                                }}
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Username" // "label" is used for display.
                                    name="username" // "name" is used for http parameters.
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your username!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        },
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item
                                    name="rememberMe"
                                    valuePropName="checked"
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <Checkbox defaultChecked>Remember me</Checkbox>
                                </Form.Item>

                                <Form.Item
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <Space>
                                        <Button type="primary" htmlType="submit">
                                            Login
                                        </Button>
                                        <Button type="default" htmlType="button" onClick={jumpToRegisterPage}>
                                            Register
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </div>
            </Spin>
        </div>
    )
}

export default Login;
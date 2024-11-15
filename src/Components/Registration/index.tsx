import {
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    Row,
    Select,
    Spin,
    Card,
    Space,
    Upload,
    message,
} from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import {useEffect, useState} from 'react';
import "./index.scss"
import axiosWithInterceptor, {jsonHeader} from "../../axios/axios.jsx";
import {useNavigate} from "react-router-dom";
import Cookies from "universal-cookie";
import AuthKeys from "../../constants/AuthKeys.ts";
const viteEnv = import.meta.env;

const { Option } = Select;

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUploadAvatar = (file) => {
    // console.log("file =", file);

    const fileType = file.type;
    const isJpgOrPng = fileType === "image/jpeg" || fileType === "image/png";
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2 MB!');
    }
    return isJpgOrPng && isLt2M;
};

const Registration = () => {
    const [loadingOfRegistration, setLoadingOfRegistration] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [captchaId, setCaptchaId] = useState<string>("");
    const [captchaUrl, setCaptchaUrl] = useState<string>("");

    const navigate = useNavigate();

    const cookies = new Cookies();
    cookies.remove(AuthKeys.SsoCookieName);

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url: string) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const [form] = Form.useForm();

    const onFinish = (values) => {
        values.avatarUrl = values.avatarUrl.file.response.data;
        const formData = {...values, captchaId: captchaId};

        axiosWithInterceptor.post("/api/account/register", formData, jsonHeader)
            .then(response =>
            {
                const serviceResponse = response.data;

                if (serviceResponse.data === true)
                {
                    message.info("Registration successfully.");
                    navigate("/");
                }
                else
                {
                    message.error(serviceResponse.message);
                }
            });

        // console.log("fromData =", JSON.stringify(formData)); // This line is used to test in PostMan.
    };

    const prefixSelector = (
        <Form.Item name="phoneNumberPrefix" noStyle initialValue="86">
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );

    const imageUploadingUrl = viteEnv.VITE_API_URL + "/avatar/upload";
    // const imageUploadingUrl = "/avatar/upload";

    const getCaptcha = () =>
    {
        axiosWithInterceptor.get("/api/account/captcha")
            .then(response =>
            {
                const captchaResponse = response.data.data
                setCaptchaUrl(captchaResponse.captchaBytes);
                setCaptchaId(captchaResponse.captchaId);
            })
    }

    // Get captcha once the component is mounted.
    useEffect(() => getCaptcha(), []);

    return (
        <div>
            <Spin spinning={loadingOfRegistration} size="large" tip="Loading..." delay={500}>
                <div className="wrap-container-registration">
                    <div className="registration-wrap">
                        <Card
                            title="Stella search"
                            bordered={false}
                            style={{
                                width: 500, // Card width: 500 px.
                            }}
                        >
                            <Form
                                {...formItemLayout}
                                form={form}
                                name="register"
                                onFinish={onFinish}
                                initialValues={{residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86'}}
                                style={{maxWidth: 600}}
                                scrollToFirstError
                            >

                                <Form.Item
                                    label="Upload"
                                    name="avatarUrl"
                                    valuePropName="avatar"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please upload your avatar!',
                                        },
                                    ]}
                                >
                                    <Upload
                                        name="avatarFile"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        action={imageUploadingUrl}
                                        beforeUpload={beforeUploadAvatar}
                                        onChange={handleChange}
                                        accept="image/jpeg, image/png"
                                        method={"POST"}
                                    >
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt="avatar"
                                                style={{
                                                    width: '100%',
                                                }}
                                            />
                                        ) : (
                                            uploadButton
                                        )}
                                    </Upload>
                                </Form.Item>

                                <Form.Item
                                    name="username"
                                    label="Username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your username!',
                                        },
                                        () => ({
                                            validator(_, value) {
                                                const usernamePattern = /^[A-Za-z][A-Za-z0-9\-_#@!$%]{4,32}$/;
                                                if (!value || usernamePattern.test(value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error("The username can only starts with an English alphabet and can only contains English alphabets, numbers, '_'. And a username should contains 5 - 32 characters."));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input allowClear/>
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="E-mail"
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'The input is not valid E-mail!',
                                        },
                                        {
                                            required: true,
                                            message: 'Please input your E-mail!',
                                        },
                                    ]}
                                >
                                    <Input allowClear/>
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label="Password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        },
                                        () => ({
                                            validator(_, value) {
                                                const passwordPattern = /[A-Za-z0-9\-_#@!$%]{8,32}/;

                                                if (!value || passwordPattern.test(value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error("The password can only contains English alphabets, numbers and allowed punctuations (-_#@!$%). And a password should contains 8 - 32 characters."));
                                            }
                                        })
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password allowClear/>
                                </Form.Item>

                                <Form.Item
                                    name="confirmedPassword"
                                    label="Confirm Password"
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please confirm your password!',
                                        },
                                        ({getFieldValue}) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password allowClear/>
                                </Form.Item>

                                <Form.Item
                                    name="nickname"
                                    label="Nickname"
                                    tooltip="What do you want others to call you?"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your nickname!',
                                            whitespace: true
                                        },
                                        () => ({
                                            validator(_, value) {
                                                const usernamePattern = /^[A-Za-z][A-Za-z0-9\-_#@!$%]{4,32}$/;
                                                if (!value || usernamePattern.test(value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error("The nickname can only starts with an English alphabet and can only contains English alphabets, numbers, '_'. And a username should contains 5 - 32 characters."));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input allowClear/>
                                </Form.Item>

                                <Form.Item
                                    name="phoneNumber"
                                    label="Phone Number"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your phone number!'
                                        },
                                        () => ({
                                            validator(_, value) {
                                                const phoneNumberPattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

                                                if (!value || phoneNumberPattern.test(value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error("Please enter a correct phone number."));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input addonBefore={prefixSelector} style={{width: '100%'}} allowClear/>
                                </Form.Item>

                                <Form.Item
                                    name="gender"
                                    label="Gender"
                                    rules={[{required: true, message: 'Please select gender!'}]}
                                    initialValue="secret"
                                >
                                    <Select placeholder="select your gender">
                                        <Option value="male">Male</Option>
                                        <Option value="female">Female</Option>
                                        <Option value="secret">Secret</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item label="Captcha" extra="We must make sure that your are a human.">
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="captcha"
                                                noStyle
                                                rules={[{required: true, message: 'Please input the captcha you got!'}]}
                                            >
                                                <Input allowClear/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Button onClick={getCaptcha}>Get captcha</Button>
                                        </Col>
                                        <Col span={12}>
                                            <img src={captchaUrl} alt={"Captcha"}/>
                                        </Col>
                                    </Row>
                                </Form.Item>

                                <Form.Item
                                    name="acceptAgreement"
                                    valuePropName="checked"
                                    rules={[
                                        {
                                            validator: (_, value) =>
                                                value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                                        },
                                    ]}
                                    {...tailFormItemLayout}
                                >
                                    <Checkbox>
                                        I have read the <a href="">agreement</a>
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item {...tailFormItemLayout}>
                                    <Space>
                                        <Button type="primary" htmlType="submit">
                                            Register
                                        </Button>

                                        <Button htmlType='reset'>Reset</Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </div>
            </Spin>
        </div>
    );
}

export default Registration;
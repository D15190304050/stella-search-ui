import {useEffect, useState} from 'react';
import {InboxOutlined, LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Divider, Form, GetProp, Input, Select, Space, Spin, UploadProps} from 'antd';
import { message, Upload } from 'antd';
import TextArea from "antd/es/input/TextArea";
import FileConstants from "../../constants/FileConstants.ts";
import axiosWithInterceptor, {formHeader, jsonHeader} from "../../axios/axios.tsx";
import qs from "qs";
import {
    ComposeVideoChunksRequest,
    NewVideoUploadingTaskRequest,
    SetVideoInfoRequest
} from "../../dtos/VideoPlayInfo.ts";
import {VideoUploadingOption} from "../../dtos/VideoUploadingOptions.ts";
import {useNavigate} from "react-router-dom";
import {NavigateFunction} from "react-router/dist/lib/hooks";
import RoutePaths from "../../constants/RoutePaths.ts";
import {isNullOrUndefined} from "../../commons/Common.ts";
import {NameValuePair} from "../../dtos/KeyValuePair.ts";

const { Dragger } = Upload;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const exceptionalFields: string[] = ["coverUrl"];

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 4,
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
            span: 24,
            offset: 0,
        },
    },
};

function sliceFile(file, chunkSize: number)
{
    const slices = [];
    for (let i = 0; i < file.size; i += chunkSize)
        slices.push(file.slice(i, i + chunkSize));

    return slices;
}

const beforeUploadCover = (file) => {
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

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const VideoInfoSetter = ({sourceVideoId}) =>
{
    const [loading, setLoading] = useState<boolean>(true);
    const [videoCoverUrl, setVideoCoverUrl] = useState<string | null>(null);
    const [videoUploadingOption, setVideoUploadingOption] = useState<VideoUploadingOption | null>(null);
    const [videoId, setVideoId] = useState<number>(0);
    const [enableUploading, setEnableUploading] = useState<boolean>(true);

    const [form] = Form.useForm();
    const navigate: NavigateFunction = useNavigate();

    const handleReset = () => {
        form.resetFields();
        setVideoCoverUrl(null);
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const uploadVideo = async (options) =>
    {
        const { file, onSuccess, onError, onProgress } = options;

        // console.log("file to upload = ", file);
        const videoFileName: string = file.name;
        const lastIndexOfDot: number = videoFileName.lastIndexOf(".");
        const videoFileExtension: string = videoFileName.substring(lastIndexOfDot);

        const fileSlices = sliceFile(file, FileConstants.DefaultFileChunkSize);

        // Generate video uploading task.
        const newVideoUploadingTaskRequest: NewVideoUploadingTaskRequest =
            {
                videoChunkCount: fileSlices.length,
                videoFileExtension: videoFileExtension,
            };
        const taskIdResponse = await axiosWithInterceptor.get("/api/video/generate-task",
            {
                params: newVideoUploadingTaskRequest,
                paramsSerializer: params => qs.stringify(params)
            });

        const taskId: string = taskIdResponse.data.data;

        let progress: number = 0;

        // Upload video chunks.
        for (let i: number = 0; i < fileSlices.length; i++)
        {
            const formData: FormData = new FormData();

            formData.append("videoChunk", fileSlices[i], `slice-${i}`);
            formData.append("videoChunkIndex", "" + i);
            formData.append("videoUploadingTaskId", taskId);

            try
            {
                await axiosWithInterceptor.post("/api/video/upload-chunk", formData, formHeader);

                progress = 100 * i / fileSlices.length;
                onProgress({percent: progress}, file);
            }
            catch (error)
            {
                console.error("Error when uploading video: ", error);
            }

            onProgress({percent: 100}, file);
        }

        // Compose video chunks.
        const composeVideoChunksRequest: ComposeVideoChunksRequest = {videoUploadingTaskId: taskId};
        const videoIdResponse = await axiosWithInterceptor.post("/api/video/compose-chunks", composeVideoChunksRequest, jsonHeader);

        const videoId: number = videoIdResponse.data.data;
        setVideoId(videoId);

        onSuccess();
    };

    const dragProps: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        customRequest: uploadVideo,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        accept: "video/mp4",
        withCredentials: true
    };

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
            });
        }
    };

    const onSubmit = (values) =>
    {
        if (videoId === 0)
        {
            message.error("You must upload a video before submitting the form.");
            return;
        }

        if (isNullOrUndefined(videoCoverUrl))
        {
            message.error("You must upload a cover of video before submitting the form.");
            return;
        }

        values.coverUrl = videoCoverUrl;
        const setVideoInfo = {...values, videoId: videoId};

        if (enableUploading)
        {
            axiosWithInterceptor.post("/api/video/set-info", setVideoInfo, jsonHeader).then(response =>
            {
                message.info("Submitting success, waiting for auditing.")
                    .then(() => navigate(RoutePaths.VideoManagement));
            });
        }
        else
        {
            axiosWithInterceptor.put("/api/video/update", setVideoInfo, jsonHeader).then(response =>
            {
                message.info("Submitting success, waiting for auditing.")
                    .then(() => navigate(RoutePaths.VideoManagement));
            });
        }
    }

    const uploadVideoCover = async (options) =>
    {
        const {file, onSuccess, onError, onProgress} = options;

        const formData: FormData = new FormData();
        formData.append("coverFile", file);

        const response = await axiosWithInterceptor.post("/api/video/upload-cover", formData, formHeader);

        const videoCoverUrl: string = response.data.data;
        setVideoCoverUrl(videoCoverUrl);
        setLoading(false);

        // Done uploading video cover.
        onProgress({percent: 100}, file);
        onSuccess();
    }

    useEffect(() =>
    {
        (async () =>
        {
            // Get video uploading options.
            const response = await axiosWithInterceptor.get("/api/video/uploading-options");
            const videoUploadingOption = response.data.data as VideoUploadingOption;
            setVideoUploadingOption(videoUploadingOption);

            if (isNullOrUndefined(sourceVideoId))
                setEnableUploading(true);
            else
            {
                setVideoId(sourceVideoId)
                setEnableUploading(false);

                const videoInfoResponse = await axiosWithInterceptor.get("/api/video/info",
                    {
                        params: {videoId: sourceVideoId},
                        paramsSerializer: params => qs.stringify(params)
                    });
                const videoInfo: SetVideoInfoRequest = videoInfoResponse.data.data;

                const fieldsValue = Object.entries(videoInfo).reduce((acc, [name, value]) => {
                    if (!exceptionalFields.includes(name))
                    {
                        acc = [...acc, {
                            name: name,
                            value: value
                        }];
                    }

                    return acc;
                }, [] as NameValuePair[]);

                setVideoCoverUrl(videoInfo.coverUrl);
                form.setFields(fieldsValue);
            }

            setLoading(false);
        })();
    }, []);

    return (
        <Spin spinning={loading} size="large" tip="Loading..." delay={500}>
            <div>
                <Dragger {...dragProps} disabled={!enableUploading}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined/>
                    </p>
                    <p className="ant-upload-text">Click or drag video file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Strictly prohibited from uploading company data or other
                        banned files.
                    </p>
                </Dragger>
                <Divider/>
                <Form
                    {...formItemLayout}
                    form={form}
                    name="videoUploader"
                    onFinish={onSubmit}
                    scrollToFirstError
                    onReset={handleReset}
                >
                    <Form.Item
                        label="Cover"
                        name="coverUrl"
                        valuePropName="fileList"
                        getValueFromEvent={({ fileList }) => fileList}
                    >
                        <Upload
                            name="coverFile"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            customRequest={uploadVideoCover}
                            beforeUpload={beforeUploadCover}
                            onChange={handleChange}
                            accept="image/jpeg, image/png"
                            method={"POST"}
                        >
                            {videoCoverUrl ? <img src={videoCoverUrl} alt="Cover" style={{width: '100%'}}/> : uploadButton}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the title of your video.',
                            },
                        ]}
                    >
                        <Input allowClear/>
                    </Form.Item>

                    <Form.Item
                        name="videoCreationType"
                        label="Video creation type"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the type of your video.',
                            },
                        ]}
                    >
                        <Select options={videoUploadingOption?.creationTypeOptions.map(option =>
                            ({
                                label: option.title,
                                value: option.value
                            })
                        )}/>
                    </Form.Item>

                    <Form.Item
                        name="section"
                        label="Section"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the section of your video.',
                            },
                        ]}
                    >
                        <Select options={videoUploadingOption?.videoSectionOptions.map(option =>
                            ({
                                label: option.title,
                                value: option.value
                            })
                        )}/>
                    </Form.Item>

                    <Form.Item
                        name="labels"
                        label="Labels"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the labels of your video.',
                            },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            maxCount={5}
                            options={videoUploadingOption?.videoLabelOptions.map(option =>
                                ({
                                    label: option.title,
                                    value: option.value
                                })
                            )}/>
                    </Form.Item>

                    <Form.Item
                        name="introduction"
                        label="Introduction"
                    >
                        <TextArea/>
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>

                            <Button htmlType="reset">Reset</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    );
}

export default VideoInfoSetter;
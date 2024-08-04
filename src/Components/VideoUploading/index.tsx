import {useEffect, useState} from 'react';
import {InboxOutlined, LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Divider, Form, GetProp, Input, Select, Space, Spin, UploadProps} from 'antd';
import { message, Upload } from 'antd';
import TextArea from "antd/es/input/TextArea";
import FileConstants from "../../constants/FileConstants.ts";
import axiosWithInterceptor, {jsonHeader} from "../../axios/axios.tsx";
import qs from "qs";
import {ComposeVideoChunksRequest, NewVideoUploadingTaskRequest} from "../../dtos/VideoInfo.ts";
import {VideoUploadingOption} from "../../dtos/VideoUploadingOptions.ts";

const viteEnv = import.meta.env;

const { Dragger } = Upload;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

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

const customUpload = async (options) =>
{
    // 在这里实现你的分块上传逻辑
    // 使用 options.file 获取文件对象，
    const { file, onSuccess, onError, onProgress } = options;

    console.log("file to upload = ", file);
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
            console.log("formData = ", formData);
            await axiosWithInterceptor.post("/api/video/upload-chunk", formData, {headers: {"Content-Type": "multipart/form-data"}});

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
    await axiosWithInterceptor.post("/api/video/compose-chunks", composeVideoChunksRequest, jsonHeader);

    // console.log("Finished uploading...");
};

const dragProps: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    customRequest: customUpload,
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
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

const VideoUploading = () =>
{
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState<string>();
    const [videoUploadingOption, setVideoUploadingOption] = useState<VideoUploadingOption | null>(null);

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const onSubmit = (values) =>
    {
        console.log("values = ", values);
    }

    useEffect(() =>
    {
        (async () =>
        {
            // Get video uploading options.
            const response = await axiosWithInterceptor.get("/api/video/uploading-options");
            const videoUploadingOption = response.data.data as VideoUploadingOption;
            setVideoUploadingOption(videoUploadingOption);

            setLoading(false);
        })();
    }, []);

    return (
        <Spin spinning={loading} size="large" tip="Loading..." delay={500}>
            <div>
                <Dragger {...dragProps}>
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
                    name="videoUploader"
                    onFinish={onSubmit}
                    scrollToFirstError
                >
                    <Form.Item

                        label="Cover"
                        name="coverUrl"
                        valuePropName="cover"
                        rules={[
                            {
                                required: true,
                                message: 'Please upload the cover of your video!',
                            },
                        ]}
                    >
                        <Upload
                            name="coverFile"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action={viteEnv.VITE_API_URL + "/api/video/upload-cover"}
                            beforeUpload={beforeUploadCover}
                            onChange={handleChange}
                            accept="image/jpeg, image/png"
                            method={"POST"}
                        >
                            {imageUrl ? <img src={imageUrl} alt="Cover" style={{width: '100%'}}/> : uploadButton}
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
                        <Select options={videoUploadingOption?.videoLabelOptions.map(option =>
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

                            <Button htmlType='reset'>Reset</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    );
}

export default VideoUploading;
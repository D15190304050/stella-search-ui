import {useEffect, useState} from 'react';
import {List, Avatar, Input, Button, Typography, message, Col, Pagination, Row} from 'antd';
import {AddCommentsRequest, GetVideoCommentsRequest, VideoComment} from "../../dtos/VideoComment.ts";
import {useSelector} from "react-redux";
import {LoginState} from "../../dtos/LoginState.ts";
import axiosWithInterceptor, {jsonHeader} from "../../axios/axios.tsx";
import qs from "qs";

const DefaultPageSize: number = 10;
const { Paragraph } = Typography;

const VideoCommentArea = ({videoId}: {videoId: number}) =>
{
    const [newComment, setNewComment] = useState<string>("");
    const [commentCount, setCommentCount] = useState<number>(0);
    const [comments, setComments] = useState<VideoComment[]>([]);
    const [pageCapacity, setPageCapacity] = useState<number>(DefaultPageSize);
    const [pageIndex, setPageIndex] = useState<number>(1);

    const userInfo: LoginState = useSelector((state) => state.userInfo);

    const getComments = async (page: number, pageSize: number) =>
    {
        setPageCapacity(pageSize);
        setPageIndex(page);

        const getVideoCommentsRequest: GetVideoCommentsRequest =
            {
                videoId: videoId,
                pageCapacity: pageSize,
                pageIndex: page,
            };

        const response = await axiosWithInterceptor.get("/api/comment/list", {
            params: getVideoCommentsRequest,
            paramsSerializer: params => qs.stringify(params)
        });

        setComments(response.data.data.data);
        setCommentCount(response.data.data.total);
    }

    useEffect(() =>
    {
        (async () =>
        {
            await getComments(pageIndex, pageCapacity);
        })();
    }, []);

    const submitComment = (e) =>
    {
        e.preventDefault();

        const content = newComment.trim();

        if (!content)
            return;

        const addCommentsRequest: AddCommentsRequest =
            {
                videoId: videoId,
                content: content,
                parentId: -1,
            };

        axiosWithInterceptor.post("/api/comment/add", addCommentsRequest, jsonHeader)
            .then(response =>
            {
                const success: boolean = response.data.success;
                if (success)
                {
                    console.log("userInfo = ", userInfo);

                    const topComment: VideoComment =
                        {
                            id: response.data.data,
                            userId: userInfo.id,
                            nickname: userInfo.nickname,
                            avatarUrl: userInfo.avatarUrl ?? "",
                            content: content,
                            creationTime: new Date(),
                        };

                    const topCommentsOnPage = comments.slice(0, pageCapacity - 1);

                    setComments([topComment, ...topCommentsOnPage]);
                    setCommentCount(commentCount + 1);
                    setNewComment("");
                }
                else
                    message.error(response.data.message);
            });
    };

    const onPageChange = async (page: number, pageSize: number) => await getComments(page, pageSize);

    const deleteComment = async (id: number) =>
    {
        const deleteCommentResponse = await axiosWithInterceptor.post("/api/comment/delete", {id: id}, jsonHeader);
        if (deleteCommentResponse.data.success)
        {
            await getComments(pageIndex, pageCapacity);
        }
        else
            message.error(deleteCommentResponse.data.message);
    }

    return (
        <div style={{textAlign: "left"}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                <Input.TextArea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    maxLength={500}
                    autoSize={{minRows: 2, maxRows: 10}}
                />
                <p style={{textAlign: "right"}}>{newComment.length}/500</p>
                <Button type="primary" onClick={submitComment} style={{marginTop: "5px"}}>
                    Submit
                </Button>
            </div>

            <h1>Comments</h1>

            <List
                itemLayout="horizontal"
                dataSource={comments}
                renderItem={(item) => (
                    <List.Item
                        key={"comment" + item.id}
                        actions={item.userId === userInfo.id ? [<Button type="link" onClick={() => deleteComment(item.id)}>Delete</Button>] : []}>
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatarUrl} />}
                            title={item.nickname}
                            description={<Paragraph>{item.content}</Paragraph>}
                        />
                    </List.Item>
                )}
            />

            <Row>
                <Col span={24}>
                    <Pagination
                        total={commentCount}
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total) => `Total comments: ${total}`}
                        onChange={onPageChange}
                        defaultPageSize={DefaultPageSize}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default VideoCommentArea;
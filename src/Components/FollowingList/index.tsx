import {Avatar, Button, List, message, Pagination, Spin, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {
    UserFollowingInfo,
} from "../../dtos/FollowInfo.ts";
import axiosWithInterceptor, {jsonHeader} from "../../axios/axios.tsx";
import qs from "qs";
import {PaginationParam} from "../../dtos/CommonQueryParams.ts";

const FollowingList = ({defaultPageSize}: { defaultPageSize: number }) =>
{
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [totalFollowings, setTotalFollowings] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [followings, setFollowings] = useState<UserFollowingInfo[]>([]);

    const setFollowState = (userId: number): void =>
    {
        const userFollowingInfo: UserFollowingInfo = followings.filter(x => x.userId === userId)[0];
        const nextFollowState: boolean = !userFollowingInfo.followState;

        const updatedFollowingInfo: UserFollowingInfo[] = followings.map(user =>
            user.userId === userId ?
                {...user, followState: nextFollowState} :
                user
        );
        setFollowings(updatedFollowingInfo);

        if (nextFollowState)
        {
            axiosWithInterceptor.post("/api/user-following/follow", {userId: userId}, jsonHeader)
                .then(response =>
                {
                    message.info("Follow successfully.");
                });
        }
        else
        {
            axiosWithInterceptor.post("/api/user-following/unfollow", {userId: userId}, jsonHeader)
                .then(response =>
                {
                    message.info("Unfollow successfully.");
                });
        }
    }

    const onPageChange = (page: number, pageSize: number) => getFollowings(page, pageSize);

    const getFollowings = (page: number, pageSize: number) =>
    {
        setLoading(true);
        setPageIndex(page);
        const followInfoRequest: PaginationParam =
            {
                pageIndex: page,
                pageCapacity: pageSize,
            };

        axiosWithInterceptor.get("/api/user-following/followings", {
            params: followInfoRequest,
            paramsSerializer: params => qs.stringify(params)
        })
            .then(response =>
            {
                const followings: UserFollowingInfo[] = response.data.data.data;
                setFollowings(followings);

                setTotalFollowings(response.data.data.total);

                setLoading(false);
            });
    }

    useEffect(() =>
    {
        getFollowings(1, defaultPageSize);
    }, []);

    return (
        <Spin spinning={loading} size="large" tip="Loading..." delay={500}>
            <List
                style={{textAlign: "left"}}
                itemLayout="horizontal"
                size="large"
                dataSource={followings}
                renderItem={(item) => (
                    <List.Item
                        key={item.userId}
                        actions={[
                            <Button type="default">Direct Message</Button>,
                            <Tooltip title={item.followState ? "Click to unfollow" : "Click to follow"}>
                                <Button
                                    type="primary"
                                    onClick={() => setFollowState(item.userId)}
                                    style={{minWidth: "120px"}}
                                >
                                    {item.followState ? "Following" : "Follow"}
                                </Button>
                            </Tooltip>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatarUrl} />}
                            title={item.nickname}
                        />
                    </List.Item>
                )}
            />
            <Pagination
                current={pageIndex}
                total={totalFollowings}
                showQuickJumper
                showTotal={(total) => `Total followings: ${total}`}
                onChange={onPageChange}
                defaultPageSize={defaultPageSize}
            />
        </Spin>
    );
}

export default FollowingList;
import {Layout, Menu, Pagination, Spin} from "antd";
import React, {useEffect, useState} from "react";
import {FolderOpenFilled, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {FollowCount, FollowMenuItem} from "../../dtos/FollowInfo.ts";
import FollowingList from "../FollowingList";
import FollowerList from "../FollowerList";

const DefaultPageSize: number = 20;
const KeyFollowing: string = "Followings";
const KeyFollower: string = "Followers";
const { Sider, Content } = Layout;

const FollowingAndFollowerPage = () =>
{
    const [followCount, setFollowCount] = useState<FollowCount>({followingCount: 0, followerCount: 0});

    const [currentFollowMenuKey, setCurrentFollowMenuKey] = useState<string>(KeyFollowing);

    const followMenuItems: FollowMenuItem[] = [
        {
            key: KeyFollowing,
            icon: <UserOutlined />,
            title: "My followings",
            count: followCount.followingCount
        },
        {
            key: KeyFollower,
            icon: <TeamOutlined />,
            title: "My followers",
            count: followCount.followerCount
        }
    ];

    const renderFollowMenuItem = (followMenuItem: FollowMenuItem) =>
    {
        return (
            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                <span>
                    {followMenuItem.icon}
                    {followMenuItem.title}
                </span>
                <span>{followMenuItem.count}</span>
            </div>
        );
    }

    const changeFollowType = ({key}: { key: string }) =>
    {
        setCurrentFollowMenuKey(key);
    }

    useEffect(() =>
    {

    }, []);

    return (
        <div>
            <Layout style={{ minHeight: '60vh' }}>
                <Sider width={256}>
                    <Menu
                        selectedKeys={[currentFollowMenuKey]}
                        onClick={changeFollowType}
                        mode="inline"
                        style={{ height: '100%', borderRight: 0, textAlign: 'left' }}
                        items={followMenuItems.map((item) =>
                            (
                                {
                                    key: item.key,
                                    label: renderFollowMenuItem(item)
                                }
                            )
                        )}
                    />
                </Sider>
                <Content style={{margin: '24px 16px', padding: 24, background: '#fff', minHeight: 360}}>
                    {
                        currentFollowMenuKey === KeyFollowing
                            ? <FollowingList defaultPageSize={DefaultPageSize}/>
                            : <FollowerList defaultPageSize={DefaultPageSize}/>
                    }
                </Content>
            </Layout>
        </div>
    );
}

export default FollowingAndFollowerPage;
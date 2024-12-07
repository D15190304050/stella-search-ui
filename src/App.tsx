import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./Components/Home";
import GlobalLayout from "./Components/GlobalLayout";
import RoutePaths from "./constants/RoutePaths.ts";
import VideoManagement from "./Components/VideoManagement";
import VideoUploading from "./Components/VideoUploading";
import VideoUpdate from "./Components/VideoUpdate";
import VideoPlayer from "./Components/VideoPlayer";
import VideoPlayPage from "./Components/VideoPlayPage";
import PlaylistPage from "./Components/PlaylistPage";
import FollowingAndFollowerPage from "./Components/FollowingAndFollowerPage";

function App()
{
    return (
        <GlobalLayout>
            <Routes>
                <Route path={RoutePaths.Home} element={<Home/>}/>
                <Route path={RoutePaths.VideoManagement} element={<VideoManagement/>}/>
                <Route path={RoutePaths.VideoUploading} element={<VideoUploading/>}/>
                <Route path={RoutePaths.VideoUpdate} element={<VideoUpdate/>}/>
                <Route path={RoutePaths.VideoPlayPage} element={<VideoPlayPage/>}/>
                <Route path={RoutePaths.Playlist} element={<PlaylistPage/>}/>
                <Route path={RoutePaths.Follow} element={<FollowingAndFollowerPage/>}/>
            </Routes>
        </GlobalLayout>
    );
}

export default App

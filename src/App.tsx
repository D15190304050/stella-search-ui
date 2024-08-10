import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./Components/Home";
import GlobalLayout from "./Components/GlobalLayout";
import RoutePaths from "./constants/RoutePaths.ts";
import VideoManagement from "./Components/VideoManagement";
import VideoUploading from "./Components/VideoUploading";
import VideoUpdate from "./Components/VideoUpdate";

function App()
{
    return (
        <GlobalLayout>
            <Routes>
                <Route path={RoutePaths.Home} element={<Home/>}/>
                <Route path={RoutePaths.VideoManagement} element={<VideoManagement/>}/>
                <Route path={RoutePaths.VideoUploading} element={<VideoUploading/>}/>
                <Route path={RoutePaths.VideoUpdate} element={<VideoUpdate/>}/>
            </Routes>
        </GlobalLayout>
    );
}

export default App

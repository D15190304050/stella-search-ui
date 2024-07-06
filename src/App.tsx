import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./Components/Home";
import GlobalLayout from "./Components/GlobalLayout";
import RoutePaths from "./constants/RoutePaths.ts";
import VideoManagement from "./Components/VideoManagement";
import VideoUploading from "./Components/VideoUploading";

function App()
{
    return (
        <GlobalLayout>
            <Routes>
                <Route path={RoutePaths.Home} element={<Home/>}/>
                <Route path={RoutePaths.VideoManagement} element={<VideoManagement/>}/>
                <Route path={RoutePaths.VideoUploading} element={<VideoUploading/>}/>
            </Routes>
        </GlobalLayout>
    );
}

export default App

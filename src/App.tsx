import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./Components/Home";
import GlobalLayout from "./Components/GlobalLayout";
import VideoSubmission from "./Components/VideoSubmission";
import RoutePaths from "./constants/RoutePaths.ts";

function App()
{
    return (
        <GlobalLayout>
            <Routes>
                <Route path={RoutePaths.Home} element={<Home/>}/>
                <Route path={RoutePaths.VideoSubmission} element={<VideoSubmission/>}/>
            </Routes>
        </GlobalLayout>
    );
}

export default App

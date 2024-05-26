import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./Components/Home";
import GlobalLayout from "./Components/GlobalLayout";
import React, {useEffect, useState} from "react";
import store from './store';
import { Provider } from 'react-redux';
import Login from "./Components/Login";

function App() {
    return (
        <GlobalLayout>
            <Routes>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </GlobalLayout>
    );
}

export default App

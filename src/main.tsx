import ReactDOM from 'react-dom/client'
import {Routes, Route, BrowserRouter} from "react-router-dom"
import {ConfigProvider} from 'antd';
import App from './App.tsx'
import './index.css'
import React from 'react';
import whyDidYouRender from '@welldone-software/why-did-you-render';
import store from "./store.tsx";
import {Provider} from "react-redux";
import Login from "./Components/Login";
import Registration from "./Components/Registration";
import AuthKeys from "./constants/AuthKeys.ts";

const whyDidYouRenderOptions = {
    // 可以自定义日志输出样式或行为的选项
    logOnDifferentValues: true, // 默认true，当props或state值变化时记录日志
    trackAllPureComponents: false, // 默认false，是否跟踪所有的PureComponent
    // 其他可配置项...
};
whyDidYouRender(React, whyDidYouRenderOptions);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ConfigProvider>
        <BrowserRouter>
            <Provider store={store}>
                <Routes>
                    <Route path={AuthKeys.LoginUrl} element={<Login/>}/>
                    <Route path="/register" element={<Registration/>}/>
                    <Route path="/*" element={<App/>}/>
                </Routes>
            </Provider>
        </BrowserRouter>
    </ConfigProvider>,
)

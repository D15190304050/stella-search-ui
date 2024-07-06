const chris = {
    id: 2,
    username: "Chris",
    nickname: "Chris",
    avatarUrl: "http://xxx.jpg"
}

const initialState = {
    userInfo: null
    // userInfo: chris
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            return { ...state, userInfo: action.payload };
        // 添加更多cases如logout等
        default:
            return state;
    }
};

export default authReducer;
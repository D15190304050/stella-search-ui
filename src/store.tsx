// store.js
import { legacy_createStore as createStore} from '@reduxjs/toolkit'
import authReducer from './authReducer';

const store = createStore(authReducer);

export default store;
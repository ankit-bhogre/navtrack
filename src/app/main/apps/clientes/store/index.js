import { combineReducers } from '@reduxjs/toolkit';
import contacts from './clientesSlice';
import user from './userSlice';

const reducer = combineReducers({
	contacts,
	user
});

export default reducer;



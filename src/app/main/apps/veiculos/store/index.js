import { combineReducers } from '@reduxjs/toolkit';
import contacts from './veiculoSlice';
import user from './userSlice';

const reducer = combineReducers({
	contacts,
	user
});

export default reducer;

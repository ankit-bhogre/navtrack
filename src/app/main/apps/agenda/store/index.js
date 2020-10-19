import { combineReducers } from '@reduxjs/toolkit';
import contacts from './agendaSlice';
import user from './userSlice';

const reducer = combineReducers({
	contacts,
	user
});

export default reducer;

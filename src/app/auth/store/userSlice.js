import { createSlice } from '@reduxjs/toolkit';
import history from '@history';
import _ from '@lodash';
import { setInitialSettings, setDefaultSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import jwtService from 'app/services/jwtService';

export const setUserDataAuth0 = tokenData => async dispatch => {
	const user = {
		role: ['admin'],
		from: 'auth0',
		data: {
			displayName: tokenData.username || tokenData.name,
			photoURL: tokenData.picture,
			email: tokenData.email,
			settings:
				tokenData.user_metadata && tokenData.user_metadata.settings ? tokenData.user_metadata.settings : {},
			shortcuts:
				tokenData.user_metadata && tokenData.user_metadata.shortcuts ? tokenData.user_metadata.shortcuts : []
		}
	};

	return dispatch(setUserData(user));
};



export const setUserData = user => async (dispatch, getState) => {
	/*
        You can redirect the logged-in user to a specific route depending on his role
         */

	history.location.state = {
		redirectUrl: user.redirectUrl // for example 'apps/academy'
	};

	/*
    Set User Settings
     */
	dispatch(setDefaultSettings(user.data.settings));

	dispatch(setUser(user));
};

export const updateUserSettings = settings => async (dispatch, getState) => {
	const oldUser = getState().auth.user;
	const user = _.merge({}, oldUser, { data: { settings } });

	dispatch(updateUserData(user));

	return dispatch(setUserData(user));
};

export const updateUserShortcuts = shortcuts => async (dispatch, getState) => {
	const { user } = getState().auth;
	const newUser = {
		...user,
		data: {
			...user.data,
			shortcuts
		}
	};

	dispatch(updateUserData(user));

	return dispatch(setUserData(newUser));
};

export const logoutUser = () => async (dispatch, getState) => {
	const { user } = getState().auth;

	if (!user.role || user.role.length === 0) {
		// is guest
		return null;
	}

	history.push({
		pathname: '/'
	});

			jwtService.logout();

	dispatch(setInitialSettings());

	dispatch(userLoggedOut());
};

export const updateUserData = user => async (dispatch, getState) => {
	if (!user.role || user.role.length === 0) {
		// is guest
		return;
	}
			jwtService
				.updateUserData(user)
				.then(() => {
					dispatch(showMessage({ message: 'User data saved with api' }));
				})
				.catch(error => {
					dispatch(showMessage({ message: error.message }));
				});
};

const initialState = {
	role: [], // guest
	data: {
		displayName: 'John Doe',
		photoURL: 'assets/images/avatars/Velazquez.jpg',
		email: 'johndoe@withinpixels.com',
		shortcuts: ['calendar', 'mail', 'contacts', 'todo']
	}
};

const userSlice = createSlice({
	name: 'auth/user',
	initialState,
	reducers: {
		setUser: (state, action) => action.payload,
		userLoggedOut: (state, action) => initialState
	},
	extraReducers: {}
});

export const { setUser, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;

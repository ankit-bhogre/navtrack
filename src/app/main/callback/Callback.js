import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserDataAuth0 } from 'app/auth/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';

function Callback(props) {
	const dispatch = useDispatch();

	useEffect(() => {
	}, [dispatch]);

	return <FuseSplashScreen />;
}

export default Callback;

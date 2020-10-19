import axios from 'axios';

const api = axios.create({
	baseURL: 'https://dev.beepz.com.br/'
	//  baseURL:process.env.REACT_APP_SERVER_NAME
});

export default api;

import React from 'react';
import { Redirect } from 'react-router-dom';

const MotoristaAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/motorista/:id',
			component: React.lazy(() => import('./MotoristaApp'))
		},
		{
			path: '/apps/motorista',
			component: () => <Redirect to="/apps/motorista/all" />
		}
	]
};

export default MotoristaAppConfig;

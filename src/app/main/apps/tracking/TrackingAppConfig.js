import React from 'react';
import { Redirect } from 'react-router-dom';

const TrackingAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/tracking',
			component: React.lazy(() => import('./TrackingApp'))
		}
		// {
		// 	path: '/apps/tracking',
		// 	component: () => <Redirect to="/apps/clientes/all" />
		// }
	]
};

export default ClientesAppConfig;

import React from 'react';
import { Redirect } from 'react-router-dom';

const ParadaAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/parada/:id',
			component: React.lazy(() => import('./ParadaApp'))
		},
		{
			path: '/apps/parada',
			component: () => <Redirect to="/apps/parada/all" />
		}
	]
};

export default ParadaAppConfig;

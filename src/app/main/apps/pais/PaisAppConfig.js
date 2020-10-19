import React from 'react';
import { Redirect } from 'react-router-dom';

const PaisAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/pais/:id',
			component: React.lazy(() => import('./PaisApp'))
		},
		{
			path: '/apps/pais',
			component: () => <Redirect to="/apps/pais/all" />
		}
	]
};

export default PaisAppConfig;

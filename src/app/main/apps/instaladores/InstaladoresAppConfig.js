import React from 'react';
import { Redirect } from 'react-router-dom';

const InstaladoresAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/instaladores/:id',
			component: React.lazy(() => import('./InstaladoresApp'))
		},
		{
			path: '/apps/instaladores',
			component: () => <Redirect to="/apps/instaladores/all" />
		}
	]
};

export default InstaladoresAppConfig;

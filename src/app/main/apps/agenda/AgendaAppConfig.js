import React from 'react';
import { Redirect } from 'react-router-dom';

const AgendaAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/agenda/:id',
			component: React.lazy(() => import('./AgendaApp'))
		},
		{
			path: '/apps/agenda',
			component: () => <Redirect to="/apps/agenda/all" />
		}
	]
};

export default AgendaAppConfig;

import React from 'react';
import { Redirect } from 'react-router-dom';

const ViagemAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/viagem/:id',
			component: React.lazy(() => import('./ViagemApp'))
		},
		{
			path: '/apps/viagem',
			component: () => <Redirect to="/apps/viagem/all" />
		}
	]
};

export default ViagemAppConfig;

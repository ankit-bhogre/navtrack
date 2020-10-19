import React from 'react';
import { Redirect } from 'react-router-dom';

const ClientesAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/clientes/:id',
			component: React.lazy(() => import('./ClientesApp'))
		},
		{
			path: '/apps/clientes',
			component: () => <Redirect to="/apps/clientes/all" />
		}
	]
};

export default ClientesAppConfig;
 
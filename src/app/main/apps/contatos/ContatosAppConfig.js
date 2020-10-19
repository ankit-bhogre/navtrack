import React from 'react';
import { Redirect } from 'react-router-dom';

const ContatosAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/contatos/:id',
			component: React.lazy(() => import('./ContatosApp'))
		},
		{
			path: '/apps/contatos',
			component: () => <Redirect to="/apps/contatos/all" />
		}
	]
};

export default ContatosAppConfig;

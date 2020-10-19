import React from 'react';
import { Redirect } from 'react-router-dom';

const UsuarioAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/usuario/:id',
			component: React.lazy(() => import('./UsuarioApp'))
		},
		{
			path: '/apps/usuario',
			component: () => <Redirect to="/apps/usuario/all" />
		}
	]
};

export default UsuarioAppConfig;

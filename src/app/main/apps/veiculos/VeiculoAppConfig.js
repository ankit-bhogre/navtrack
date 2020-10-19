import React from 'react';
import { Redirect } from 'react-router-dom';

const VeiculoAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/veiculo/:id',
			component: React.lazy(() => import('./VeiculoApp'))
		},
		{
			path: '/apps/veiculo',
			component: () => <Redirect to="/apps/veiculo/all" />
		}
	]
};

export default VeiculoAppConfig;

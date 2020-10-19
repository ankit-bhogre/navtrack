
import { authRoles } from 'app/auth';
import i18next from 'i18next';

import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
	{
		id: 'Tracking',
		title: 'Tracking',
		translate: 'Tracking',
		type: 'item',
		url: '/apps/tracking'
	},
	{
		id: 'cliente',
		title: 'Cliente',
		translate: 'Clientes',
		type: 'item',
		//icon: 'school',
		url: '/apps/clientes'
	},
	{
		id: 'viagem',
		title: 'Viagem',
		translate: 'Viagem',
		type: 'item',
		//	icon: 'travel',
		url: '/apps/viagem'
	},
	{
		id: 'motorista',
		title: 'Motorista',
		translate: 'Motorista',
		type: 'item',
		//	icon: 'drive',
		url: '/apps/motorista'
	},
	{
		id: 'veiculo',
		title: 'Veiculo',
		translate: 'Veiculo',
		type: 'item',
		//	icon: 'vehicle',
		url: '/apps/veiculo'
	},
	{
		id: 'pais',
		title: 'Pais',
		translate: 'Pais',
		type: 'item',
		//icon: 'vehicle',
		url: '/apps/pais'
	},
	{
		id: 'contatos',
		title: 'Contatos',
		translate: 'Contatos',
		type: 'item',
		//	icon: 'vehicle',
		url: '/apps/contatos'
	},
	{
		id: 'agenda',
		title: 'Agenda',
		translate: 'Agenda',
		type: 'item',
		//icon: 'vehicle',
		url: '/apps/agenda'
	},
	{
		id: 'parada',
		title: 'Parada',
		translate: 'Parada',
		type: 'item',
		//icon: 'vehicle',
		url: '/apps/parada'
	},
	{
		id: 'usuarios',
		title: 'Usuarios',
		translate: 'Usuarios',
		type: 'item',
		//icon: 'vehicle',
		url: '/apps/usuario'
	},
	{
		id: 'dashboard',
		title: 'Dashboard',
		translate: 'Dashboard',
		type: 'item',
		//icon: 'vehicle',
		url: '/apps/dashboards/analytics'
	},
	{
		id: 'dashboard2',
		title: 'Dashboard Project',
		translate: 'Dashboard Project',
		type: 'item',
		//icon: 'vehicle',
		url: '/apps/dashboards/project'
	},
	{
		id: 'instaladores',
		title: 'Instaladores',
		translate: 'Instaladores',
		type: 'item',
		//icon: 'vehicle',
		url: '/apps/instaladores'
	}

	/*
	pegar como exemplo
			{
				id: 'chat',
				title: 'Chat',
				translate: 'CHAT',
				type: 'item',
				icon: 'chat',
				url: '/apps/chat',
				badge: {
					title: 13,
					bg: 'rgb(9, 210, 97)',
					fg: '#FFFFFF'
				}
			},
			*/
];

export default navigationConfig;
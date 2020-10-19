import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../../../services/api';
import { getUserData } from './userSlice';
import { id } from 'date-fns/locale';

export const getInstaladores = createAsyncThunk(
	'/nvtrack/api/instalador/getAllInstaladores',
	async (routeParams, { getState }) => {
		routeParams = routeParams || getState().InstaladoresApp.contacts.routeParams;

		const response = await api.post('/nvtrack/api/instalador/getAllInstaladores', {
			params: routeParams
		});
		console.log('AQUI RESPONSE DOS INTALADORES ', response);
		const data = await response.data.data.instaladores;

		return { data, routeParams };
	}
);

export const addInstaladores = createAsyncThunk(
	'/nvtrack/api/instalador/saveInstalador',
	async (contact, { dispatch, getState }) => {
		const { CpfCnpj, Cidade, Telefone, Celular } = contact;
		console.log('INSTALADORES CPF, CIDADE, TELEFONE, CELULAR', contact);
		const response = await api.post('/nvtrack/api/instalador/saveInstalador', {
			nome: contact.nome,
			cpf: CpfCnpj,
			identidade: contact.identidade,
			endereco: contact.endereco,
			cidade: Cidade,
			bairro: contact.bairro,
			uf: contact.uf,
			email: contact.email,
			telefone: Telefone,
			celular: Celular,
			observacao: contact.observacao
		});
		console.log('RESPONSE INSTALADORES', response);
		const Data = await response.data.data.instalador;
		console.log('Data INSTALADORES', Data);
		dispatch(getInstaladores());

		return Data;
	}
);
//UPDATE CONCLUIDO
export const updateInstaladores = createAsyncThunk(
	'/nvtrack/api/instalador/updateInstalador',
	async (instalador, { dispatch, getState }) => {
		const { CpfCnpj, Cidade, Telefone, Celular, id } = instalador;
		const response = await api.post('/nvtrack/api/instalador/updateInstalador', {
			id: id,
			nome: instalador.nome,
			endereco: instalador.endereco,
			cpf: instalador.CpfCnpj,
			cidade: instalador.Cidade,
			telefone: instalador.telefone,
			celular: instalador.Celular,
			uf: instalador.uf,
			email: instalador.email,
			observacao: instalador.observacao,
			identidade: instalador.identidade,
			bairro: instalador.bairro
		});
		console.log('Response = ', response);
		const Data = await response.data.data.instalador;
		console.log('Data = ', Data);
		//console.log('Data = ', data.data.nome);
		getInstaladores();
		return Data;
	}
);

export const removeInstalador = createAsyncThunk(
	'/nvtrack/api/instalador/deleteInstalador',
	async (contactId, { dispatch, getState }) => {
		const response = await api.post('/nvtrack/api/instalador/deleteInstalador', { id: contactId });
		const data = await response.data.data.instalador;
		dispatch(getInstaladores());

		return data;
	}
);

export const removeInstaladores = createAsyncThunk(
	'InstaladoresApp/contacts/removeContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contacts', { contactIds });
		const data = await response.data.data.instalador;

		dispatch(getInstaladores());

		return data;
	}
);

export const toggleStarredContact = createAsyncThunk(
	'InstaladoresApp/contacts/toggleStarredContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contact', { contactId });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getInstaladores());

		return data;
	}
);

export const toggleStarredContacts = createAsyncThunk(
	'InstaladoresApp/contacts/toggleStarredContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contacts', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getInstaladores());

		return data;
	}
);

export const setContactsStarred = createAsyncThunk(
	'InstaladoresApp/contacts/setContactsStarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-starred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getInstaladores());

		return data;
	}
);

export const setContactsUnstarred = createAsyncThunk(
	'InstaladoresApp/contacts/setContactsUnstarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-unstarred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getInstaladores());

		return data;
	}
);

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = contactsAdapter.getSelectors(
	state => state.InstaladoresApp.contacts
);

const contactsSlice = createSlice({
	name: 'InstaladoresApp/contacts',
	initialState: contactsAdapter.getInitialState({
		searchText: '',
		routeParams: {},
		contactDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		seIntaladoresSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		openNewInstaladorDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewInstaladorDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditInstaladorDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditInstaladorDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		}
	},
	extraReducers: {
		[updateInstaladores.fulfilled]: contactsAdapter.upsertOne,
		[addInstaladores.fulfilled]: contactsAdapter.addOne,
		[getInstaladores.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;
			contactsAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		}
	}
});

export const {
	seIntaladoresSearchText,
	openNewInstaladorDialog,
	closeNewInstaladorDialog,
	openEditInstaladorDialog,
	closeEditInstaladorDialog
} = contactsSlice.actions;

export default contactsSlice.reducer;

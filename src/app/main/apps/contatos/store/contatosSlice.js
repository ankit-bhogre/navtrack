import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../../../services/api';
import { getUserData } from './userSlice';

export const getContacts = createAsyncThunk(
	'/nvtrack/api/contato/getAllContatos',
	async (routeParams, { getState }) => {
		routeParams = routeParams || getState().ContatosApp.contacts.routeParams;
		const response = await api.post('/nvtrack/api/contato/getAllContatos', {
			params: routeParams
		});

		const data = await response.data.data.contatos;

		return { data, routeParams };
	}
);

export const addContact = createAsyncThunk(
	'/nvtrack/api/contato/saveContato',
	async (contatos, { dispatch, getState }) => {
		const {
			id,
			nome,
			email,
			telefone,
			celular,
			observacao,
			is_email_principal,
			is_alerta_email,
			perfil_mobile_id
		} = contatos;

		const response = await api.post('/nvtrack/api/contato/saveContato', {
			nome: contatos.nome,
			email: contatos.email,
			telefone: contatos.telefone,
			celular: contatos.celular,
			observacao: contatos.observacao,
			is_email_principal: contatos.is_email_principal,
			is_alerta_email: contatos.is_alerta_email,
			perfil_mobile_id: contatos.PerfilMobile
		});
		console.log('RESPONSE ==', response);
		const data = await response.data.data.contato;
		console.log('DATA ==', data);
		dispatch(getContacts());
		return { data };
	}
);
//UPDATE CONCLUIDO
export const updateContact = createAsyncThunk(
	'/nvtrack/api/contato/updateContato',
	async (contact, { dispatch, getState }) => {
		/*foi feito desestruturação para poder passar os dados enviados para o BACK, foi passado 
		apenas contact,mas não estava passando pelo payload, estava indo apenas undfined
		*/
		console.log('OLHA AQUIIIIIIIIIIIIIIIIII ', { contact });
		const {
			nome,
			email,
			telefone,
			celular,
			observacao,
			is_email_principal,
			is_alerta_email,
			perfil_mobile_id
		} = contact;
		const response = await api.post('/nvtrack/api/contato/updateContato', {
			nome,
			email,
			telefone,
			celular,
			observacao,
			is_email_principal,
			is_alerta_email,
			perfil_mobile_id
		});
		console.log('Response = ', response);
		const data = await response.data.data.contato;
		console.log('Data = ', data);
		//console.log('Data = ', data.data.nome);
		dispatch(getContacts());
		return data;
	}
);

export const removeContact = createAsyncThunk(
	'/nvtrack/api/contato/deleteContato',
	async (contactId, { dispatch, getState }) => {
		const response = await api.post('/nvtrack/api/contato/deleteContato', { id: contactId });
		const data = await response.data.data.contato;
		dispatch(getContacts());

		return data;
	}
);

export const removeContacts = createAsyncThunk(
	'/nvtrack/api/contato/deleteContato',
	async (contactIds, { dispatch, getState }) => {
		console.log('IDS ', contactIds);
		const response = await api.post('/nvtrack/api/contato/deleteContato', { id: contactIds });
		const data = await response.data.data.contato;

		dispatch(getContacts());

		return data;
	}
);

export const toggleStarredContact = createAsyncThunk(
	'ContatosApp/contacts/toggleStarredContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contact', { contactId });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getContacts());

		return data;
	}
);

export const toggleStarredContacts = createAsyncThunk(
	'ContatosApp/contacts/toggleStarredContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contacts', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getContacts());

		return data;
	}
);

export const setContactsStarred = createAsyncThunk(
	'ContatosApp/contacts/setContactsStarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-starred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getContacts());

		return data;
	}
);

export const setContactsUnstarred = createAsyncThunk(
	'ContatosApp/contacts/setContactsUnstarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-unstarred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getContacts());

		return data;
	}
);

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = contactsAdapter.getSelectors(
	state => state.ContatosApp.contacts
);

const contactsSlice = createSlice({
	name: 'ContatosApp/contacts',
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
		setContactsSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		openNewContactDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewContactDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditContactDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditContactDialog: (state, action) => {
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
		[updateContact.fulfilled]: contactsAdapter.upsertOne,
		[addContact.fulfilled]: contactsAdapter.addOne,
		[getContacts.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;
			contactsAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		}
	}
});

export const {
	setContactsSearchText,
	openNewContactDialog,
	closeNewContactDialog,
	openEditContactDialog,
	closeEditContactDialog
} = contactsSlice.actions;

export default contactsSlice.reducer;

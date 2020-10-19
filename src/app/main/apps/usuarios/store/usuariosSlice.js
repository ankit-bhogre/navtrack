import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../../../services/api';
import { getUserData } from './userSlice';
//mostrat todos os usuarios
export const getUsuarios = createAsyncThunk(
	'/nvtrack/api/usuario/getAllUsuarios',
	async (routeParams, { getState }) => {
		routeParams = routeParams || getState().UsuariosApp.contacts.routeParams;
		const response = await api.post('/nvtrack/api/usuario/getAllUsuarios', {
			params: routeParams
		});
		const data = await response.data.data.usuarios;

		return { data, routeParams };
	}
);

export const addUsuario = createAsyncThunk(
	'/nvtrack/api/usuario/saveUsuario',
	async (contact, { dispatch, getState }) => {
		//const { id, name, email, username, administrator, readonly } = contact;
		console.log('CONTACT ==', contact);
		const response = await api.post('/nvtrack/api/usuario/saveUsuario', {
			id: contact.id,
			name: contact.name,
			email: contact.email,
			username: contact.username,
			administrator: contact.administrator,
			readonly: contact.readonly
		});
		const Data = await response.data.data.usuario;
		console.log('data ==', Data);
		dispatch(getUsuarios());

		return Data;
	}
);
//UPDATE CONCLUIDO
export const updateUsuario = createAsyncThunk(
	'/nvtrack/api/usuario/updateUsuario',
	async (contact, { dispatch, getState }) => {
		/*foi feito desestruturação para poder passar os dados enviados para o BACK, foi passado 
		apenas contact,mas não estava passando pelo payload, estava indo apenas undfined
		*/
		const { id, name, email } = contact;
		const response = await api.post('/nvtrack/api/usuario/updateUsuario', {
			id: id,
			name: name,
			email: email
		});
		console.log('Response = ', response);
		const Data = await response.data.data.usuario;
		console.log('Data = ', Data);
		//console.log('Data = ', data.data.nome);
		getUsuarios();
		return Data;
	}
);

export const removeUsuario = createAsyncThunk(
	'UsuariosApp/contacts/removeContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contact', { id: contactId });
		const data = await response.data.data.usuario;
		dispatch(getUsuarios());

		return data;
	}
);

export const removeUsuarios = createAsyncThunk(
	'UsuariosApp/contacts/removeContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contacts', { contactIds });
		const data = await response.data;

		dispatch(getUsuarios());

		return data;
	}
);

export const toggleStarredContact = createAsyncThunk(
	'UsuariosApp/contacts/toggleStarredContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contact', { contactId });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getUsuarios());

		return data;
	}
);

export const toggleStarredContacts = createAsyncThunk(
	'UsuariosApp/contacts/toggleStarredContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contacts', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getUsuarios());

		return data;
	}
);

export const setContactsStarred = createAsyncThunk(
	'UsuariosApp/contacts/setContactsStarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-starred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getUsuarios());

		return data;
	}
);

export const setContactsUnstarred = createAsyncThunk(
	'UsuariosApp/contacts/setContactsUnstarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-unstarred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getUsuarios());

		return data;
	}
);

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = contactsAdapter.getSelectors(
	state => state.UsuariosApp.contacts
);

const contactsSlice = createSlice({
	name: 'UsuariosApp/contacts',
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
		setUsuariosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		openNewUsuarioDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewUsuariotDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditUsuarioDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditUsuarioDialog: (state, action) => {
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
		[updateUsuario.fulfilled]: contactsAdapter.upsertOne,
		[addUsuario.fulfilled]: contactsAdapter.addOne,
		[getUsuarios.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;
			contactsAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		}
	}
});

export const {
	setUsuariosSearchText,
	openNewUsuarioDialog,
	closeNewUsuariotDialog,
	openEditUsuarioDialog,
	closeEditUsuarioDialog
} = contactsSlice.actions;

export default contactsSlice.reducer;

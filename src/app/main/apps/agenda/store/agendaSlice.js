import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../../../services/api';
import { getUserData } from './userSlice';

export const getAgenda = createAsyncThunk('/', async (routeParams, { getState }) => {
	routeParams = routeParams || getState().AgendaApp.contacts.routeParams;
	const response = await api.post('/', {
		params: routeParams
	});
	//const data = await response.data.data.paiss;

	return { routeParams };
});

export const addAgenda = createAsyncThunk('/nvtrack/api/pais/savePais', async (contact, { dispatch, getState }) => {
	const { nome } = contact;
	console.log('CONTACT ==', contact);
	const response = await api.post('/nvtrack/api/pais/savePais', {
		nome: nome
	});
	const Data = await response.data.data.pais;

	dispatch(getAgenda());

	return Data;
});
//UPDATE CONCLUIDO
export const updateAgenda = createAsyncThunk('', async (contact, { dispatch, getState }) => {
	/*foi feito desestruturação para poder passar os dados enviados para o BACK, foi passado 
		apenas contact,mas não estava passando pelo payload, estava indo apenas undfined
		*/
	const { id, nome } = contact;
	const response = await api.post('', {
		id: id,
		nome: nome
	});
	console.log('Response = ', response);
	const Data = await response.data.data.pais;
	console.log('Data = ', Data);
	//console.log('Data = ', data.data.nome);
	getAgenda();
	return Data;
});

export const removeAgenda = createAsyncThunk(
	'AgendaApp/contacts/removeContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contact', { id: contactId });
		const data = await response.data.data.pais;
		dispatch(getAgenda());

		return data;
	}
);

export const removeAgendas = createAsyncThunk(
	'AgendaApp/contacts/removeContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contacts', { contactIds });
		const data = await response.data;

		dispatch(getAgenda());

		return data;
	}
);

export const toggleStarredContact = createAsyncThunk(
	'AgendaApp/contacts/toggleStarredContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contact', { contactId });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getAgenda());

		return data;
	}
);

export const toggleStarredContacts = createAsyncThunk(
	'AgendaApp/contacts/toggleStarredContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contacts', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getAgenda());

		return data;
	}
);

export const setContactsStarred = createAsyncThunk(
	'AgendaApp/contacts/setContactsStarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-starred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getAgenda());

		return data;
	}
);

export const setContactsUnstarred = createAsyncThunk(
	'AgendaApp/contacts/setContactsUnstarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-unstarred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getAgenda());

		return data;
	}
);

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = contactsAdapter.getSelectors(
	state => state.AgendaApp.contacts
);

const contactsSlice = createSlice({
	name: 'AgendaApp/contacts',
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
		[updateAgenda.fulfilled]: contactsAdapter.upsertOne,
		[addAgenda.fulfilled]: contactsAdapter.addOne,
		[getAgenda.fulfilled]: (state, action) => {
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

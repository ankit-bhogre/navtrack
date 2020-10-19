import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../../../services/api';
import { getUserData } from './userSlice';

export const getContacts = createAsyncThunk('/nvtrack/api/pais/getAllPaises', async (routeParams, { getState }) => {
	routeParams = routeParams || getState().PaisesApp.contacts.routeParams;
	const response = await api.post('/nvtrack/api/pais/getAllPaises', {
		params: routeParams
	});
	const data = await response.data.data.paiss;

	return { data, routeParams };
});

export const addContact = createAsyncThunk('/nvtrack/api/pais/savePais', async (contact, { dispatch, getState }) => {
	const { nome } = contact;
	console.log('CONTACT ==', contact);
	const response = await api.post('/nvtrack/api/pais/savePais', {
		nome: nome
	});
	const Data = await response.data.data.pais;

	dispatch(getContacts());

	return Data;
});
//UPDATE CONCLUIDO
export const updateContact = createAsyncThunk(
	'/nvtrack/api/pais/updatePais',
	async (contact, { dispatch, getState }) => {
		/*foi feito desestruturação para poder passar os dados enviados para o BACK, foi passado 
		apenas contact,mas não estava passando pelo payload, estava indo apenas undfined
		*/
		const { id, nome } = contact;
		const response = await api.post('/nvtrack/api/pais/updatePais', {
			id: id,
			nome: nome
		});
		console.log('Response = ', response);
		const Data = await response.data.data.pais;
		console.log('Data = ', Data);
		//console.log('Data = ', data.data.nome);
		getContacts();
		return Data;
	}
);

export const removeContact = createAsyncThunk(
	'PaisesApp/contacts/removeContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contact', { id: contactId });
		const data = await response.data.data.pais;
		dispatch(getContacts());

		return data;
	}
);

export const removeContacts = createAsyncThunk(
	'PaisesApp/contacts/removeContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contacts', { contactIds });
		const data = await response.data;

		dispatch(getContacts());

		return data;
	}
);

export const toggleStarredContact = createAsyncThunk(
	'PaisesApp/contacts/toggleStarredContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contact', { contactId });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getContacts());

		return data;
	}
);

export const toggleStarredContacts = createAsyncThunk(
	'PaisesApp/contacts/toggleStarredContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contacts', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getContacts());

		return data;
	}
);

export const setContactsStarred = createAsyncThunk(
	'PaisesApp/contacts/setContactsStarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-starred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getContacts());

		return data;
	}
);

export const setContactsUnstarred = createAsyncThunk(
	'PaisesApp/contacts/setContactsUnstarred',
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
	state => state.PaisesApp.contacts
);

const contactsSlice = createSlice({
	name: 'PaisesApp/contacts',
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
		setPaisesSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		openNewPaisDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewPaisDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditPaisDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditPaisDialog: (state, action) => {
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
	setPaisesSearchText,
	openNewPaisDialog,
	closeNewPaisDialog,
	openEditPaisDialog,
	closeEditPaisDialog
} = contactsSlice.actions;

export default contactsSlice.reducer;

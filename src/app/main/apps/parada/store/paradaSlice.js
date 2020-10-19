import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../../../services/api';
import { getUserData } from './userSlice';
import { id } from 'date-fns/locale';
//=================FALTA AS ROTAS DE PARADA============
export const getParada = createAsyncThunk('/', async (routeParams, { getState }) => {
	routeParams = routeParams || getState().ParadasApp.contacts.routeParams;
	const response = await api.post('/', {
		params: routeParams
	});
	const data = await response.data.data.veiculos;

	return { data, routeParams };
});

export const addParada = createAsyncThunk(
	'/nvtrack/api/veiculo/saveVeiculo',
	async (contact, { dispatch, getState }) => {
		const { placa } = contact;
		console.log('Veiculo Objeto ==', contact);
		const response = await api.post('/', {
			placa: placa
		});

		const Data = await response.data.data.veiculo;

		dispatch(getParada());

		return Data;
	}
);
//UPDATE CONCLUIDO
export const updateParada = createAsyncThunk(
	'/nvtrack/api/veiculo/updateVeiculo',
	async (contact, { dispatch, getState }) => {
		/*foi feito desestruturação para poder passar os dados enviados para o BACK, foi passado 
		apenas contact,mas não estava passando pelo payload, estava indo apenas undfined
		*/
		const { id, data, descricao } = contact;
		const response = await api.post('/', {
			id: id,
			data: data
		});
		console.log('Response = ', response);
		const Data = await response.data.data.paradas;
		console.log('Data = ', Data);
		//console.log('Data = ', data.data.nome);
		getParada();
		return Data;
	}
);

export const removeParada = createAsyncThunk(
	'ParadasApp/contacts/removeContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contact', { id: contactId });
		const data = await response.data.data.pais;
		dispatch(getParada());

		return data;
	}
);

export const removeParadas = createAsyncThunk(
	'ParadasApp/contacts/removeContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contacts', { contactIds });
		const data = await response.data;

		dispatch(getParada());

		return data;
	}
);

export const toggleStarredContact = createAsyncThunk(
	'ParadasApp/contacts/toggleStarredContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contact', { contactId });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getParada());

		return data;
	}
);

export const toggleStarredContacts = createAsyncThunk(
	'ParadasApp/contacts/toggleStarredContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contacts', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getParada());

		return data;
	}
);

export const setContactsStarred = createAsyncThunk(
	'ParadasApp/contacts/setContactsStarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-starred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getParada());

		return data;
	}
);

export const setContactsUnstarred = createAsyncThunk(
	'ParadasApp/contacts/setContactsUnstarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-unstarred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getParada());

		return data;
	}
);

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = contactsAdapter.getSelectors(
	state => state.ParadasApp.contacts
);

const contactsSlice = createSlice({
	name: 'ParadasApp/contacts',
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
		setParadasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		openNewParadaDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewParadaDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditParadaDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditPAradaDialog: (state, action) => {
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
		[updateParada.fulfilled]: contactsAdapter.upsertOne,
		[addParada.fulfilled]: contactsAdapter.addOne,
		[getParada.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;
			contactsAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		}
	}
});

export const {
	setParadasSearchText,
	openNewParadaDialog,
	closeNewParadaDialog,
	openEditParadaDialog,
	closeEditPAradaDialog
} = contactsSlice.actions;

export default contactsSlice.reducer;

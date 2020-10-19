import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../../../services/api';
import { getUserData } from './userSlice';

export const getViagens = createAsyncThunk('/nvtrack/api/veiculo/getAllVeiculos', async (routeParams, { getState }) => {
	routeParams = routeParams || getState().ViagensApp.contacts.routeParams;
	//para poder lista as viagen deve passar o token como paramatro token:{ código do token}
	const response = await api.post('/nvtrack/api/viagem/getAllViagens ', {
		token:
			'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC82Ny4yMDUuMTcxLjE3XC9udnRyYWNrXC9hcGlcL2xvZ2luIiwiaWF0IjoxNjAxNjg2OTI4LCJleHAiOjE2MDE2OTA1MjgsIm5iZiI6MTYwMTY4NjkyOCwianRpIjoidEZCWlNzbEhaY3Q2NWhkUyIsInN1YiI6MSwicHJ2IjoiODdlMGFmMWVmOWZkMTU4MTJmZGVjOTcxNTNhMTRlMGIwNDc1NDZhYSJ9.tYp34McAvyaSMJoUmfAuSokJzY1PleeR6hirORH3G0s'
	});
	const data = await response.data.data.viagens;

	return { data, routeParams };
});

export const addViagens = createAsyncThunk(
	'/nvtrack/api/veiculo/saveVeiculo',
	async (viagem, { dispatch, getState }) => {
		const { placa } = viagem;
		console.log('Viagem Objeto ==', viagem);
		const response = await api.post('/nvtrack/api/viagem/saveViagem', {
			placa: viagem.data
		});

		const Data = await response.data.data.veiculo;

		dispatch(getViagens());

		return Data;
	}
);
//UPDATE CONCLUIDO
export const updateViagens = createAsyncThunk(
	'/nvtrack/api/veiculo/updateVeiculo',
	async (contact, { dispatch, getState }) => {
		/*foi feito desestruturação para poder passar os dados enviados para o BACK, foi passado 
		apenas contact,mas não estava passando pelo payload, estava indo apenas undfined
		*/
		const { id, placa } = contact;
		const response = await api.post('/nvtrack/api/veiculo/updateVeiculo', {
			id: id,
			placa: placa
		});
		console.log('Response = ', response);
		const Data = await response.data.data.veiculo;
		console.log('Data = ', Data);
		//console.log('Data = ', data.data.nome);
		getViagens();
		return Data;
	}
);

export const removeViagem = createAsyncThunk(
	'ViagensApp/contacts/removeContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contact', { id: contactId });
		const data = await response.data.data.pais;
		dispatch(getViagens());

		return data;
	}
);

export const removeViagens = createAsyncThunk(
	'ViagensApp/contacts/removeContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contacts', { contactIds });
		const data = await response.data;

		dispatch(getViagens());

		return data;
	}
);

export const toggleStarredContact = createAsyncThunk(
	'ViagensApp/contacts/toggleStarredContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contact', { contactId });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getViagens());

		return data;
	}
);

export const toggleStarredContacts = createAsyncThunk(
	'ViagensApp/contacts/toggleStarredContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contacts', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getViagens());

		return data;
	}
);

export const setContactsStarred = createAsyncThunk(
	'ViagensApp/contacts/setContactsStarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-starred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getViagens());

		return data;
	}
);

export const setContactsUnstarred = createAsyncThunk(
	'ViagensApp/contacts/setContactsUnstarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-unstarred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getViagens());

		return data;
	}
);

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = contactsAdapter.getSelectors(
	state => state.ViagensApp.contacts
);

const contactsSlice = createSlice({
	name: 'ViagensApp/contacts',
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
		setViagensSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		openNewViagemDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewViagemDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditViagemDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditViagemDialog: (state, action) => {
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
		[updateViagens.fulfilled]: contactsAdapter.upsertOne,
		[addViagens.fulfilled]: contactsAdapter.addOne,
		[getViagens.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;
			contactsAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		}
	}
});

export const {
	setViagensSearchText,
	openNewViagemDialog,
	closeNewViagemDialog,
	openEditViagemDialog,
	closeEditViagemDialog
} = contactsSlice.actions;

export default contactsSlice.reducer;

import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../../../services/api';
import { getUserData } from './userSlice';
//listar  Veiculos
export const getVeiculos = createAsyncThunk(
	'/nvtrack/api/veiculo/getAllVeiculos',
	async (routeParams, { getState }) => {
		routeParams = routeParams || getState().VeiculosApp.contacts.routeParams;
		const response = await api.post('/nvtrack/api/veiculo/getAllVeiculos', {
			params: routeParams
		});
		const data = await response.data.data.veiculos;
		console.log('DATA veiculos', data);
		return { data, routeParams };
	}
);

export const addVeiculo = createAsyncThunk(
	'/nvtrack/api/veiculo/saveVeiculo',
	async (contact, { dispatch, getState }) => {
		const { placa } = contact;
		console.log('Veiculo Objeto ==', contact);
		const response = await api.post('/nvtrack/api/veiculo/saveVeiculo', {
			placa: placa
		});

		const Data = await response.data.data.veiculo;

		dispatch(getVeiculos());

		return Data;
	}
);
//UPDATE CONCLUIDO
export const updateContact = createAsyncThunk(
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
		getVeiculos();
		return Data;
	}
);

export const removeContact = createAsyncThunk(
	'VeiculosApp/contacts/removeContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contact', { id: contactId });
		const data = await response.data.data.pais;
		dispatch(getVeiculos());

		return data;
	}
);

export const removeContacts = createAsyncThunk(
	'VeiculosApp/contacts/removeContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contacts', { contactIds });
		const data = await response.data;

		dispatch(getVeiculos());

		return data;
	}
);

export const toggleStarredContact = createAsyncThunk(
	'VeiculosApp/contacts/toggleStarredContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contact', { contactId });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getVeiculos());

		return data;
	}
);

export const toggleStarredContacts = createAsyncThunk(
	'VeiculosApp/contacts/toggleStarredContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contacts', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getVeiculos());

		return data;
	}
);

export const setContactsStarred = createAsyncThunk(
	'VeiculosApp/contacts/setContactsStarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-starred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getVeiculos());

		return data;
	}
);

export const setContactsUnstarred = createAsyncThunk(
	'VeiculosApp/contacts/setContactsUnstarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-unstarred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getVeiculos());

		return data;
	}
);

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = contactsAdapter.getSelectors(
	state => state.VeiculosApp.contacts
);

const contactsSlice = createSlice({
	name: 'VeiculosApp/contacts',
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
		setVeiculosSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		openNewVeiculoDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewVeiculoDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditVeiculoDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditVeiculoDialog: (state, action) => {
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
		[addVeiculo.fulfilled]: contactsAdapter.addOne,
		[getVeiculos.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;
			contactsAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		}
	}
});

export const {
	setVeiculosSearchText,
	openNewVeiculoDialog,
	closeNewVeiculoDialog,
	openEditVeiculoDialog,
	closeEditVeiculoDialog
} = contactsSlice.actions;

export default contactsSlice.reducer;

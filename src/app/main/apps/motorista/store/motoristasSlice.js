import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../../../services/api';
import { getUserData } from './userSlice';

export const getMotorista = createAsyncThunk(
	'/nvtrack/api/motorista/getAllMotoristas',
	async (routeParams, { getState }) => {
		routeParams = routeParams || getState().MotoristasApp.contacts.routeParams;
		const response = await api.post('/nvtrack/api/motorista/getAllMotoristas', {
			params: routeParams
		});
		const data = await response.data.data.motoristas;

		return { data, routeParams };
	}
);

export const addMotorista = createAsyncThunk(
	'/nvtrack/api/motorista/saveMotorista',
	async (motorista, { dispatch, getState }) => {
		const {
			nome,
			cpf,
			cliente_id,
			cnh,
			categoria_cnh,
			sexo,
			vencimento_cnh,
			is_alerta_vencimento_cnh,
			RFID,
			wt110,
			ibutton,
			data_exame_toxicologico,
			is_alerta_exame_toxicologico
		} = motorista;
		console.log('motorista ==', motorista);
		const response = await api.post('/nvtrack/api/motorista/saveMotorista', {
			nome: motorista.nome,
			cpf: motorista.cpf,
			cnh: motorista.cnh,
			sexo: motorista.sexo,
			vencimento_cnh: motorista.vencimento_cnh,
			is_alerta_vencimento_cnh: motorista.is_alerta_vencimento_cnh,
			RFID: motorista.RFID,
			wt110: motorista.wt110,
			ibutton: motorista.ibutton,
			data_exame_toxicologico: motorista.data_exame_toxicologico,
			cliente_id: motorista.cliente_id,
			categoria_cnh: motorista.categoria_cnh,
			is_alerta_exame_toxicologico: motorista.is_alerta_exame_toxicologico
		});
		const Data = await response.data.data.motorista;

		dispatch(getMotorista());

		return Data;
	}
);
//UPDATE CONCLUIDO
export const updateMotorista = createAsyncThunk(
	'/nvtrack/api/motorista/updateMotorista',
	async (motorista, { dispatch, getState }) => {
		/*foi feito desestruturação para poder passar os dados enviados para o BACK, foi passado 
		apenas motorista,mas não estava passando pelo payload, estava indo apenas undfined
		*/
		const {
			id,
			nome,
			cpf,
			cnh,
			sexo,
			vencimento_cnh,
			is_alerta_vencimento_cnh,
			RFID,
			wt110,
			ibutton,
			data_exame_toxicologico
		} = motorista;
		const response = await api.post('/nvtrack/api/motorista/updateMotorista', {
			id: id,
			nome: nome,
			cpf: cpf,
			cnh: cnh,
			sexo: sexo,
			vencimento_cnh: vencimento_cnh,
			is_alerta_vencimento_cnh: is_alerta_vencimento_cnh,
			RFID: RFID,
			wt110: wt110,
			ibutton: ibutton,
			data_exame_toxicologico: data_exame_toxicologico
		});
		console.log('Response = ', response);
		const Data = await response.data.data.motorista;
		console.log('Data = ', Data);
		//console.log('Data = ', data.data.nome);
		getMotorista();
		return Data;
	}
);

export const removeMotorista = createAsyncThunk(
	'MotoristasApp/contacts/removeContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contact', { contactId });
		const data = await response.data;
		dispatch(getMotorista());

		return data;
	}
);

export const removeMotoristas = createAsyncThunk(
	'MotoristasApp/contacts/removeContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contacts', { contactIds });
		const data = await response.data;

		dispatch(getMotorista());

		return data;
	}
);

export const toggleStarredContact = createAsyncThunk(
	'MotoristasApp/contacts/toggleStarredContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contact', { contactId });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getMotorista());

		return data;
	}
);

export const toggleStarredContacts = createAsyncThunk(
	'MotoristasApp/contacts/toggleStarredContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contacts', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getMotorista());

		return data;
	}
);

export const setContactsStarred = createAsyncThunk(
	'MotoristasApp/contacts/setContactsStarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-starred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getMotorista());

		return data;
	}
);

export const setContactsUnstarred = createAsyncThunk(
	'MotoristasApp/contacts/setContactsUnstarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-unstarred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getMotorista());

		return data;
	}
);

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = contactsAdapter.getSelectors(
	state => state.MotoristasApp.contacts
);

const contactsSlice = createSlice({
	name: 'MotoristasApp/contacts',
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
		setMotoristasSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		openNewMotoristaDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewMotoristaDialog: (state, action) => {
			state.contactDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditMotoristaDialog: (state, action) => {
			state.contactDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditMotoristaDialog: (state, action) => {
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
		[updateMotorista.fulfilled]: contactsAdapter.upsertOne,
		[addMotorista.fulfilled]: contactsAdapter.addOne,
		[getMotorista.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;
			contactsAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		}
	}
});

export const {
	setMotoristasSearchText,
	openNewMotoristaDialog,
	closeNewMotoristaDialog,
	openEditMotoristaDialog,
	closeEditMotoristaDialog
} = contactsSlice.actions;

export default contactsSlice.reducer;

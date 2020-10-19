import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../../../services/api';
import { getUserData } from './userSlice';

export const getClientes = createAsyncThunk(
	'/nvtrack/api/cliente/getAllClientes',
	async (routeParams, { getState }) => {
		routeParams = routeParams || getState().ClientesApp.contacts.routeParams;
		console.log('OLHA AQUI ROUTEPARAMS', routeParams);
		const response = await api.post('/nvtrack/api/cliente/getAllClientes', {
			params: routeParams
		});
		console.log('AQUI RESPONSE DOS CLIENTES ', response);
		const data = await response.data.data.clientes;

		return { data, routeParams };
	}
);

export const addClientes = createAsyncThunk(
	'/nvtrack/api/cliente/saveCliente',
	async (cliente, { dispatch, getState }) => {
		const {
			Pais,
			PerfilCliId,
			TipoPessoa,
			Cidade,
			nome,
			nome_fantasia,
			is_liberado,
			cpf_cnpj,
			endereco,
			bairro,
			cep,
			email
		} = cliente;
		const response = await api.post('/nvtrack/api/cliente/saveCliente', {
			nome: cliente.nome,
			nome_fantasia: cliente.nome_fantasia,
			tipo_pessoa: cliente.tipo_pessoa,
			is_liberado: cliente.is_liberado,
			cpf_cnpj: cliente.cpf_cnpj,
			endereco: cliente.endereco,
			bairro: cliente.bairro,
			cep: cliente.cep,
			pais_id: cliente.Pais,
			perfil_cliente_id: cliente.perfil_cliente_id,
			email: cliente.email,
			cidade: cliente.cidade_id
		});
		const Data = await response.data.data.cliente;

		dispatch(getClientes());

		return Data;
	}
);
//UPDATE CONCLUIDO
export const updateClientes = createAsyncThunk(
	'/nvtrack/api/cliente/updateCliente',
	async (contact, { dispatch, getState }) => {
		/*foi feito desestruturação para poder passar os dados enviados para o BACK, foi passado 
		apenas contact,mas não estava passando pelo payload, estava indo apenas undfined
		*/
		const {
			id,
			nome,
			nome_fantasia,
			tipo_pessoa,
			is_liberado,
			cpf_cnpj,
			endereco,
			bairro,
			cidade_id,
			nome_cidade,
			nome_pais,
			cep,
			uf,
			pais_id,
			url_antt,
			token_antt,
			perfil_cliente_id,
			email
		} = contact;
		const response = await api.post('/nvtrack/api/cliente/updateCliente', {
			id: id,
			nome: nome,
			nome_fantasia: nome_fantasia,
			tipo_pessoa: tipo_pessoa,
			is_liberado: is_liberado,
			cpf_cnpj: cpf_cnpj,
			endereco: endereco,
			bairro: bairro,
			cidade_id: cidade_id,
			nome_cidade: nome_cidade,
			nome_pais: nome_pais,
			cep: cep,
			uf: uf,
			pais_id: pais_id,
			url_antt: url_antt,
			token_antt: token_antt,
			perfil_cliente_id: perfil_cliente_id,
			email: email
		});
		console.log('Response = ', response);
		const Data = await response.data.data.cliente;
		console.log('Data = ', Data);
		//console.log('Data = ', data.data.nome);
		getClientes();
		return Data;
	}
);

export const removeCliente = createAsyncThunk(
	'ClientesApp/contacts/removeContact',
	async (contactId, { dispatch, getState }) => {
		const response = await api.post('/api/contacts-app/remove-contact', { contactId });
		const data = await response.data;
		dispatch(getClientes());

		return data;
	}
);

export const removeClientes = createAsyncThunk(
	'ClientesApp/contacts/removeContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/remove-contacts', { contactIds });
		const data = await response.data;

		dispatch(getClientes());

		return data;
	}
);

export const toggleStarredContact = createAsyncThunk(
	'ClientesApp/contacts/toggleStarredContact',
	async (contactId, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contact', { contactId });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getClientes());

		return data;
	}
);

export const toggleStarredContacts = createAsyncThunk(
	'ClientesApp/contacts/toggleStarredContacts',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/toggle-starred-contacts', { contactIds });
		const data = await response.data;

		dispatch(getUserData());
		dispatch(getClientes());

		return data;
	}
);

export const setContactsStarred = createAsyncThunk(
	'ClientesApp/contacts/setContactsStarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-starred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getClientes());

		return data;
	}
);

export const setContactsUnstarred = createAsyncThunk(
	'ClientesApp/contacts/setContactsUnstarred',
	async (contactIds, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/set-contacts-unstarred', { contactIds });
		const data = await response.data;

		dispatch(getUserData());

		dispatch(getClientes());

		return data;
	}
);

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactsById } = contactsAdapter.getSelectors(
	state => state.ClientesApp.contacts
);

const contactsSlice = createSlice({
	name: 'ClientesApp/contacts',
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
		[updateClientes.fulfilled]: contactsAdapter.upsertOne,
		[addClientes.fulfilled]: contactsAdapter.addOne,
		[getClientes.fulfilled]: (state, action) => {
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

import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import { TextFieldFormsy } from '@fuse/core/formsy';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mascara } from './store/mascara';
import MenuItem from '@material-ui/core/MenuItem';
import {
	removeCliente,
	updateClientes,
	addClientes,
	closeNewContactDialog,
	closeEditContactDialog
} from './store/clientesSlice';
import api from '../../../services/api';

//Array para selecionar PESSOA JURIDICA E FISICA
const TipoPessoaArray = [
	{
		//alterei aqui 16/09/2020 mudando id para string e value para int
		id: 1,
		value: 'PF',
		label: 'Pessoa Fisica'
	},
	{
		id: 2,
		value: 'PJ',
		label: 'Pesspa Juridica'
	}
];

function ClientestDialog(props) {
	//=============SELECT -PAIS=======================
	//array dos paises
	const [ArrayPais, setArrayPais] = useState(['']);
	//capturar o valor do PAis selado no array
	const [Pais, setPais] = useState('');
	//=========FIM====SELECT PAIS=====================

	//=============SELECT -CLIENTES IS_ID=======================
	const [PerfilCliId, setPerfilCliId] = useState('');
	const [PerfilIdArray, setArrayId] = useState(['']);
	//=======FIM======SELECT -CLIENTES IS_ID=======================

	//=============SELECT CIDADES cidade_ID=======================
	const [Cidade, setCidade] = useState('');
	const [ArrayCidade, setArrayCidade] = useState(['']);
	console.log('CIDADE', Cidade);
	//=======FIM======SELECT CLIENTES IS_ID=======================

	//===========setar o tipo de pessoas==================
	const [TipoPessoa, setTipoPessoa] = useState('');

	//==========FIM======setar o tipo de pessoas==================

	// =============CPF/ CNPJ====================
	const [auxiliarCpfCnpj, setauxiliarCpfCnpj] = useState('');
	const [CpfCnpj, setCpfCnpj] = useState('');
	//============FIM == CPF-CNPJ=========
	//enviando para o back
	const defaultFormState = {
		id: '',
		Pais: Pais,
		perfil_cliente_id: PerfilCliId,
		//PerfilIdArray: PerfilIdArray,
		tipo_pessoa: TipoPessoa,
		//==============
		nome: '',
		nome_fantasia: '',
		cpf_cnpj: CpfCnpj,
		endereco: '',
		bairro: '',
		cep: '',
		cidade_id: Cidade,
		email: '',
		is_liberado: '',
		url_antt: '',
		token_antt: ''
	};

	const dispatch = useDispatch();
	const contactDialog = useSelector(({ ClientesApp }) => ClientesApp.contacts.contactDialog);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	//caputrar tipo de pessoa
	const handleChangeTipoPessoa = event => {
		setTipoPessoa(event.target.value);
	};
	//usando UseEffect para listar os paises, vai alistar apenas uma vez usando []
	useEffect(() => {
		async function handGetPaises() {
			const response = await api.post('/nvtrack/api/pais/getAllPaises');
			//passando o array de objetos para data
			const data = response.data.data.paiss;
			//setando no States onde vai ficar o array dos paises
			setArrayPais(data);
		}

		async function handgetAllClientes() {
			const response = await api.post('/nvtrack/api/cliente/getAllClientes');
			//passando o array de objetos para data
			const data = response.data.data.clientes;
			//
			setArrayId(data);
		}

		async function handgetAllCidades() {
			const response = await api.post('/nvtrack/api/cidade/getAllCidades');
			//passando o array de objetos para data
			const data = response.data.data.cidades;
			//
			setArrayCidade(data);
		}

		//chamando as funções
		handgetAllCidades();
		handgetAllClientes();
		handGetPaises();
	}, []);
	//setando o valor selcionado do arrayPais
	function handSetPaises(event) {
		setPais(event.target.value);
	}
	//setando o valor selcionado do array PerfilIdArray
	function handPerfilCliId(event) {
		setPerfilCliId(event.target.value);
		setForm({ ...form, perfil_cliente_id: PerfilCliId });
	}

	//mascara CPF e CNPJ
	function handCpfCnpj(event) {
		setauxiliarCpfCnpj(event.target.value);
		setCpfCnpj(mascara(event.target.value));

		//valor mostrado no input
		const CpfCnpjEnviar = auxiliarCpfCnpj.split('');
		CpfCnpjEnviar.splice(CpfCnpjEnviar.indexOf(' '), 1);
		CpfCnpjEnviar.splice(CpfCnpjEnviar.indexOf('.'), 1);
		CpfCnpjEnviar.splice(CpfCnpjEnviar.indexOf('.'), 1);
		CpfCnpjEnviar.splice(CpfCnpjEnviar.indexOf('/'), 1);
		CpfCnpjEnviar.splice(CpfCnpjEnviar.indexOf('-'), 1);

		const valorJunto = CpfCnpjEnviar.join('');
		setForm({ ...form, cpf_cnpj: valorJunto });
	}

	function handSetCidades(event) {
		setCidade(event.target.value);
		setForm({ ...form, cidade_id: Cidade });
	}

	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (contactDialog.type === 'edit' && contactDialog.data) {
			setForm({ ...contactDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (contactDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...contactDialog.data,
				id: FuseUtils.generateGUID()
			});
		}
	}, [contactDialog.data, contactDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (contactDialog.props.open) {
			initDialog();
		}
	}, [contactDialog.props.open, initDialog]);

	function closeComposeDialog() {
		return contactDialog.type === 'edit' ? dispatch(closeEditContactDialog()) : dispatch(closeNewContactDialog());
	}

	function canBeSubmitted() {
		return (
			form.nome.length > 0 &&
			form.nome.length != null &&
			form.nome_fantasia.length > 0 &&
			form.nome_fantasia.length != null &&
			Pais.length > 0 &&
			Pais.length != null &&
			TipoPessoa.length > 0 &&
			TipoPessoa.length != null &&
			form.is_liberado.length > 0 &&
			form.is_liberado.length != null &&
			CpfCnpj.length > 0 &&
			CpfCnpj.length != null &&
			form.endereco.length > 0 &&
			form.endereco.length != null &&
			form.bairro.length > 0 &&
			form.bairro.length != null &&
			Cidade.length > 0 &&
			Cidade.length != null &&
			form.cep.length > 0 &&
			form.cep.length != null &&
			form.email.length != null &&
			form.email.length > 0
			//PerfilCliId.length != null &&
			//PerfilCliId.length != ''
		);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (contactDialog.type === 'new') {
			dispatch(addClientes(form));
		} else {
			dispatch(updateClientes(form));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		dispatch(removeCliente(form.id));
		closeComposeDialog();
	}
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...contactDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{contactDialog.type === 'new' ? 'Novo Cliente' : 'Editar Cliente'}
					</Typography>
				</Toolbar>
				<div className="flex flex-col items-center justify-center pb-24">
					{/* <Avatar className="w-96 h-96" alt="contact avatar" src={form.avatar} /> */}
					{contactDialog.type === 'edit' && (
						<Typography variant="h6" color="inherit" className="pt-8">
							{form.nome}
						</Typography>
					)}
				</div>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">account_circle</Icon>
						</div>

						<TextField
							className="mb-24"
							label="Nome"
							autoFocus
							id="nome"
							name="nome"
							value={form.nome}
							onChange={handleChange}
							variant="outlined"
							required
							fullWidth
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">account_circle</Icon>
						</div>
						<TextField
							className="mb-24"
							label="Nome Fantasia"
							id="nome_fantasia"
							name="nome_fantasia"
							value={form.nome_fantasia}
							onChange={handleChange}
							variant="outlined"
							multiline
							fullWidth
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">account_circle</Icon>
						</div>
						<TextField
							className="mb-24"
							select
							label="UF"
							id="uf"
							name="uf"
							value={Pais}
							onChange={handSetPaises}
							variant="outlined"
							inputProps={{ maxLength: 2 }}
							multiline
							fullWidth
						>
							{ArrayPais.map(option => (
								<MenuItem key={option.id} value={option.nome}>
									{/* {console.log(option)} */}
									{option.nome}
								</MenuItem>
							))}
						</TextField>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">account_circle</Icon>
						</div>
						<TextField
							className="mb-24"
							label="Tipo Pessoa"
							select
							id="tipo_pessoa"
							name="tipo_pessoa"
							value={TipoPessoa}
							onChange={handleChangeTipoPessoa}
							variant="outlined"
							multiline
							fullWidth
						>
							{TipoPessoaArray.map(option => (
								<MenuItem key={option.value} value={option.value}>
									{/* {console.log(option)} */}
									{option.label}
								</MenuItem>
							))}
						</TextField>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">account_circle</Icon>
						</div>
						<TextField
							className="mb-24"
							label="Liberado"
							id="is_liberado"
							name="is_liberado"
							value={form.is_liberado}
							onChange={handleChange}
							variant="outlined"
							multiline
							fullWidth
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">perm_identity</Icon>
						</div>
						<TextField
							className="mb-24"
							label="CPF / CNPJ"
							id="cpf_cnpj"
							name="cpf_cnpj"
							value={CpfCnpj}
							onChange={handCpfCnpj}
							inputProps={{ maxLength: 20 }}
							variant="outlined"
							multiline
							fullWidth
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">location_city</Icon>
						</div>
						<TextField
							className="mb-24"
							label="Endereco"
							id="endereco"
							name="endereco"
							value={form.endereco}
							onChange={handleChange}
							variant="outlined"
							multiline
							fullWidth
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">location_city</Icon>
						</div>
						<TextField
							className="mb-24"
							label="Bairro"
							id="bairro"
							name="bairro"
							value={form.bairro}
							onChange={handleChange}
							variant="outlined"
							multiline
							fullWidth
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">location_city</Icon>
						</div>
						<TextField
							select
							className="mb-24"
							label="Cidade"
							id="cidade_id"
							name="cidade_id"
							value={Cidade}
							onChange={handSetCidades}
							variant="outlined"
							multiline
							fullWidth
						>
							{ArrayCidade.map(option => (
								<MenuItem key={option.id} value={option.nome}>
									{/* {console.log(option)} */}
									{option.nome}
								</MenuItem>
							))}
						</TextField>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">location_city</Icon>
						</div>
						<TextField
							className="mb-24"
							label="Cep"
							id="cep"
							name="cep"
							value={form.cep}
							onChange={handleChange}
							variant="outlined"
							multiline
							fullWidth
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">account_circle</Icon>
						</div>
						<TextField
							className="mb-24"
							select
							label="Perfil Cliente"
							id="perfil_cliente_id"
							name="perfil_cliente_id"
							value={PerfilCliId}
							onChange={handPerfilCliId}
							variant="outlined"
							multiline
							fullWidth
						>
							{PerfilIdArray.map(option => (
								<MenuItem key={option.id} value={option.perfil_cliente_id}>
									{option.perfil_cliente_id}
								</MenuItem>
							))}
						</TextField>
					</div>
					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">email</Icon>
						</div>
						<TextField
							className="mb-24"
							label="Email"
							id="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							variant="outlined"
							multiline
							fullWidth
						/>
					</div>
				</DialogContent>

				{contactDialog.type === 'new' ? (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit}
								type="submit"
								disabled={!canBeSubmitted()}
							>
								Add
							</Button>
						</div>
					</DialogActions>
				) : (
					<DialogActions className="justify-between p-8">
						<div className="px-16">
							<Button
								variant="contained"
								color="primary"
								type="submit"
								onClick={handleSubmit}
								disabled={!canBeSubmitted()}
							>
								Save
							</Button>
						</div>
						<IconButton onClick={handleRemove}>
							<Icon>delete</Icon>
						</IconButton>
					</DialogActions>
				)}
			</form>
		</Dialog>
	);
}

export default ClientestDialog;

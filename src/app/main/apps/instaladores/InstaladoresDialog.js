import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
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
import MenuItem from '@material-ui/core/MenuItem';
import api from '../../../services/api';
import { formatCnpjCpf } from './store/mascara';
import { mphone } from './store/mascaraTelefone';
import {
	removeInstalador,
	updateInstaladores,
	addInstaladores,
	closeNewInstaladorDialog,
	closeEditInstaladorDialog
} from './store/instaladoresSlice';

function InstaladoresDialog(props) {
	//STATU PARA CAPUTRAR O CAMPO CPF e colocar mascara com a função criada
	const [CpfCnpj, setCpfCnpj] = useState('');
	// Estado telefone e Celular
	const [Telefone, setTelefone] = useState('');
	const [Celular, setCelular] = useState('');

	//=============SELECT CIDADES cidade_ID=======================
	const [Cidade, setCidade] = useState('');
	const [ArrayCidade, setArrayCidade] = useState(['']);
	//=======FIM======SELECT CLIENTES IS_ID=======================
	const defaultFormState = {
		nome: '',
		CpfCnpj: CpfCnpj,
		identidade: '',
		endereco: '',
		Cidade: Cidade,
		bairro: '',
		uf: '',
		email: '',
		Telefone: Telefone,
		Celular: Celular,
		observacao: ''
	};

	const dispatch = useDispatch();
	const contactDialog = useSelector(({ InstaladoresApp }) => InstaladoresApp.contacts.contactDialog);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	// assim que redenrizar a pagina ele executa uma vez.
	useEffect(() => {
		async function handgetAllCidades() {
			const response = await api.post('/nvtrack/api/cidade/getAllCidades');
			//passando o array de objetos para data
			const data = response.data.data.cidades;
			//
			console.log('LISTAR cidades ', data);
			setArrayCidade(data);
		}

		//chamando as funções
		handgetAllCidades();
	}, []);
	//função setar valor escolhido no array(rota)
	function handSetCidades(event) {
		setCidade(event.target.value);
	}
	//função mascara de Telefone
	function handSetTelefone(event) {
		setTelefone(mphone(event.target.value));
	}

	///Função mascara Celular
	function handSetCelular(event) {
		setCelular(mphone(event.target.value));
	}

	//função mascara CPF
	function handCpfCnpj(event) {
		setCpfCnpj(formatCnpjCpf(event.target.value));
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
		return contactDialog.type === 'edit'
			? dispatch(closeEditInstaladorDialog())
			: dispatch(closeNewInstaladorDialog());
	}

	function canBeSubmitted() {
		return (
			form.nome.length > 0 &&
			form.nome.length != null &&
			CpfCnpj.length > 0 &&
			CpfCnpj != null &&
			form.identidade.length > 0 &&
			form.identidade.length &&
			form.identidade.length &&
			form.identidade.length != null &&
			form.endereco.length > 0 &&
			form.endereco.length != null &&
			Cidade.length > 0 &&
			Cidade.length != 0 &&
			form.bairro.length > 0 &&
			form.bairro.length != null &&
			form.uf.length > 0 &&
			form.uf.length != null &&
			form.email.length > 0 &&
			form.email.length != null &&
			Telefone.length > 0 &&
			Telefone.length != null &&
			Celular.length > 0 &&
			Celular.length != null &&
			form.observacao.length > 0 &&
			form.observacao.length != null
		);
		//
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (contactDialog.type === 'new') {
			dispatch(addInstaladores(form));
		} else {
			dispatch(updateInstaladores(form));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		dispatch(removeInstalador(form.id));
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
						{contactDialog.type === 'new' ? 'New Instalador' : 'Edit Instalador'}
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
							<Icon color="action">perm_identity</Icon>
						</div>
						<TextField
							className="mb-24"
							label="CPF / CNPJ"
							id="cpf_cnpj"
							name="cpf_cnpj"
							value={CpfCnpj}
							onChange={handCpfCnpj}
							inputProps={{ maxLength: 11 }}
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
							label="Identidade"
							autoFocus
							id="identidade"
							name="identidade"
							value={form.identidade}
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
							label="Endereço"
							autoFocus
							id="endereco"
							name="endereco"
							value={form.endereco}
							onChange={handleChange}
							variant="outlined"
							required
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
							<Icon color="action">account_circle</Icon>
						</div>

						<TextField
							className="mb-24"
							label="Bairro"
							autoFocus
							id="bairro"
							name="bairro"
							value={form.bairro}
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
							label="UF"
							autoFocus
							id="uf"
							name="uf"
							value={form.uf}
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
							label="Email"
							autoFocus
							id="email"
							name="email"
							value={form.email}
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
							label="Telefone"
							id="telefone"
							name="telefone"
							value={Telefone}
							onChange={handSetTelefone}
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
							label="Celular"
							id="celular"
							name="celular"
							value={Celular}
							onChange={handSetCelular}
							variant="outlined"
							multiline
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
							label="Obsevação"
							autoFocus
							id="observacao"
							name="observacao"
							value={form.observacao}
							onChange={handleChange}
							variant="outlined"
							required
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

export default InstaladoresDialog;

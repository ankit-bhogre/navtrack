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
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	removeContact,
	updateContact,
	addVeiculo,
	closeNewVeiculoDialog,
	closeEditVeiculoDialog
} from './store/veiculoSlice';
//importando API
import api from '../../../services/api';
const defaultFormState = {
	id: '',
	placa: '',
	cliente_id: ''
};

function ClientestDialog(props) {
	const dispatch = useDispatch();
	const contactDialog = useSelector(({ VeiculosApp }) => VeiculosApp.contacts.contactDialog);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	///  executa apenas uma vez
	useEffect(() => {
		async function handGetAllClientes() {
			const response = await api.post('/nvtrack/api/contato/getAllContatos');
			//passando o array de objetos para data
			const data = response.data.data.contatos;
			//setando no States onde vai ficar o array dos paises
			//setPerfilMobiArray(data);
		}

		//chamando as funções
		handGetAllClientes();
	}, []);
	//setando o valor selcionado do arrayPais
	function handSetAllClientes(event) {
		//	setPerfilMobile(event.target.value);
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
		return contactDialog.type === 'edit' ? dispatch(closeEditVeiculoDialog()) : dispatch(closeNewVeiculoDialog());
	}

	function canBeSubmitted() {
		return form.placa.length > 0 && form.placa.length != null;
		//
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (contactDialog.type === 'new') {
			dispatch(addVeiculo(form));
		} else {
			dispatch(updateContact(form));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		dispatch(removeContact(form.id));
		closeComposeDialog();
	}

	//=========EXEMPLO=========================
	// const handleChangeTipoPessoa = event => {
	// 	setTipoPessoa(event.target.value);
	// };
	//=======FIMM==EXEMPLO=========================

	//função pegar clientes
	async function getMyAllClientes() {
		//const response= await api.post('/nvtrack/api/cliente/getAllClientes')
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
						{contactDialog.type === 'new' ? 'Novo Veiculo' : 'Editar Veiculo'}
					</Typography>
				</Toolbar>
				<div className="flex flex-col items-center justify-center pb-24">
					{/* <Avatar className="w-96 h-96" alt="contact avatar" src={form.avatar} /> */}
					{contactDialog.type === 'edit' && (
						<Typography variant="h6" color="inherit" className="pt-8">
							{form.placa}
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
							label="Placa"
							autoFocus
							id="placa"
							name="placa"
							value={form.placa}
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
							label="Cliente"
							id="cliente_id"
							name="cliente_id"
							value={form.cliente_id}
							onChange={handleChange}
							variant="outlined"
							required
							multiline
							fullWidth
						/>
					</div>

					{/*
					EXEMPLO SELECT
					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">account_circle</Icon>
						</div>
						<TextField
							className="mb-24"
							label="Tipo Pessoa"
							select
							id="tipo_pessoa"
							//name="tipo_pessoa"
							value={TipoPessoa}
							onChange={handleChangeTipoPessoa}
							variant="outlined"
							multiline
							fullWidth
						>
							{TipoPessoaArray.map(option => (
								<MenuItem key={option.value} value={option.value}>
									{/* {console.log(option)} */}
					{/* {option.label}
								</MenuItem>
							))}
						</TextField>
					</div>  */}
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

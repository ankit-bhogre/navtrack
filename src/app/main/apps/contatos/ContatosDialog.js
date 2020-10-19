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
import { mphone } from './store/mascaraTelefone';
import api from '../../../services/api';

import {
	removeContact,
	updateContact,
	addContact,
	closeNewContactDialog,
	closeEditContactDialog
} from './store/contatosSlice';

function ContatosDialog(props) {
	//==============PERFIL MOBILE======================
	const [PerfilMobile, setPerfilMobile] = useState('');
	const [PerfilMobiArray, setPerfilMobiArray] = useState(['']);
	//==========FIM====PERFIL MOBILE======================
	// Estado telefone
	const [auxiliarT, setAxiliarT] = useState('');
	const [telefone, setTelefone] = useState('');
	//ESTADO  celular
	const [auxiliarC, setAxiliarC] = useState('');
	const [celular, setCelular] = useState('');
	const defaultFormState = {
		//	id:'',
		nome: '',
		email: '',
		telefone: '',
		celular: celular,
		observacao: '',
		is_email_principal: '',
		is_alerta_email: '',
		PerfilMobile: PerfilMobile
	};

	const dispatch = useDispatch();
	const contactDialog = useSelector(({ ContatosApp }) => ContatosApp.contacts.contactDialog);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	useEffect(() => {
		async function handGetAllMobile() {
			const response = await api.post('/nvtrack/api/contato/getAllContatos');
			//passando o array de objetos para data
			const data = response.data.data.contatos;
			//setando no States onde vai ficar o array dos paises
			setPerfilMobiArray(data);
		}

		//chamando as funções
		handGetAllMobile();
	}, []);
	//setando o valor selcionado do arrayPais
	function handSetAllMobile(event) {
		setPerfilMobile(event.target.value);
	}
	//função mascara de Telefone
	function handSetTelefone(event) {
		setAxiliarT(event.target.value);
		setTelefone(mphone(event.target.value));
		//======tirar mascara do telefone =========
		const telefoneEnviar = auxiliarT.split('');
		telefoneEnviar.splice(telefoneEnviar.indexOf(' '), 1);
		telefoneEnviar.splice(telefoneEnviar.indexOf('('), 1);
		telefoneEnviar.splice(telefoneEnviar.indexOf(')'), 1);
		telefoneEnviar.splice(telefoneEnviar.indexOf('-'), 1);
		const valorJunto = telefoneEnviar.join('');
		setForm({ ...form, telefone: valorJunto });
	}

	///Função mascara Celular
	function handSetCelular(event) {
		setAxiliarC(event.target.value);
		//valor mostrado no input
		setCelular(mphone(event.target.value));
		const celularEnviar = auxiliarC.split('');
		celularEnviar.splice(celularEnviar.indexOf(' '), 1);
		celularEnviar.splice(celularEnviar.indexOf('('), 1);
		celularEnviar.splice(celularEnviar.indexOf(')'), 1);
		celularEnviar.splice(celularEnviar.indexOf('-'), 1);

		const valorJunto = celularEnviar.join('');
		setForm({ ...form, celular: valorJunto });
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
			form.is_alerta_email.length != null &&
			form.is_alerta_email.length > 0 &&
			form.is_email_principal.length != null &&
			form.is_email_principal.length > 0 &&
			celular.length != null &&
			celular.length > 0 &&
			form.nome.length != null &&
			form.nome.length > 0 &&
			form.email.length != null &&
			form.email.length > 0 &&
			PerfilMobile > 0 &&
			PerfilMobile != null &&
			telefone.length > 0 &&
			telefone.length != null &&
			telefone.length <= 16
		);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (contactDialog.type === 'new') {
			dispatch(addContact(form));
		} else {
			dispatch(updateContact(form));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		dispatch(removeContact(form.id));
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
						{contactDialog.type === 'new' ? 'Novo Contato' : 'edit Contato'}
					</Typography>
				</Toolbar>
				<div className="flex flex-col items-center justify-center pb-24">
					{/* <Avatar className="w-96 h-96" alt="contact avatar" src={form.avatar} /> */}
					{contactDialog.type === 'edit' && (
						<Typography variant="h6" color="inherit" className="pt-8">
							{/* {form.nome} */}
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
							label="Email"
							id="email"
							name="email"
							value={form.email}
							onChange={handleChange}
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
							label="Telefone"
							id="telefone"
							name="telefone"
							value={telefone}
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
							value={celular}
							onChange={handSetCelular}
							variant="outlined"
							inputProps={{ maxLength: 15 }}
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
							label="Observacao"
							id="observacao"
							name="observacao"
							value={form.observacao}
							onChange={handleChange}
							variant="outlined"
							rows={5}
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
							label="Email Principal"
							id="is_email_principal"
							name="is_email_principal"
							value={form.is_email_principal}
							onChange={handleChange}
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
							label="Email alerta"
							id="is_alerta_email"
							name="is_alerta_email"
							value={form.is_alerta_email}
							onChange={handleChange}
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
							label="Peril mobile id"
							id="perfil_mobile_id"
							select
							value={PerfilMobile}
							onChange={handSetAllMobile}
							variant="outlined"
							multiline
							required
							fullWidth
						>
							{PerfilMobiArray.map(option => (
								<MenuItem key={option.id} value={option.perfil_mobile_id}>
									{/* {console.log(option)} */}
									{option.perfil_mobile_id}
								</MenuItem>
							))}
						</TextField>
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

export default ContatosDialog;

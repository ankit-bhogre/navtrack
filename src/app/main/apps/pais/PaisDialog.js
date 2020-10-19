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
import { removeContact, updateContact, addContact, closeNewPaisDialog, closeEditPaisDialog } from './store/paisSlice';

const defaultFormState = {
	id: '',
	nome: '',
	cpf: '',
	cnh: '',
	sexo: '',
	vencimento_cnh: '',
	is_alerta_vencimento_cnh: '',
	RFID: '',
	wt110: '',
	ibutton: '',
	data_exame_toxicologico: ''
	// is_alerta_exame_toxicologico:'',
	// categoria_cnh:'',
	// usuario_id:'',
	// contato_id:''
};

function PaisesDialog(props) {
	const dispatch = useDispatch();
	const contactDialog = useSelector(({ PaisesApp }) => PaisesApp.contacts.contactDialog);

	const { form, handleChange, setForm } = useForm(defaultFormState);

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
		return contactDialog.type === 'edit' ? dispatch(closeEditPaisDialog()) : dispatch(closeNewPaisDialog());
	}

	function canBeSubmitted() {
		return form.nome.length > 0;
		//
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
						{contactDialog.type === 'new' ? 'New Contact' : 'Edit Contact'}
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

					{/* <div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">account_circle</Icon>
						</div>
						<TextField
							className="mb-24"
							label="Cpf"
							id="cpf"
							name="cpf"
							value={form.cpf}
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
							label="CNH"
							id="cnh"
							name="cnh"
							value={form.cnh}
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
							label="Categoria cnh"
							id="categoria_cnh"
							name="categoria_cnh"
							value={form.categoria_cnh}
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
							label="Vencimento CNH"
							id="vencimento_cnh"
							name="vencimento_cnh"
							value={form.vencimento_cnh}
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
							label="RFID"
							id="RFID"
							name="RFID"
							value={form.RFID}
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
							label="Wt110"
							id="wt110"
							name="wt110"
							value={form.wt110}
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
							label="Ibutton"
							id="ibutton"
							name="ibutton"
							value={form.ibutton}
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
							label="Data exame Toxicologico"
							id="data_exame_toxicologico"
							name="data_exame_toxicologico"
							value={form.data_exame_toxicologico}
							onChange={handleChange}
							variant="outlined"
							multiline
							fullWidth
						/>
					</div> */}
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

export default PaisesDialog;

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
import { mascaraData } from './store/mascaraData';
import { mascara } from './store/mascara';
import { mphone } from './store/mascaraTelefone';
import {
	removeMotorista,
	updateMotorista,
	addMotorista,
	closeNewMotoristaDialog,
	closeEditMotoristaDialog
} from './store/motoristasSlice';
//variaveis blobais

const defaultFormState = {
	nome: '',
	cpf: '',
	cnh: '',
	sexo: '',
	vencimento_cnh: '',
	is_alerta_vencimento_cnh: '',
	RFID: '',
	wt110: '',
	ibutton: '',
	data_exame_toxicologico: '',
	is_alerta_exame_toxicologico: '',
	categoria_cnh: '',
	usuario_id: '',
	contato_id: ''
};

function MotoristasDialog(props) {
	//==============State DATA CNH E DATA EXAME==================
	const [dataCNH, setDataCNH] = useState('');
	const [dataExame, setDataExameToxi] = useState('');
	//==============FIM-DATA CNH E DATA EXAME==================

	// =============CPF/ CNPJ====================
	const [auxiliarcpf, setauxiliarcpf] = useState('');
	const [cpf, setcpf] = useState('');
	//============FIM =====J=========

	// ===============Estado telefone===============
	const [auxiliarT, setAxiliarT] = useState('');
	const [telefone, setTelefone] = useState('');
	//============FIM- ESTADO====================
	const dispatch = useDispatch();
	const contactDialog = useSelector(({ MotoristasApp }) => MotoristasApp.contacts.contactDialog);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => {
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
			? dispatch(closeEditMotoristaDialog())
			: dispatch(closeNewMotoristaDialog());
	}

	function canBeSubmitted() {
		return (
			form.nome.length > 0 &&
			form.nome.length != null &&
			cpf.length > 0 &&
			cpf.length != null &&
			form.cnh.length > 0 &&
			form.cnh.length != null &&
			form.categoria_cnh.length > 0 &&
			form.categoria_cnh.length != null &&
			form.sexo.length > 0 &&
			form.sexo.length != null &&
			form.is_alerta_vencimento_cnh.length > 0 &&
			form.is_alerta_vencimento_cnh.length != null
		);
		//&&(form.cliente_id.length > 0 && form.cliente_id.length != null)
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (contactDialog.type === 'new') {
			dispatch(addMotorista(form));
		} else {
			dispatch(updateMotorista(form));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		dispatch(removeMotorista(form.id));
		closeComposeDialog();
	}
	//mascara Data Vencimento CNH
	function handleChangeDataVencimentoCNH(e) {
		//	setData(mascaraData(e.target.value));
		setDataCNH(mascaraData(e.target.value));
	}

	//mascara Data Ultimo Exame Toxicológico
	function handleChangeDataExameToxicologico(e) {
		setDataExameToxi(mascaraData(e.target.value));
	}

	function handcpf(event) {
		setauxiliarcpf(event.target.value);
		setcpf(mascara(event.target.value));

		//valor mostrado no input
		const cpfEnviar = auxiliarcpf.split('');
		cpfEnviar.splice(cpfEnviar.indexOf(' '), 1);
		cpfEnviar.splice(cpfEnviar.indexOf('.'), 1);
		cpfEnviar.splice(cpfEnviar.indexOf('.'), 1);
		cpfEnviar.splice(cpfEnviar.indexOf('/'), 1);
		cpfEnviar.splice(cpfEnviar.indexOf('-'), 1);

		const valorJunto = cpfEnviar.join('');
		setForm({ ...form, cpf: valorJunto });
	}

	//função mascara de Telefone
	function handleTelefone(event) {
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

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">account_circle</Icon>
						</div>
						<TextField
							className="mb-24"
							label="CPF"
							id="cpf"
							name="cpf"
							value={cpf}
							onChange={handcpf}
							variant="outlined"
							inputProps={{ maxLength: 14 }}
							multiline
							fullWidth
						/>
					</div>

					{/* <div className="flex">
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
							multiline
							fullWidth
						/>
					</div> */}

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
							label="Categoria CNH"
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
							label="Sexo"
							id="sexo"
							name="sexo"
							value={form.sexo}
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
							value={dataCNH}
							onChange={handleChangeDataVencimentoCNH}
							variant="outlined"
							multiline
							fullWidth
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">account_circle</Icon>
						</div>

						{/*  */}
						<TextField
							className="mb-24"
							label="Alerta de Vencimento CNH"
							id="is_alerta_vencimento_cnh"
							name="is_alerta_vencimento_cnh"
							value={form.is_alerta_vencimento_cnh}
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
							label="WT110"
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
							label="Data Ultimo Exame Toxicológico"
							id="data_exame_toxicologico"
							name="data_exame_toxicologico"
							value={dataExame}
							onChange={handleChangeDataExameToxicologico}
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
							label="Alerta Exame Toxicológico"
							id="is_alerta_exame_toxicologico"
							name="is_alerta_exame_toxicologico"
							value={form.is_alerta_exame_toxicologico}
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
							label="Usuário"
							id="usuario_id"
							name="usuario_id"
							value={form.usuario_id}
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
							label="Contato"
							id="contato_id"
							name="contato_id"
							value={telefone}
							onChange={handleTelefone}
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

export default MotoristasDialog;

import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContactsMultiSelectMenu from './MotoristaMultiSelectMenu';
import ContactsTable from './MotoristaTable';
import {
	openEditMotoristaDialog,
	removeMotorista,
	toggleStarredContact,
	selectContacts
} from './store/motoristasSlice';

function MotoristasList(props) {
	const dispatch = useDispatch();
	const contacts = useSelector(selectContacts);
	const searchText = useSelector(({ MotoristasApp }) => MotoristasApp.contacts.searchText);
	const user = useSelector(({ MotoristasApp }) => MotoristasApp.user);

	const [filteredData, setFilteredData] = useState(null);

	const columns = React.useMemo(
		() => [
			{
				Header: ({ selectedFlatRows }) => {
					const selectedRowIds = selectedFlatRows.map(row => row.original.id);

					return (
						selectedFlatRows.length > 0 && <ContactsMultiSelectMenu selectedContactIds={selectedRowIds} />
					);
				},
				accessor: 'avatar',
				Cell: ({ row }) => {
					return <Avatar className="mx-8" alt={row.original.name} src={row.original.avatar} />;
				},
				className: 'justify-center',
				width: 64,
				sortable: false
			},
			{
				Header: 'Nome',
				accessor: 'nome',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'CPf',
				accessor: 'cpf',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'Cliente',
				accessor: 'cliente_id',
				sortable: true
			},
			{
				Header: 'CNH',
				accessor: 'cnh',
				sortable: true
			},

			{
				Header: 'Categoria Cnh',
				accessor: 'categoria_cnh',
				sortable: true
			},
			{
				Header: 'Vencimento CNH',
				accessor: 'vencimento_cnh',
				sortable: true
			},
			{
				Header: 'Alerta de Vencimento CNH',
				accessor: 'is_alerta_vencimento_cnh',
				sortable: true
			},
			{
				Header: 'Sexo',
				accessor: 'sexo',
				sortable: true
			},

			{
				Header: 'Usuário',
				accessor: 'usuario_id',
				sortable: true
			},
			{
				Header: 'Contato',
				accessor: 'Contato',
				sortable: true
			},
			{
				id: 'action',
				width: 128,
				sortable: false,
				Cell: ({ row }) => (
					<div className="flex items-center">
						<IconButton
							onClick={ev => {
								ev.stopPropagation();
								dispatch(toggleStarredContact(row.original.id));
							}}
						>
							{user.starred && user.starred.includes(row.original.id) ? (
								<Icon>star</Icon>
							) : (
								<Icon>star_border</Icon>
							)}
						</IconButton>
						<IconButton
							onClick={ev => {
								ev.stopPropagation();
								dispatch(removeMotorista(row.original.id));
							}}
						>
							<Icon>delete</Icon>
						</IconButton>
					</div>
				)
			}
		],
		[dispatch, user.starred]
	);

	useEffect(() => {
		function getFilteredArray(entities, _searchText) {
			if (_searchText.length === 0) {
				return contacts;
			}
			return FuseUtils.filterArrayByString(contacts, _searchText);
		}

		if (contacts) {
			setFilteredData(getFilteredArray(contacts, searchText));
		}
	}, [contacts, searchText]);

	if (!filteredData) {
		return null;
	}

	if (filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					Não há motoristas!
				</Typography>
			</div>
		);
	}

	return (
		<FuseAnimate animation="transition.slideUpIn" delay={300}>
			<ContactsTable
				columns={columns}
				data={filteredData}
				onRowClick={(ev, row) => {
					if (row) {
						dispatch(openEditMotoristaDialog(row.original));
					}
				}}
			/>
		</FuseAnimate>
	);
}

export default MotoristasList;

import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ClientesMultiSelectMenu from './ClientesMultiSelectMenu';
import ClientesTable from './ClientesTable';
import { openEditContactDialog, removeCliente, toggleStarredContact, selectContacts } from './store/clientesSlice';

function ClientesList(props) {
	const dispatch = useDispatch();
	const contacts = useSelector(selectContacts);
	const searchText = useSelector(({ ClientesApp }) => ClientesApp.contacts.searchText);
	const user = useSelector(({ ClientesApp }) => ClientesApp.user);

	const [filteredData, setFilteredData] = useState(null);

	const columns = React.useMemo(
		() => [
			//
			{
				Header: ({ selectedFlatRows }) => {
					const selectedRowIds = selectedFlatRows.map(row => row.original.id);

					return (
						selectedFlatRows.length > 0 && <ClientesMultiSelectMenu selectedClientesIds={selectedRowIds} />
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
				Header: 'Telefone',
				accessor: 'telefone',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'Email',
				accessor: 'email',
				sortable: true
			},
			{
				Header: 'UF',
				accessor: 'uf',
				sortable: true
			},
			{
				Header: 'Cidade',
				accessor: 'cidade',
				sortable: true
			},
			// {
			// 	Header: 'Endereco',
			// 	accessor: 'endereco',
			// 	sortable: true
			// },
			// {
			// 	Header: 'Bairro',
			// 	accessor: 'bairro',
			// 	sortable: true
			// },
			//{
			//	Header: 'Cidade',
			//	accessor: 'cidade_id',
			//	sortable: true
			//	},
			// {
			// 	Header: 'Pais',
			// 	accessor: 'nome_pais',
			// 	sortable: true
			// },
			// {
			// 	Header: 'Cep',
			// 	accessor: 'cep',
			// 	sortable: true
			// },
			// {
			// 	Header: 'UF',
			// 	accessor: 'uf',
			// 	sortable: true
			// },
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
								dispatch(removeCliente(row.original.id));
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
					Não há clientes!
				</Typography>
			</div>
		);
	}

	return (
		<FuseAnimate animation="transition.slideUpIn" delay={300}>
			<ClientesTable
				columns={columns}
				data={filteredData}
				onRowClick={(ev, row) => {
					if (row) {
						dispatch(openEditContactDialog(row.original));
					}
				}}
			/>
		</FuseAnimate>
	);
}

export default ClientesList;

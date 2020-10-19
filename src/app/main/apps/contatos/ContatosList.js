import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContactsMultiSelectMenu from './ContatosMultiSelectMenu';
import ContactsTable from './ContatosTable';
import { openEditContactDialog, removeContact, toggleStarredContact, selectContacts } from './store/contatosSlice';

function ContatosList(props) {
	const dispatch = useDispatch();
	const contacts = useSelector(selectContacts);
	const searchText = useSelector(({ ContatosApp }) => ContatosApp.contacts.searchText);
	const user = useSelector(({ ContatosApp }) => ContatosApp.user);

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
				Header: 'Email',
				accessor: 'email',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'Telefone',
				accessor: 'telefone',
				sortable: true
			},
			// {
			// 	Header: 'Celular',
			// 	accessor: 'celular',
			// 	sortable: true
			// },
			// {
			// 	Header: 'Observação',
			// 	accessor: 'observacao',
			// 	sortable: true
			// },
			// {
			// 	Header: 'Endereco',
			// 	accessor: 'endereco',
			// 	sortable: true
			// },
			// {
			// 	Header: 'E-mail principal',
			// 	accessor: 'is_email_principal',
			// 	sortable: true
			// },
			// {
			// 	Header: 'Alerta e-mail',
			// 	accessor: 'is_alerta_email',
			// 	sortable: true
			// },
			// {
			// 	Header: 'Perfil mobile',
			// 	accessor: 'perfil_mobile_id',
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
								dispatch(removeContact(row.original.id));
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
					Não há contatos!
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
						dispatch(openEditContactDialog(row.original));
					}
				}}
			/>
		</FuseAnimate>
	);
}

export default ContatosList;

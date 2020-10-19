import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UsuariosMultiSelectMenu from './UsuariosMultiSelectMenu';
import UsuariosTable from './UsuariosTable';
import { openEditUsuarioDialog, removeUsuario, toggleStarredContact, selectContacts } from './store/usuariosSlice';

function ContactsList(props) {
	const dispatch = useDispatch();
	const contacts = useSelector(selectContacts);
	const searchText = useSelector(({ UsuariosApp }) => UsuariosApp.contacts.searchText);
	const user = useSelector(({ UsuariosApp }) => UsuariosApp.user);

	const [filteredData, setFilteredData] = useState(null);

	const columns = React.useMemo(
		() => [
			{
				Header: ({ selectedFlatRows }) => {
					const selectedRowIds = selectedFlatRows.map(row => row.original.id);

					return (
						selectedFlatRows.length > 0 && <UsuariosMultiSelectMenu selectedContactIds={selectedRowIds} />
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
				accessor: 'name',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'E-Mail',
				accessor: 'email',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'Username',
				accessor: 'username',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'Somente Leitura',
				accessor: 'readonly',
				className: 'font-bold',
				sortable: true
			},
			{
				Header: 'Administrador',
				accessor: 'administrator',
				className: 'font-bold',
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
								dispatch(removeUsuario(row.original.id));
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
					Não há usuários!
				</Typography>
			</div>
		);
	}

	return (
		<FuseAnimate animation="transition.slideUpIn" delay={300}>
			<UsuariosTable
				columns={columns}
				data={filteredData}
				onRowClick={(ev, row) => {
					if (row) {
						dispatch(openEditUsuarioDialog(row.original));
					}
				}}
			/>
		</FuseAnimate>
	);
}

export default ContactsList;

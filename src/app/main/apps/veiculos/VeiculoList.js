import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VeiculosMultiSelectMenu from './VeiculosMultiSelectMenu';
import ContactsTable from './VeiculoTable';
import { openEditVeiculoDialog, removeContact, toggleStarredContact, selectContacts } from './store/veiculoSlice';

function VeiculosList(props) {
	const dispatch = useDispatch();
	const contacts = useSelector(selectContacts);
	const searchText = useSelector(({ VeiculosApp }) => VeiculosApp.contacts.searchText);
	const user = useSelector(({ VeiculosApp }) => VeiculosApp.user);

	const [filteredData, setFilteredData] = useState(null);

	const columns = React.useMemo(
		() => [
			{
				Header: ({ selectedFlatRows }) => {
					const selectedRowIds = selectedFlatRows.map(row => row.original.id);

					return (
						selectedFlatRows.length > 0 && <VeiculosMultiSelectMenu selectedContactsIds={selectedRowIds} />
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
				Header: 'Placa',
				accessor: 'placa',
				className: 'font-bold',
				sortable: true
			},
			// },
			// {
			// 	Header: 'Cpf',
			// 	accessor: 'cpf',
			// 	className: 'font-bold',
			// 	sortable: true
			// },
			// {
			// 	Header: 'Cnh',
			// 	accessor: 'cnh',
			// 	sortable: true
			// },
			// {
			// 	Header: 'Categoria Cnh',
			// 	accessor: 'categoria_cnh',
			// 	sortable: true
			// },
			// {
			// 	Header: 'Vencimento CNH',
			// 	accessor: 'vencimento_cnh',
			// 	sortable: true
			// },

			// {
			// 	Header: 'RFID',
			// 	accessor: 'RFID',
			// 	sortable: true
			// },
			// {
			// 	Header: 'wt110',
			// 	accessor: 'wt110',
			// 	sortable: true
			// },
			// {
			// 	Header: 'Data exame Toxicologico',
			// 	accessor: 'data_exame_toxicologico',
			// 	sortable: true
			// },
			// {
			// 	Header: 'Alerta exame Toxicologico',
			// 	accessor: 'is_alerta_exame_toxicologico',
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
					Não há veiculos!
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
						dispatch(openEditVeiculoDialog(row.original));
					}
				}}
			/>
		</FuseAnimate>
	);
}

export default VeiculosList;

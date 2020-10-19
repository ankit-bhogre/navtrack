import FuseAnimate from '@fuse/core/FuseAnimate';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import ContactDialog from './InstaladoresDialog';
import InstaladoresHeader from './InstaladoresHeader';
import InstaladoresList from './InstaladoresList';
import InstaladoresSidebarContent from './InstaladoresSidebarContent';
import reducer from './store';
import { openNewInstaladorDialog, getInstaladores } from './store/instaladoresSlice';
import { getUserData } from './store/userSlice';

const useStyles = makeStyles({
	addButton: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 99
	}
});

function InstaladoresApp(props) {
	const dispatch = useDispatch();

	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const routeParams = useParams();

	useDeepCompareEffect(() => {
		dispatch(getInstaladores(routeParams));
		dispatch(getUserData());
	}, [dispatch, routeParams]);

	return (
		<>
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 sm:p-24 pb-80 sm:pb-80 h-full',
					content: 'flex flex-col h-full',
					leftSidebar: 'w-256 border-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
					wrapper: 'min-h-0'
				}}
				header={<InstaladoresHeader pageLayout={pageLayout} />}
				content={<InstaladoresList />}
				//	leftSidebarContent={<InstaladoresSidebarContent />}
				sidebarInner
				ref={pageLayout}
				innerScroll
			/>
			<FuseAnimate animation="transition.expandIn" delay={300}>
				<Fab
					color="primary"
					aria-label="add"
					className={classes.addButton}
					onClick={ev => dispatch(openNewInstaladorDialog())}
				>
					<Icon>person_add</Icon>
				</Fab>
			</FuseAnimate>
			<ContactDialog />
		</>
	);
}

export default withReducer('InstaladoresApp', reducer)(InstaladoresApp);

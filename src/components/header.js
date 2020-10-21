import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link} from 'react-router-dom';

// import '../../public/assets/adminsection/dist/js/adminlte.js'
export class Header extends React.Component {
   render() {
      return (
      
      <div className="hold-transition sidebar-mini layout-fixed">
      <div className="wrapper">
      {/* <!-- Navbar --> */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {/* <!-- Left navbar links --> */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <a href="index3.html" className="nav-link">Home</a>
          </li>
        </ul>

    
        {/* <!-- Right navbar links --> */}
        <ul className="navbar-nav ml-auto">
          {/* <!-- Notifications Dropdown Menu --> */}
         <Dropdown>
               <Dropdown.Toggle variant="success" id="dropdown-basic" className="dpbtn">
                   <img src="assets/adminsection/dist/img/user2-160x160.jpg" className="img-circle elevation-2 dropdownimg" alt="User Image"></img>
                   Alexander Pierce
               </Dropdown.Toggle>

               <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
               </Dropdown.Menu>
          </Dropdown>
        </ul>
      </nav>
      {/* <!-- /.navbar --> */}

      {/* <!-- Main Sidebar Container --> */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* <!-- Sidebar --> */}
        <div className="sidebar">
          {/* <!-- Sidebar user panel (optional) --> */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image text-center">
              <img src="assets/img/logo/locroom1.png" className="chatroom_logo" alt="User Image"></img>
            </div>
          </div>
           {/* <!-- Sidebar Menu --> */}
           
           <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li className="nav-item">
            <Link to="/tracking" className="nav-link">
                  <i className="nav-icon far fa-image"></i>
                    <p>
                      Tracking
                    </p>
               </Link>
              <Link to="/vehicledetail" className="nav-link">
                  <i className="nav-icon far fa-image"></i>
                    <p>
                       Vehicle Detail
                    </p>
              </Link>
              </li>
            </ul>
          </nav>
          {/* <!-- /.sidebar-menu -->  */}
         </div>
      </aside>
      {/* <!-- Content Wrapper. Contains page content --> */}
       </div>
       <script src="../../public/assets/adminsection/dist/js/adminlte.js"></script>
       <script src="../../public/assets/adminsection/dist/js/adminlte.min.js.map"></script>
       </div>  
      );
   }
}


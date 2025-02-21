import PropTypes from 'prop-types';
import { CSidebar, CSidebarBrand, CSidebarNav, CNavItem, CNavLink } from '@coreui/react';
import { NavLink } from 'react-router-dom';

const AppSidebar = ({ isVisible }) => {
  AppSidebar.propTypes = {
    isVisible: PropTypes.bool.isRequired,
  };
  return (
    <CSidebar visible={isVisible}>
      <CSidebarBrand className="d-none d-md-flex" to="/">
        My Application
      </CSidebarBrand>
      <CSidebarNav>
        <CNavItem>
          <CNavLink to="/admin/dashboard" as={NavLink}>
            Dashboard
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink to="/devices" as={NavLink}>
            Devices
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink to="/offices" as={NavLink}>
            Offices
          </CNavLink>
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  );
};

export default AppSidebar;

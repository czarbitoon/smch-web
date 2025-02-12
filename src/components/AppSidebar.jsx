import React from 'react';
import { CSidebar, CSidebarBrand, CSidebarNav, CNavItem, CNavLink } from '@coreui/react';
import { NavLink } from 'react-router-dom';

const AppSidebar = () => {
  return (
    <CSidebar>
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

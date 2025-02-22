import PropTypes from 'prop-types';
import { CSidebar, CSidebarBrand, CSidebarNav, CNavItem, CNavLink } from '@coreui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilDevices, cilBuilding, cilNotes } from '@coreui/icons';

const AppSidebar = ({ isVisible }) => {
  AppSidebar.propTypes = {
    isVisible: PropTypes.bool.isRequired,
  };

  const location = useLocation();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.type === 2 || user?.type === 3;
  const isStaff = user?.type === 1;

  return (
    <CSidebar visible={isVisible}>
      <CSidebarBrand className="d-none d-md-flex" to="/">
        SMCH System
      </CSidebarBrand>
      <CSidebarNav>
        <CNavItem>
          <CNavLink 
            to={isAdmin ? '/admin/dashboard' : isStaff ? '/staff/dashboard' : '/user/dashboard'} 
            as={NavLink}
            active={location.pathname.includes('dashboard')}
          >
            <CIcon icon={cilSpeedometer} className="me-2" />
            Dashboard
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink 
            to="/devices" 
            as={NavLink}
            active={location.pathname.includes('devices')}
          >
            <CIcon icon={cilDevices} className="me-2" />
            Devices
          </CNavLink>
        </CNavItem>
        {(isAdmin || isStaff) && (
          <CNavItem>
            <CNavLink 
              to="/offices" 
              as={NavLink}
              active={location.pathname.includes('offices')}
            >
              <CIcon icon={cilBuilding} className="me-2" />
              Offices
            </CNavLink>
          </CNavItem>
        )}
        <CNavItem>
          <CNavLink 
            to="/reports" 
            as={NavLink}
            active={location.pathname.includes('reports')}
          >
            <CIcon icon={cilNotes} className="me-2" />
            Reports
          </CNavLink>
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  );
};

export default AppSidebar;
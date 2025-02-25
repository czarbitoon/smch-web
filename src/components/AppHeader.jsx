import { useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
  cilSpeedometer,
  cilDevices,
  cilBuilding,
  cilNotes
} from '@coreui/icons';
import { AuthContext } from '../context/AuthProvider';

import AppHeaderDropdown from './AppHeaderDropdown';
import NotificationsDropdown from './NotificationsDropdown';

const AppHeader = ({ onToggleSidebar }) => {
  AppHeader.propTypes = {
    onToggleSidebar: PropTypes.func.isRequired
  };
  const headerRef = useRef();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  
  const isAdmin = user?.role === 1;
  const isStaff = user?.role === 2;

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
    });
  }, []);

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={onToggleSidebar}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex" style={{ gap: '1rem' }}>
          <CNavItem>
            <CNavLink 
              to={isAdmin ? '/admin/dashboard' : isStaff ? '/staff/dashboard' : '/user/dashboard'} 
              as={NavLink} 
              className="nav-link-hover"
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
              className="nav-link-hover"
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
                className="nav-link-hover"
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
              className="nav-link-hover"
              active={location.pathname.includes('reports')}
            >
              <CIcon icon={cilNotes} className="me-2" />
              Reports
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <CNavLink href="#" className="nav-link-hover">
              <CIcon icon={cilBell} size="lg" className="me-2" />
              Notifications
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#" className="nav-link-hover">
              <CIcon icon={cilList} size="lg" className="me-2" />
              Tasks
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#" className="nav-link-hover">
              <CIcon icon={cilEnvelopeOpen} size="lg" className="me-2" />
              Messages
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <NotificationsDropdown />
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        {/* AppBreadcrumb can be added here if needed */}
      </CContainer>
    </CHeader>
  );
}

export default AppHeader;

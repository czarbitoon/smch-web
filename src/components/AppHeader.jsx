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
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
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

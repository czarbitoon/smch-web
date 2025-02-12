import React, { useContext } from 'react'; // Import React
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider'; // Import AuthContext
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import CIcon from '@coreui/icons-react'; // Import CIcon
import { cilUser, cilLockLocked } from '@coreui/icons'; // Updated icon

const AppHeaderDropdown = () => {
  const navigate = useNavigate(); // Define navigate function
  const { logout, setIsAuthenticated } = useContext(AuthContext); // Get logout function and setIsAuthenticated from context

  const handleLogout = () => {
    logout(); // Call logout function
    navigate('/login'); // Redirect to login page
  };

  return (
    <CDropdown variant="nav-item" placement="bottom-end">
      <CDropdownToggle caret={false}>
        <CIcon icon={cilUser} size="lg" />
      </CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem onClick={handleLogout}>
          <CIcon className="me-2" icon={cilLockLocked} size="lg" /> Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;

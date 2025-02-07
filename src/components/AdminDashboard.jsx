import { useEffect, useState } from 'react';
import { CContainer, CCard, CCardBody, CCardHeader, CButton, CAvatar, CRow, CCol, CSpinner } from '@coreui/react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import axios from '../axiosInstance'; // Import the custom Axios instance

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/profile'); // Fetch user profile
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login'); // Redirect to login if there's an error
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('/logout'); // Call the logout API
      localStorage.removeItem('token'); // Remove token from localStorage
      navigate('/login', { replace: true }); // Redirect to login
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  if (loading) {
    return <CSpinner />; // Show loading indicator
  }

  return (
    <CContainer>
      <CCard>
        <CCardHeader>
          <h4>Admin Dashboard</h4>
        </CCardHeader>
        <CCardBody>
          {/* Profile Section */}
          {user && (
            <CRow className="mb-4">
              <CCol xs={12} className="text-center">
                <CAvatar
                  src={user.profile_picture ? `${import.meta.env.VITE_API_BASE_URL}/storage/${user.profile_picture}` : '/default-avatar.png'}
                  size="lg"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png'; // Fallback image
                  }}
                />
                <h5>{user.name}</h5>
                <p>{user.email}</p>
              </CCol>
            </CRow>
          )}

          {/* Logout Button */}
          <CRow className="mb-4">
            <CCol xs={12} className="text-center">
              <CButton color="danger" onClick={handleLogout}>
                Logout
              </CButton>
            </CCol>
          </CRow>

          {/* Dashboard Content */}
          <CRow>
            <CCol xs={12} md={6}>
              <CCard>
                <CCardBody>
                  <h6>Manage Offices</h6>
                  <p>Add, update, or remove offices.</p>
                  <Link to="/offices">
                    <CButton color="primary">Go to Offices</CButton>
                  </Link>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12} md={6}>
              <CCard>
                <CCardBody>
                  <h6>Manage Devices</h6>
                  <p>Add, update, or remove devices.</p>
                  <Link to="/devices">
                    <CButton color="primary">Go to Devices</CButton>
                  </Link>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CContainer>
  );
}

export default AdminDashboard;
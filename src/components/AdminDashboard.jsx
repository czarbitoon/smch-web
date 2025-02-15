import { useEffect, useState, useContext } from 'react';
import { CContainer, CCard, CCardBody, CCardHeader, CButton, CAvatar, CRow, CCol, CSpinner } from '@coreui/react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosInstance';
import { AuthContext } from '../context/AuthProvider';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      if (!localStorage.getItem('token')) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await axios.get('/profile');
        if (isMounted) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (isMounted) {
          navigate('/login');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return <CSpinner />;
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
                  src={user.profile_picture ? `${import.meta.env.VITE_API_BASE_URL}/storage/${user.profile_picture}` : 'https://ui-avatars.com/api/?name=User&size=128'}
                  size="lg"
                  onError={(e) => { 
                    e.target.src = '/default-avatar.png';
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
                  <Link to="/reports">
                    <CButton color="primary">Go to Reports</CButton>
                  </Link>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* User Management Section */}
          <CRow className="mt-4">
            <CCol xs={12}>
              <CCard>
                <CCardBody>
                  <h6>User Management</h6>
                  <p>Add and manage system users.</p>
                  <Link to="/admin/register">
                    <CButton color="success">Add User</CButton>
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

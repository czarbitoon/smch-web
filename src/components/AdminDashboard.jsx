import { useEffect, useState, useContext } from 'react';
import { CContainer, CCard, CCardBody, CCardHeader, CButton, CAvatar, CRow, CCol, CSpinner, CWidgetStatsF } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople, cilDevices, cilSpreadsheet, cilBuilding } from '@coreui/icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosInstance';
import { AuthContext } from '../context/AuthProvider';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    devices: 0,
    reports: 0,
    offices: 0
  });
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      if (!localStorage.getItem('token')) {
        navigate('/login');
        return;
      }
      
      try {
        const [profileRes, statsRes] = await Promise.all([
          axios.get('/profile'),
          axios.get('/admin/stats')
        ]);
        if (isMounted) {
          setUser(profileRes.data.user);
          setStats(statsRes.data);
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

    fetchDashboardData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(interval);
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
          {/* Quick Access Buttons */}
          <CRow className="mb-4">
            <CCol xs={12} md={4} className="mb-3">
              <CRow>
                <CCol xs={12} className="mb-2">
                  <CButton color="primary" className="w-100" component={Link} to="/admin/devices">
                    <CIcon icon={cilDevices} className="me-2" />
                    Manage Devices
                  </CButton>
                </CCol>
                <CCol xs={12}>
                  <CButton color="success" className="w-100" component={Link} to="/admin/devices/add">
                    <CIcon icon={cilDevices} className="me-2" />
                    Add New Device
                  </CButton>
                </CCol>
              </CRow>
            </CCol>
            <CCol xs={12} md={4} className="mb-3">
              <CButton color="success" className="w-100" component={Link} to="/admin/reports">
                <CIcon icon={cilSpreadsheet} className="me-2" />
                View Reports
              </CButton>
            </CCol>
            <CCol xs={12} md={4} className="mb-3">
              <CButton color="info" className="w-100" component={Link} to="/offices">
                <CIcon icon={cilBuilding} className="me-2" />
                Manage Offices
              </CButton>
            </CCol>
          </CRow>
          {/* Logout Button */}
          <CRow className="mb-4">
            <CCol xs={12} className="text-center">
              <CButton color="danger" onClick={handleLogout}>
                Logout
              </CButton>
            </CCol>
          </CRow>

          {/* Stats Widgets */}
          <CRow className="mb-4">
            <CCol xs={12} sm={6} lg={3}>
              <CWidgetStatsF
                className="mb-3"
                icon={<CIcon icon={cilPeople} height={24} />}
                title="Total Users"
                value={stats.users}
                color="primary"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <CWidgetStatsF
                className="mb-3"
                icon={<CIcon icon={cilDevices} height={24} />}
                title="Total Devices"
                value={stats.devices}
                color="info"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <CWidgetStatsF
                className="mb-3"
                icon={<CIcon icon={cilSpreadsheet} height={24} />}
                title="Active Reports"
                value={stats.reports}
                color="warning"
              />
            </CCol>
            <CCol xs={12} sm={6} lg={3}>
              <CWidgetStatsF
                className="mb-3"
                icon={<CIcon icon={cilBuilding} height={24} />}
                title="Total Offices"
                value={stats.offices}
                color="success"
              />
            </CCol>
          </CRow>

          {/* Quick Actions */}
          <CRow>
            <CCol xs={12} md={6}>
              <CCard>
                <CCardBody>
                  <h6>Manage Offices</h6>
                  <p>Add, update, or remove offices.</p>
                  <div className="d-flex gap-2">
                    <Link to="/offices">
                      <CButton color="primary">Go to Offices</CButton>
                    </Link>
                    <Link to="/offices/add">
                      <CButton color="success">Add Office</CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={12} md={6}>
              <CCard>
                <CCardBody>
                  <h6>Manage Devices</h6>
                  <p>Add, update, or remove devices.</p>
                  <div className="d-flex gap-2">
                    <Link to="/devices">
                      <CButton color="primary">Go to Devices</CButton>
                    </Link>
                    <Link to="/devices/add">
                      <CButton color="success">Add Device</CButton>
                    </Link>
                    <Link to="/reports">
                      <CButton color="primary">Go to Reports</CButton>
                    </Link>
                  </div>
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





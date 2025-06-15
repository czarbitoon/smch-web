import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress, Alert } from '@mui/material';
import { AuthContext } from '../context/AuthProvider';
import axios from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterOffice, setFilterOffice] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [offices, setOffices] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user', office_id: '' });
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      navigate('/');
      return;
    }
    fetchUsers();
    // Only fetch offices once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterOffice, filterRole]);

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filterOffice !== 'all') params.office_id = filterOffice;
      if (filterRole !== 'all') params.role = filterRole;
      const res = await axios.get('/api/users', { params });
      setUsers(Array.isArray(res.data.data) ? res.data.data : res.data);
    } catch (e) {
      setError('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffices = async () => {
    try {
      const res = await axios.get('/api/offices');
      setOffices(
        Array.isArray(res.data?.data?.offices)
          ? res.data.data.offices
          : Array.isArray(res.data?.offices)
            ? res.data.offices
            : Array.isArray(res.data)
              ? res.data
              : []
      );
    } catch {
      setOffices([]);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateUser = async () => {
    setActionLoading(true);
    try {
      await axios.post('/api/users', formData);
      setIsCreateOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'user', office_id: '' });
      fetchUsers();
    } catch (e) {
      setError('Failed to create user');
    } finally {
      setActionLoading(false);
    }
  };
  const handleEditUser = async () => {
    setActionLoading(true);
    try {
      await axios.put(`/api/users/${editUser.id}`, formData);
      setIsEditOpen(false);
      setEditUser(null);
      setFormData({ name: '', email: '', password: '', role: 'user', office_id: '' });
      fetchUsers();
    } catch (e) {
      setError('Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };
  const handleDeleteUser = async () => {
    setActionLoading(true);
    try {
      await axios.delete(`/api/users/${deleteUserId}`);
      setDeleteUserId(null);
      fetchUsers();
    } catch (e) {
      setError('Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
      <Typography variant="h3" sx={{ fontWeight: 900, color: '#1976d2', mb: 4 }}>
        User Management
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 160 }} size="small">
            <InputLabel>Office</InputLabel>
            <Select value={filterOffice} label="Office" onChange={e => setFilterOffice(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              {offices.map(office => (
                <MenuItem key={office.id} value={office.id}>{office.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 160 }} size="small">
            <InputLabel>User Type</InputLabel>
            <Select value={filterRole} label="User Type" onChange={e => setFilterRole(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="superadmin">Superadmin</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" color="primary" onClick={() => setIsCreateOpen(true)} sx={{ borderRadius: 2, fontWeight: 600 }}>
          Create User
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="40vh"><CircularProgress /></Box>
      ) : (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Office</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{u.role || u.user_type}</TableCell>
                    <TableCell>{u.office?.name || (offices.find(o => o.id === u.office_id)?.name) || 'N/A'}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" color="primary" sx={{ mr: 1 }} onClick={() => { setEditUser(u); setFormData({ name: u.name, email: u.email, password: '', role: u.role || u.user_type, office_id: u.office_id || '' }); setIsEditOpen(true); }}>Edit</Button>
                      <IconButton size="small" color="error" onClick={() => setDeleteUserId(u.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={users.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
      )}
      {/* Create User Dialog */}
      <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          <TextField label="Email" fullWidth margin="normal" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          <TextField label="Password" fullWidth margin="normal" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select value={formData.role} label="Role" onChange={e => setFormData({ ...formData, role: e.target.value })}>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="superadmin">Superadmin</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Office</InputLabel>
            <Select value={formData.office_id} label="Office" onChange={e => setFormData({ ...formData, office_id: e.target.value })}>
              <MenuItem value="">None</MenuItem>
              {offices.map(office => (
                <MenuItem key={office.id} value={office.id}>{office.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained" color="primary" disabled={actionLoading}>Create</Button>
        </DialogActions>
      </Dialog>
      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          <TextField label="Email" fullWidth margin="normal" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          <TextField label="Password (leave blank to keep)" fullWidth margin="normal" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select value={formData.role} label="Role" onChange={e => setFormData({ ...formData, role: e.target.value })}>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="superadmin">Superadmin</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Office</InputLabel>
            <Select value={formData.office_id} label="Office" onChange={e => setFormData({ ...formData, office_id: e.target.value })}>
              <MenuItem value="">None</MenuItem>
              {offices.map(office => (
                <MenuItem key={office.id} value={office.id}>{office.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditUser} variant="contained" color="primary" disabled={actionLoading}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* Delete User Dialog */}
      <Dialog open={!!deleteUserId} onClose={() => setDeleteUserId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserId(null)}>Cancel</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error" disabled={actionLoading}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;

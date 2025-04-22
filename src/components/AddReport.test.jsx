import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddReport from './AddReport';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('AddReport Component', () => {
  const devicesMock = [
    { id: 1, name: 'PC-1' },
    { id: 2, name: 'Printer-1' }
  ];

  beforeEach(() => {
    mock.reset();
    mock.onGet('/api/devices').reply(200, devicesMock);
    mock.onPost('/reports').reply(200, { message: 'Report submitted successfully!' });
  });

  it('renders device dropdown and allows selection', async () => {
    render(<AddReport open={true} onClose={jest.fn()} onSuccess={jest.fn()} preselectedDeviceId={null} />);
    await waitFor(() => {
      expect(screen.getByText('PC-1')).toBeInTheDocument();
      expect(screen.getByText('Printer-1')).toBeInTheDocument();
    });
  });

  it('handles form submission with image upload', async () => {
    render(<AddReport open={true} onClose={jest.fn()} onSuccess={jest.fn()} preselectedDeviceId={null} />);
    await waitFor(() => screen.getByText('PC-1'));
    fireEvent.change(screen.getByLabelText(/Device/i), { target: { value: '1' } });
    const file = new File(['dummy'], 'report.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Report Image/i);
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByText(/Submit Report/i));
    await waitFor(() => {
      expect(mock.history.post.length).toBeGreaterThan(0);
    });
  });

  it('handles API error gracefully', async () => {
    mock.onPost('/reports').reply(500, { message: 'Error submitting report' });
    render(<AddReport open={true} onClose={jest.fn()} onSuccess={jest.fn()} preselectedDeviceId={null} />);
    await waitFor(() => screen.getByText('PC-1'));
    fireEvent.change(screen.getByLabelText(/Device/i), { target: { value: '1' } });
    fireEvent.click(screen.getByText(/Submit Report/i));
    await waitFor(() => {
      expect(screen.getByText(/Error submitting report/i)).toBeInTheDocument();
    });
  });
});
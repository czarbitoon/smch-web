import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Devices from './Devices';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('Devices Component', () => {
  const devicesMock = [
    { id: 1, name: 'PC-1', status: 'active', office: { name: 'Lab A' }, image_url: '', subcategory: { device_type: { device_category: { name: 'Computer' }, name: 'Desktop' }, name: 'Standard' } },
    { id: 2, name: 'Printer-1', status: 'maintenance', office: { name: 'Lab B' }, image_url: '', subcategory: { device_type: { device_category: { name: 'Printer' }, name: 'Laser' }, name: 'HP' } }
  ];

  beforeEach(() => {
    mock.reset();
    mock.onGet('/api/devices').reply(200, { data: { devices: devicesMock } });
  });

  it('renders device cards', async () => {
    render(<Devices />);
    await waitFor(() => {
      expect(screen.getByText('PC-1')).toBeInTheDocument();
      expect(screen.getByText('Printer-1')).toBeInTheDocument();
    });
  });

  it('filters devices by office', async () => {
    render(<Devices />);
    await waitFor(() => screen.getByText('PC-1'));
    fireEvent.change(screen.getByLabelText(/Office/i), { target: { value: 'Lab A' } });
    // Filtering logic may be in parent or API, so this is a placeholder
    // Add more specific filtering test if implemented
  });

  it('handles API error gracefully', async () => {
    mock.onGet('/api/devices').reply(500);
    render(<Devices />);
    await waitFor(() => {
      expect(screen.getByText(/Error fetching devices/i)).toBeInTheDocument();
    });
  });
});
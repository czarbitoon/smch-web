import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Reports from './Reports';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('Reports Component', () => {
  const reportsMock = [
    { id: 1, title: 'Broken PC', description: 'PC not working', resolved_by: null, user: { name: 'Alice' }, office: { name: 'Lab A' }, created_at: new Date().toISOString() },
    { id: 2, title: 'Printer Jam', description: 'Paper jam in printer', resolved_by: 2, user: { name: 'Bob' }, office: { name: 'Lab B' }, created_at: new Date().toISOString(), resolved_by_user: { name: 'Admin' } }
  ];

  beforeEach(() => {
    mock.reset();
    mock.onGet('/api/reports').reply(200, reportsMock);
    mock.onPost(/\/api\/reports\/.+\/resolve/).reply(200, { message: 'Report resolved successfully' });
  });

  it('renders reports and displays titles', async () => {
    render(<Reports />);
    await waitFor(() => {
      expect(screen.getByText('Broken PC')).toBeInTheDocument();
      expect(screen.getByText('Printer Jam')).toBeInTheDocument();
    });
  });

  it('shows resolved and pending status', async () => {
    render(<Reports />);
    await waitFor(() => {
      expect(screen.getByText(/Resolved/)).toBeInTheDocument();
      expect(screen.getByText(/Pending/)).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    mock.onGet('/api/reports').reply(500);
    render(<Reports />);
    await waitFor(() => {
      expect(screen.getByText(/Error fetching reports/i)).toBeInTheDocument();
    });
  });
});
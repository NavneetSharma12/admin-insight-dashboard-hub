
import { Bill, BillType } from './types';

export const mockBillTypes: BillType[] = [
  {
    id: '1',
    name: 'Maintenance',
    description: 'Monthly maintenance charges',
    societyId: '1',
    societyName: 'Green Valley Apartments',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Water',
    description: 'Water utility charges',
    societyId: '1',
    societyName: 'Green Valley Apartments',
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Electricity',
    description: 'Electricity utility charges',
    societyId: '1',
    societyName: 'Green Valley Apartments',
    createdAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'Parking',
    description: 'Parking space charges',
    societyId: '1',
    societyName: 'Green Valley Apartments',
    createdAt: '2024-01-01'
  }
];

export const mockBills: Bill[] = [
  {
    id: '1',
    residentName: 'John Doe',
    unitNumber: 'A-101',
    billType: 'Maintenance',
    amount: 2500,
    dueDate: '2024-02-15',
    status: 'pending',
    societyId: '1',
    societyName: 'Green Valley Apartments',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    residentName: 'Jane Smith',
    unitNumber: 'B-205',
    billType: 'Water',
    amount: 800,
    dueDate: '2024-02-20',
    status: 'paid',
    societyId: '1',
    societyName: 'Green Valley Apartments',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    residentName: 'Mike Johnson',
    unitNumber: 'C-304',
    billType: 'Electricity',
    amount: 1200,
    dueDate: '2024-02-10',
    status: 'overdue',
    societyId: '1',
    societyName: 'Green Valley Apartments',
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    residentName: 'Sarah Wilson',
    unitNumber: 'A-203',
    billType: 'Parking',
    amount: 500,
    dueDate: '2024-02-25',
    status: 'pending',
    societyId: '1',
    societyName: 'Green Valley Apartments',
    createdAt: '2024-01-25'
  }
];

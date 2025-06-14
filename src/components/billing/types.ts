
export interface Bill {
  id: string;
  residentName: string;
  unitNumber: string;
  billType: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  societyId: string;
  societyName: string;
  createdAt: string;
}

export interface BillType {
  id: string;
  name: string;
  description?: string;
  societyId: string;
  societyName: string;
  createdAt: string;
}


import { useState } from 'react';
import { Bill, BillType } from './types';
import { mockBillTypes, mockBills } from './mockData';
import { useAppSelector } from '../../store/hooks';

export const useBillingData = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [billTypes] = useState<BillType[]>(mockBillTypes);
  const [bills, setBills] = useState<Bill[]>(mockBills);

  // Filter bill types by society
  const availableBillTypes = billTypes.filter(billType => {
    if (user?.role === 'super_admin') {
      return true;
    }
    return billType.societyId === user?.societyId;
  });

  const filteredBills = bills.filter(bill => {
    if (user?.role === 'super_admin') {
      return true;
    }
    return bill.societyId === user?.societyId;
  });

  const handleCreateBill = (values: any) => {
    const newBill: Bill = {
      id: Date.now().toString(),
      ...values,
      status: 'pending',
      societyId: user?.societyId || '1',
      societyName: user?.societyName || 'Default Society',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setBills(prev => [...prev, newBill]);
  };

  const handleEditBill = (updatedBill: Bill) => {
    setBills(prev => prev.map(bill => 
      bill.id === updatedBill.id ? updatedBill : bill
    ));
  };

  return {
    bills: filteredBills,
    billTypes,
    availableBillTypes,
    handleCreateBill,
    handleEditBill
  };
};


import React, { useState } from 'react';
import { Card, Button, Form, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import ProtectedRoute from './ProtectedRoute';
import BillingTable from './billing/BillingTable';
import BillForm from './billing/BillForm';
import { Bill, BillType } from './billing/types';

const { Title, Text } = Typography;

const BillingManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  // Mock bill types data - in real app this would come from API
  const [billTypes] = useState<BillType[]>([
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
  ]);
  
  const [bills, setBills] = useState<Bill[]>([
    {
      id: '1',
      residentName: 'Alice Johnson',
      unitNumber: 'A-101',
      billType: 'Maintenance',
      amount: 5000,
      dueDate: '2024-02-15',
      status: 'pending',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      residentName: 'Bob Smith',
      unitNumber: 'B-205',
      billType: 'Water',
      amount: 800,
      dueDate: '2024-02-10',
      status: 'paid',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      createdAt: '2024-01-10'
    }
  ]);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

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
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  return (
    <ProtectedRoute permission="reports.view">
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!mb-1">
                Billing & Accounting
                {user?.societyName && ` - ${user.societyName}`}
              </Title>
              <Text className="text-gray-600">
                Manage bills, payments and financial reports
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
              className="bg-blue-600"
            >
              Generate Bill
            </Button>
          </div>

          <BillingTable bills={filteredBills} />
        </Card>

        <BillForm
          visible={isCreateModalVisible}
          onCancel={handleCancel}
          onSubmit={handleCreateBill}
          availableBillTypes={availableBillTypes}
          form={form}
        />
      </div>
    </ProtectedRoute>
  );
};

export default BillingManagement;

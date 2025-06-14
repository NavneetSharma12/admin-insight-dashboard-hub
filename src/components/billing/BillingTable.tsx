
import React from 'react';
import { Table, Space, Button, Tag } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Bill } from './types';
import { useAppSelector } from '../../store/hooks';

interface BillingTableProps {
  bills: Bill[];
  onView: (bill: Bill) => void;
  onEdit: (bill: Bill) => void;
}

const BillingTable: React.FC<BillingTableProps> = ({ bills, onView, onEdit }) => {
  const { user } = useAppSelector((state) => state.auth);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Resident',
      key: 'resident',
      render: (_, record: Bill) => (
        <div>
          <div className="font-medium">{record.residentName}</div>
          <div className="text-sm text-gray-500">Unit: {record.unitNumber}</div>
        </div>
      ),
    },
    {
      title: 'Bill Type',
      dataIndex: 'billType',
      key: 'billType',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `₹${amount.toLocaleString()}`,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Society',
      dataIndex: 'societyName',
      key: 'societyName',
      hidden: user?.role !== 'super_admin',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Bill) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => onView(record)}
          >
            View
          </Button>
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ].filter(col => !col.hidden);

  return (
    <Table
      columns={columns}
      dataSource={bills}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
      }}
      className="shadow-sm"
    />
  );
};

export default BillingTable;

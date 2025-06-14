
import React from 'react';
import { Card, Table, Progress } from 'antd';
import { CollectionReport as CollectionReportType } from '../../types/reports';

interface CollectionReportProps {
  data: CollectionReportType[];
}

const CollectionReport: React.FC<CollectionReportProps> = ({ data }) => {
  const columns = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      render: (month: string) => new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    },
    {
      title: 'Total Billed',
      dataIndex: 'totalBilled',
      key: 'totalBilled',
      render: (amount: number) => `₹${amount.toLocaleString()}`
    },
    {
      title: 'Collected',
      dataIndex: 'collected',
      key: 'collected',
      render: (amount: number) => `₹${amount.toLocaleString()}`
    },
    {
      title: 'Pending',
      dataIndex: 'pending',
      key: 'pending',
      render: (amount: number) => `₹${amount.toLocaleString()}`
    },
    {
      title: 'Overdue',
      dataIndex: 'overdue',
      key: 'overdue',
      render: (amount: number) => `₹${amount.toLocaleString()}`
    },
    {
      title: 'Collection Rate',
      dataIndex: 'collectionRate',
      key: 'collectionRate',
      render: (rate: number) => (
        <div className="w-20">
          <Progress
            percent={rate}
            size="small"
            format={(percent) => `${percent?.toFixed(1)}%`}
            strokeColor={rate >= 80 ? '#52c41a' : rate >= 60 ? '#fa8c16' : '#ff4d4f'}
          />
        </div>
      )
    }
  ];

  return (
    <Card title="Collection Performance Report" className="mb-6">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="month"
        pagination={false}
        size="small"
      />
    </Card>
  );
};

export default CollectionReport;

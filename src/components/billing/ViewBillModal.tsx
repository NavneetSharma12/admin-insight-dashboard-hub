
import React from 'react';
import { Modal, Descriptions, Tag, Typography } from 'antd';
import { Bill } from './types';

const { Title } = Typography;

interface ViewBillModalProps {
  visible: boolean;
  onCancel: () => void;
  bill: Bill | null;
}

const ViewBillModal: React.FC<ViewBillModalProps> = ({
  visible,
  onCancel,
  bill
}) => {
  if (!bill) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  return (
    <Modal
      title={<Title level={4}>Bill Details</Title>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Bill ID">
          {bill.id}
        </Descriptions.Item>
        <Descriptions.Item label="Resident Name">
          {bill.residentName}
        </Descriptions.Item>
        <Descriptions.Item label="Unit Number">
          {bill.unitNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Bill Type">
          {bill.billType}
        </Descriptions.Item>
        <Descriptions.Item label="Amount">
          ₹{bill.amount.toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Due Date">
          {bill.dueDate}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(bill.status)}>
            {bill.status.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Society">
          {bill.societyName}
        </Descriptions.Item>
        <Descriptions.Item label="Created Date">
          {bill.createdAt}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ViewBillModal;

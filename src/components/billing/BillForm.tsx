
import React from 'react';
import { Modal, Form, Input, Select, Space, Button, DatePicker } from 'antd';
import { BillType } from './types';

const { Option } = Select;

interface BillFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  availableBillTypes: BillType[];
  form: any;
}

const BillForm: React.FC<BillFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  availableBillTypes,
  form
}) => {
  return (
    <Modal
      title="Generate New Bill"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="residentName"
            label="Resident Name"
            rules={[{ required: true, message: 'Please enter resident name!' }]}
          >
            <Input placeholder="Enter resident name" />
          </Form.Item>

          <Form.Item
            name="unitNumber"
            label="Unit Number"
            rules={[{ required: true, message: 'Please enter unit number!' }]}
          >
            <Input placeholder="Enter unit number" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="billType"
            label="Bill Type"
            rules={[{ required: true, message: 'Please select bill type!' }]}
          >
            <Select placeholder="Select bill type">
              {availableBillTypes.map(billType => (
                <Option key={billType.id} value={billType.name}>
                  {billType.name}
                  {billType.description && (
                    <span className="text-gray-500 text-xs ml-2">
                      - {billType.description}
                    </span>
                  )}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount (₹)"
            rules={[{ required: true, message: 'Please enter amount!' }]}
          >
            <Input type="number" placeholder="Enter amount" />
          </Form.Item>
        </div>

        <Form.Item
          name="dueDate"
          label="Due Date"
          rules={[{ required: true, message: 'Please select due date!' }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" className="bg-blue-600">
              Generate Bill
            </Button>
            <Button onClick={onCancel}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BillForm;

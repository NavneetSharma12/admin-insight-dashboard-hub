
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Space, Button, DatePicker } from 'antd';
import { Bill, BillType } from './types';
import dayjs from 'dayjs';

const { Option } = Select;

interface EditBillModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  availableBillTypes: BillType[];
  bill: Bill | null;
  form: any;
}

const EditBillModal: React.FC<EditBillModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  availableBillTypes,
  bill,
  form
}) => {
  useEffect(() => {
    if (bill && visible) {
      form.setFieldsValue({
        residentName: bill.residentName,
        unitNumber: bill.unitNumber,
        billType: bill.billType,
        amount: bill.amount,
        dueDate: dayjs(bill.dueDate),
        status: bill.status
      });
    }
  }, [bill, visible, form]);

  const handleSubmit = (values: any) => {
    const updatedBill = {
      ...bill,
      ...values,
      dueDate: values.dueDate.format('YYYY-MM-DD')
    };
    onSubmit(updatedBill);
  };

  return (
    <Modal
      title="Edit Bill"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select due date!' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select placeholder="Select status">
              <Option value="pending">Pending</Option>
              <Option value="paid">Paid</Option>
              <Option value="overdue">Overdue</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" className="bg-blue-600">
              Update Bill
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

export default EditBillModal;

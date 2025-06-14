
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Space, Typography, message, Row, Col } from 'antd';
import { UserOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Resident } from '../types/user';
import { useAppSelector } from '../store/hooks';

const { Title, Text } = Typography;
const { Option } = Select;

interface ResidentFormProps {
  resident?: Resident;
  onSave: (resident: Partial<Resident>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const ResidentForm: React.FC<ResidentFormProps> = ({ 
  resident, 
  onSave, 
  onCancel, 
  isEditing = false 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (resident && isEditing) {
      form.setFieldsValue({
        name: resident.name,
        email: resident.email,
        phone: resident.phone,
        unitNumber: resident.unitNumber,
        familyMembers: resident.familyMembers,
        status: resident.status
      });
    }
  }, [resident, isEditing, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const residentData: Partial<Resident> = {
        ...values,
        societyId: user?.societyId || '1',
        societyName: user?.societyName || 'Green Valley Apartments',
        joinDate: isEditing ? resident?.joinDate : new Date().toISOString().split('T')[0],
        id: isEditing ? resident?.id : Date.now().toString()
      };
      
      await onSave(residentData);
      message.success(`Resident ${isEditing ? 'updated' : 'added'} successfully!`);
      
      if (!isEditing) {
        form.resetFields();
      }
    } catch (error) {
      message.error('Failed to save resident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <Title level={3} className="!mb-1">
          {isEditing ? 'Edit Resident' : 'Add New Resident'}
        </Title>
        <Text className="text-gray-600">
          {isEditing ? 'Update resident information' : 'Enter resident details to add them to the system'}
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[
                { required: true, message: 'Please enter resident name' },
                { min: 2, message: 'Name must be at least 2 characters' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Enter full name"
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter email address' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                placeholder="Enter email address"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please enter phone number' },
                { pattern: /^\+?[\d\s-()]+$/, message: 'Please enter a valid phone number' }
              ]}
            >
              <Input 
                placeholder="Enter phone number"
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="unitNumber"
              label="Unit Number"
              rules={[
                { required: true, message: 'Please enter unit number' }
              ]}
            >
              <Input 
                placeholder="e.g., A-101, B-205"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="familyMembers"
              label="Family Members"
              rules={[
                { required: true, message: 'Please enter number of family members' }
              ]}
            >
              <Select placeholder="Select number of family members" size="large">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <Option key={num} value={num}>{num} member{num > 1 ? 's' : ''}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[
                { required: true, message: 'Please select status' }
              ]}
            >
              <Select placeholder="Select status" size="large">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="pending">Pending</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            icon={<CloseOutlined />} 
            onClick={onCancel}
            size="large"
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />}
            loading={loading}
            className="bg-blue-600"
            size="large"
          >
            {isEditing ? 'Update Resident' : 'Add Resident'}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default ResidentForm;

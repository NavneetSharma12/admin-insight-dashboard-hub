
import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, Typography, Tag, Avatar } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { usePermissions } from '../hooks/usePermissions';
import { useSociety } from '../hooks/useSociety';
import ProtectedRoute from './ProtectedRoute';

const { Title, Text } = Typography;
const { Option } = Select;

interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  shift: string;
  status: 'active' | 'inactive';
  societyId: string;
  societyName: string;
  joinDate: string;
  salary?: number;
}

const StaffManagement: React.FC = () => {
  const { user } = usePermissions();
  const { selectedSociety } = useSociety();
  
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: '1',
      name: 'Ram Kumar',
      role: 'Security Guard',
      phone: '+91 9876543210',
      email: 'ram@security.com',
      shift: 'Night (10 PM - 6 AM)',
      status: 'active',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      joinDate: '2024-01-01',
      salary: 25000
    },
    {
      id: '2',
      name: 'Sita Devi',
      role: 'Housekeeping',
      phone: '+91 9876543211',
      shift: 'Morning (8 AM - 4 PM)',
      status: 'active',
      societyId: '1',
      societyName: 'Green Valley Apartments',
      joinDate: '2024-01-15',
      salary: 20000
    }
  ]);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredStaff = staff.filter(member => {
    if (user?.role === 'super_admin') {
      return selectedSociety ? member.societyId === selectedSociety.id : true;
    }
    return member.societyId === user?.societyId;
  });

  const handleCreateStaff = (values: any) => {
    const newStaff: Staff = {
      id: Date.now().toString(),
      ...values,
      status: 'active',
      societyId: selectedSociety?.id || user?.societyId || '1',
      societyName: selectedSociety?.name || user?.societyName || 'Default Society',
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    setStaff(prev => [...prev, newStaff]);
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Staff Member',
      key: 'staff',
      render: (_, record: Staff) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<UserOutlined />} className="bg-green-600" />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500">{record.role}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record: Staff) => (
        <div>
          <div className="text-sm">{record.phone}</div>
          {record.email && <div className="text-sm text-gray-500">{record.email}</div>}
        </div>
      ),
    },
    {
      title: 'Shift',
      dataIndex: 'shift',
      key: 'shift',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary: number) => salary ? `₹${salary.toLocaleString()}` : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
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
      render: (_, record: Staff) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small">View</Button>
          <Button icon={<EditOutlined />} size="small">Edit</Button>
        </Space>
      ),
    },
  ].filter(col => !col.hidden);

  return (
    <ProtectedRoute permission="residents.view">
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!mb-1">
                Staff & Vendor Management
                {selectedSociety && ` - ${selectedSociety.name}`}
              </Title>
              <Text className="text-gray-600">
                Manage security, housekeeping and vendor staff
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
              className="bg-blue-600"
            >
              Add Staff
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={filteredStaff}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
            className="shadow-sm"
          />
        </Card>

        <Modal
          title="Add New Staff Member"
          open={isCreateModalVisible}
          onCancel={() => {
            setIsCreateModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateStaff}
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter staff name!' }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>

              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select role!' }]}
              >
                <Select placeholder="Select role">
                  <Option value="Security Guard">Security Guard</Option>
                  <Option value="Housekeeping">Housekeeping</Option>
                  <Option value="Maintenance">Maintenance</Option>
                  <Option value="Gardener">Gardener</Option>
                  <Option value="Vendor">Vendor</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please enter phone number!' }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
              >
                <Input placeholder="Enter email (optional)" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="shift"
                label="Shift"
                rules={[{ required: true, message: 'Please enter shift details!' }]}
              >
                <Select placeholder="Select shift">
                  <Option value="Morning (8 AM - 4 PM)">Morning (8 AM - 4 PM)</Option>
                  <Option value="Evening (4 PM - 10 PM)">Evening (4 PM - 10 PM)</Option>
                  <Option value="Night (10 PM - 6 AM)">Night (10 PM - 6 AM)</Option>
                  <Option value="Full Day">Full Day</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="salary"
                label="Monthly Salary (₹)"
              >
                <Input type="number" placeholder="Enter monthly salary" />
              </Form.Item>
            </div>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" className="bg-blue-600">
                  Add Staff
                </Button>
                <Button onClick={() => setIsCreateModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default StaffManagement;

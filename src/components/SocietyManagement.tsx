import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, Typography, Tag, Avatar, Badge, message } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, HomeOutlined, UserOutlined, UserAddOutlined } from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import { Society, CreateSocietyRequest } from '../types/society';
import { CreateUserRequest } from '../types/user';
import ProtectedRoute from './ProtectedRoute';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const SocietyManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission as any);
  };

  const [societies, setSocieties] = useState<Society[]>([
    {
      id: '1',
      name: 'Green Valley Apartments',
      description: 'Modern residential complex with premium amenities',
      address: '123 Green Valley Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      contactEmail: 'admin@greenvalley.com',
      contactPhone: '+91 9876543210',
      totalUnits: 120,
      occupiedUnits: 95,
      adminId: '2',
      adminName: 'John Smith',
      adminEmail: 'john@greenvalley.com',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Sunset Heights',
      description: 'Luxury high-rise with city views',
      address: '456 Sunset Boulevard',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      contactEmail: 'admin@sunsetheights.com',
      contactPhone: '+91 9876543211',
      totalUnits: 200,
      occupiedUnits: 180,
      adminId: '3',
      adminName: 'Jane Doe',
      adminEmail: 'jane@sunsetheights.com',
      createdAt: '2024-02-10',
      updatedAt: '2024-02-10',
      status: 'active'
    }
  ]);
  
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isCreateAdminModalVisible, setIsCreateAdminModalVisible] = useState(false);
  const [isUpdateAdminModalVisible, setIsUpdateAdminModalVisible] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState<Society | null>(null);
  const [selectedSocietyForAdmin, setSelectedSocietyForAdmin] = useState<Society | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [adminForm] = Form.useForm();
  const [updateAdminForm] = Form.useForm();

  const filteredSocieties = hasPermission('society.view_all') 
    ? societies 
    : societies.filter(society => society.adminId === user?.id);

  const handleCreateSociety = (values: CreateSocietyRequest) => {
    const newSociety: Society = {
      id: Date.now().toString(),
      ...values,
      occupiedUnits: 0,
      adminId: '',
      adminName: 'No Admin Assigned',
      adminEmail: '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    
    setSocieties(prev => [...prev, newSociety]);
    setIsCreateModalVisible(false);
    form.resetFields();
    message.success('Society created successfully! You can now assign an admin.');
  };

  const handleEditSociety = (values: any) => {
    if (!selectedSociety) return;
    
    const updatedSociety = {
      ...selectedSociety,
      ...values,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setSocieties(prev => prev.map(society => 
      society.id === selectedSociety.id ? updatedSociety : society
    ));
    
    setIsEditModalVisible(false);
    setSelectedSociety(null);
    editForm.resetFields();
    message.success('Society updated successfully!');
  };

  const handleEditClick = (society: Society) => {
    setSelectedSociety(society);
    editForm.setFieldsValue(society);
    setIsEditModalVisible(true);
  };

  const handleCreateAdmin = (values: CreateUserRequest) => {
    if (!selectedSocietyForAdmin) return;
    
    // In real implementation, this would create the admin user
    console.log('Creating admin for society:', selectedSocietyForAdmin.name, values);
    
    // Update the society with the new admin info
    setSocieties(prev => prev.map(society => 
      society.id === selectedSocietyForAdmin.id 
        ? { ...society, adminName: values.name, adminEmail: values.email, adminId: Date.now().toString() }
        : society
    ));
    
    setIsCreateAdminModalVisible(false);
    setSelectedSocietyForAdmin(null);
    adminForm.resetFields();
    message.success('Admin created successfully!');
  };

  const handleUpdateAdmin = (values: any) => {
    if (!selectedSociety) return;
    
    // Update the society with the new admin info
    setSocieties(prev => prev.map(society => 
      society.id === selectedSociety.id 
        ? { ...society, adminName: values.adminName, adminEmail: values.adminEmail }
        : society
    ));
    
    // Update the selected society for the detail modal
    setSelectedSociety(prev => prev ? { ...prev, adminName: values.adminName, adminEmail: values.adminEmail } : null);
    
    setIsUpdateAdminModalVisible(false);
    updateAdminForm.resetFields();
    message.success('Admin details updated successfully!');
  };

  const handleUpdateAdminClick = (society: Society) => {
    updateAdminForm.setFieldsValue({
      adminName: society.adminName,
      adminEmail: society.adminEmail
    });
    setIsUpdateAdminModalVisible(true);
  };

  const handleCreateAdminForSociety = (society: Society) => {
    setSelectedSocietyForAdmin(society);
    setIsCreateAdminModalVisible(true);
  };

  const handleViewDetails = (society: Society) => {
    setSelectedSociety(society);
    setIsDetailModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'error';
  };

  const columns = [
    {
      title: 'Society',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Society) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<HomeOutlined />} className="bg-blue-600" />
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-500">{record.city}, {record.state}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Admin',
      dataIndex: 'adminName',
      key: 'adminName',
      render: (adminName: string, record: Society) => (
        <div className="flex items-center space-x-2">
          <Avatar size="small" icon={<UserOutlined />} className={record.adminId ? "bg-green-600" : "bg-gray-400"} />
          <div>
            <div className="text-sm font-medium">{adminName}</div>
            <div className="text-xs text-gray-500">{record.adminEmail || 'No email assigned'}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Units',
      key: 'units',
      render: (_, record: Society) => (
        <div>
          <Text className="font-medium">{record.occupiedUnits}/{record.totalUnits}</Text>
          <div className="text-xs text-gray-500">
            {Math.round((record.occupiedUnits / record.totalUnits) * 100)}% occupied
          </div>
        </div>
      ),
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
      title: 'Contact',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      render: (phone: string, record: Society) => (
        <div>
          <div className="text-sm">{phone}</div>
          <div className="text-xs text-gray-500">{record.contactEmail}</div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Society) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            size="small"
          >
            View
          </Button>
          {hasPermission('society.edit') && (
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditClick(record)}
              size="small"
            >
              Edit
            </Button>
          )}
          <Button
            icon={<UserAddOutlined />}
            onClick={() => handleCreateAdminForSociety(record)}
            size="small"
            type="primary"
            className="bg-green-600"
          >
            Create Admin
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute permission="society.view">
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!mb-1">Society Management</Title>
              <Text className="text-gray-600">
                {hasPermission('society.view_all') 
                  ? 'Manage all societies and their administrators' 
                  : 'View your assigned society'}
              </Text>
            </div>
            {hasPermission('society.create') && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalVisible(true)}
                className="bg-blue-600"
              >
                Create Society
              </Button>
            )}
          </div>

          <Table
            columns={columns}
            dataSource={filteredSocieties}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            className="shadow-sm"
          />
        </Card>

        {/* Create Society Modal */}
        <Modal
          title="Create New Society"
          open={isCreateModalVisible}
          onCancel={() => {
            setIsCreateModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateSociety}
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label="Society Name"
                rules={[{ required: true, message: 'Please enter society name!' }]}
              >
                <Input placeholder="Enter society name" />
              </Form.Item>

              <Form.Item
                name="contactPhone"
                label="Contact Phone"
                rules={[{ required: true, message: 'Please enter contact phone!' }]}
              >
                <Input placeholder="Enter contact phone" />
              </Form.Item>
            </div>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter description!' }]}
            >
              <TextArea rows={3} placeholder="Enter society description" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address!' }]}
              >
                <Input placeholder="Enter address" />
              </Form.Item>

              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter city!' }]}
              >
                <Input placeholder="Enter city" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'Please select state!' }]}
              >
                <Select placeholder="Select state">
                  <Option value="Maharashtra">Maharashtra</Option>
                  <Option value="Delhi">Delhi</Option>
                  <Option value="Karnataka">Karnataka</Option>
                  <Option value="Gujarat">Gujarat</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="zipCode"
                label="Zip Code"
                rules={[{ required: true, message: 'Please enter zip code!' }]}
              >
                <Input placeholder="Enter zip code" />
              </Form.Item>

              <Form.Item
                name="totalUnits"
                label="Total Units"
                rules={[{ required: true, message: 'Please enter total units!' }]}
              >
                <Input type="number" placeholder="Enter total units" />
              </Form.Item>
            </div>

            <Form.Item
              name="contactEmail"
              label="Contact Email"
              rules={[
                { required: true, message: 'Please enter contact email!' },
                { type: 'email', message: 'Please enter valid email!' }
              ]}
            >
              <Input placeholder="Enter contact email" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" className="bg-blue-600">
                  Create Society
                </Button>
                <Button onClick={() => setIsCreateModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Society Modal */}
        <Modal
          title="Edit Society"
          open={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            setSelectedSociety(null);
            editForm.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditSociety}
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label="Society Name"
                rules={[{ required: true, message: 'Please enter society name!' }]}
              >
                <Input placeholder="Enter society name" />
              </Form.Item>

              <Form.Item
                name="contactPhone"
                label="Contact Phone"
                rules={[{ required: true, message: 'Please enter contact phone!' }]}
              >
                <Input placeholder="Enter contact phone" />
              </Form.Item>
            </div>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter description!' }]}
            >
              <TextArea rows={3} placeholder="Enter society description" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address!' }]}
              >
                <Input placeholder="Enter address" />
              </Form.Item>

              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter city!' }]}
              >
                <Input placeholder="Enter city" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'Please select state!' }]}
              >
                <Select placeholder="Select state">
                  <Option value="Maharashtra">Maharashtra</Option>
                  <Option value="Delhi">Delhi</Option>
                  <Option value="Karnataka">Karnataka</Option>
                  <Option value="Gujarat">Gujarat</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="zipCode"
                label="Zip Code"
                rules={[{ required: true, message: 'Please enter zip code!' }]}
              >
                <Input placeholder="Enter zip code" />
              </Form.Item>

              <Form.Item
                name="totalUnits"
                label="Total Units"
                rules={[{ required: true, message: 'Please enter total units!' }]}
              >
                <Input type="number" placeholder="Enter total units" />
              </Form.Item>
            </div>

            <Form.Item
              name="contactEmail"
              label="Contact Email"
              rules={[
                { required: true, message: 'Please enter contact email!' },
                { type: 'email', message: 'Please enter valid email!' }
              ]}
            >
              <Input placeholder="Enter contact email" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status!' }]}
            >
              <Select placeholder="Select status">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" className="bg-blue-600">
                  Update Society
                </Button>
                <Button onClick={() => setIsEditModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Create Admin Modal */}
        <Modal
          title={`Create Admin for ${selectedSocietyForAdmin?.name}`}
          open={isCreateAdminModalVisible}
          onCancel={() => {
            setIsCreateAdminModalVisible(false);
            setSelectedSocietyForAdmin(null);
            adminForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={adminForm}
            layout="vertical"
            onFinish={handleCreateAdmin}
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label="Admin Name"
                rules={[{ required: true, message: 'Please enter admin name!' }]}
              >
                <Input placeholder="Enter admin name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Admin Email"
                rules={[
                  { required: true, message: 'Please enter admin email!' },
                  { type: 'email', message: 'Please enter valid email!' }
                ]}
              >
                <Input placeholder="Enter admin email" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="phone"
                label="Phone Number"
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please enter password!' }]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </div>

            <Form.Item
              name="role"
              label="Role"
              initialValue="admin"
            >
              <Select disabled>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" className="bg-blue-600">
                  Create Admin
                </Button>
                <Button onClick={() => setIsCreateAdminModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Update Admin Modal */}
        <Modal
          title={`Update Admin for ${selectedSociety?.name}`}
          open={isUpdateAdminModalVisible}
          onCancel={() => {
            setIsUpdateAdminModalVisible(false);
            updateAdminForm.resetFields();
          }}
          footer={null}
          width={500}
        >
          <Form
            form={updateAdminForm}
            layout="vertical"
            onFinish={handleUpdateAdmin}
          >
            <Form.Item
              name="adminName"
              label="Admin Name"
              rules={[{ required: true, message: 'Please enter admin name!' }]}
            >
              <Input placeholder="Enter admin name" />
            </Form.Item>

            <Form.Item
              name="adminEmail"
              label="Admin Email"
              rules={[
                { required: true, message: 'Please enter admin email!' },
                { type: 'email', message: 'Please enter valid email!' }
              ]}
            >
              <Input placeholder="Enter admin email" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" className="bg-blue-600">
                  Update Admin
                </Button>
                <Button onClick={() => setIsUpdateAdminModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Society Details Modal */}
        <Modal
          title="Society Details"
          open={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={null}
          width={700}
        >
          {selectedSociety && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar size={64} icon={<HomeOutlined />} className="bg-blue-600" />
                <div>
                  <Title level={4} className="!mb-1">{selectedSociety.name}</Title>
                  <Badge status={getStatusColor(selectedSociety.status)} text={selectedSociety.status.toUpperCase()} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card size="small" title="Contact Information">
                  <p><strong>Email:</strong> {selectedSociety.contactEmail}</p>
                  <p><strong>Phone:</strong> {selectedSociety.contactPhone}</p>
                </Card>

                <Card size="small" title="Unit Information">
                  <p><strong>Total Units:</strong> {selectedSociety.totalUnits}</p>
                  <p><strong>Occupied:</strong> {selectedSociety.occupiedUnits}</p>
                  <p><strong>Occupancy Rate:</strong> {Math.round((selectedSociety.occupiedUnits / selectedSociety.totalUnits) * 100)}%</p>
                </Card>
              </div>

              <Card size="small" title="Address">
                <p>{selectedSociety.address}</p>
                <p>{selectedSociety.city}, {selectedSociety.state} {selectedSociety.zipCode}</p>
              </Card>

              <Card size="small" title="Description">
                <p>{selectedSociety.description}</p>
              </Card>

              <Card 
                size="small" 
                title="Admin Details"
                extra={
                  selectedSociety.adminId && (
                    <Button 
                      size="small" 
                      onClick={() => handleUpdateAdminClick(selectedSociety)}
                      className="text-blue-600"
                    >
                      Update Admin
                    </Button>
                  )
                }
              >
                <div className="flex items-center space-x-3">
                  <Avatar icon={<UserOutlined />} className={selectedSociety.adminId ? "bg-green-600" : "bg-gray-400"} />
                  <div>
                    <p className="font-medium">{selectedSociety.adminName}</p>
                    <p className="text-sm text-gray-500">{selectedSociety.adminEmail || 'No admin assigned'}</p>
                  </div>
                </div>
              </Card>

              <div className="text-xs text-gray-500">
                Created: {selectedSociety.createdAt} | Updated: {selectedSociety.updatedAt}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default SocietyManagement;


import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Space, Typography, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';
import ProtectedRoute from './ProtectedRoute';

const { Title, Text } = Typography;

interface BillType {
  id: string;
  name: string;
  description?: string;
  societyId: string;
  societyName: string;
  createdAt: string;
}

const BillTypeMaster: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const [billTypes, setBillTypes] = useState<BillType[]>([
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

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editingBillType, setEditingBillType] = useState<BillType | null>(null);
  const [form] = Form.useForm();

  const filteredBillTypes = billTypes.filter(billType => {
    if (user?.role === 'super_admin') {
      return true;
    }
    return billType.societyId === user?.societyId;
  });

  const handleCreateBillType = (values: any) => {
    const newBillType: BillType = {
      id: Date.now().toString(),
      ...values,
      societyId: user?.societyId || '1',
      societyName: user?.societyName || 'Default Society',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setBillTypes(prev => [...prev, newBillType]);
    setIsCreateModalVisible(false);
    form.resetFields();
    message.success('Bill type created successfully!');
  };

  const handleEditBillType = (values: any) => {
    if (editingBillType) {
      setBillTypes(prev => prev.map(bt => 
        bt.id === editingBillType.id ? { ...bt, ...values } : bt
      ));
      setEditingBillType(null);
      setIsCreateModalVisible(false);
      form.resetFields();
      message.success('Bill type updated successfully!');
    }
  };

  const handleDeleteBillType = (id: string) => {
    setBillTypes(prev => prev.filter(bt => bt.id !== id));
    message.success('Bill type deleted successfully!');
  };

  const openEditModal = (billType: BillType) => {
    setEditingBillType(billType);
    form.setFieldsValue({
      name: billType.name,
      description: billType.description
    });
    setIsCreateModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingBillType(null);
    form.resetFields();
    setIsCreateModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setEditingBillType(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Bill Type Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span className="font-medium">{name}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => description || '-',
    },
    {
      title: 'Society',
      dataIndex: 'societyName',
      key: 'societyName',
      hidden: user?.role !== 'super_admin',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: BillType) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this bill type?"
            onConfirm={() => handleDeleteBillType(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ].filter(col => !col.hidden);

  return (
    <ProtectedRoute permission="reports.view">
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!mb-1">
                Bill Type Master
                {user?.societyName && ` - ${user.societyName}`}
              </Title>
              <Text className="text-gray-600">
                Manage bill types for billing and accounting
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
              className="bg-blue-600"
            >
              Add Bill Type
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={filteredBillTypes}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
            className="shadow-sm"
          />
        </Card>

        <Modal
          title={editingBillType ? 'Edit Bill Type' : 'Add New Bill Type'}
          open={isCreateModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={500}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={editingBillType ? handleEditBillType : handleCreateBillType}
          >
            <Form.Item
              name="name"
              label="Bill Type Name"
              rules={[
                { required: true, message: 'Please enter bill type name!' },
                { min: 2, message: 'Name must be at least 2 characters!' }
              ]}
            >
              <Input placeholder="Enter bill type name" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
            >
              <Input.TextArea
                placeholder="Enter description (optional)"
                rows={3}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" className="bg-blue-600">
                  {editingBillType ? 'Update' : 'Create'} Bill Type
                </Button>
                <Button onClick={handleCancel}>
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

export default BillTypeMaster;

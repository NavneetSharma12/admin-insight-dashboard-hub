
import React, { useState } from 'react';
import { Card, Button, Form, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProtectedRoute from './ProtectedRoute';
import BillingTable from './billing/BillingTable';
import BillForm from './billing/BillForm';
import ViewBillModal from './billing/ViewBillModal';
import EditBillModal from './billing/EditBillModal';
import { useBillingData } from './billing/useBillingData';
import { Bill } from './billing/types';

const { Title, Text } = Typography;

const BillingManagement: React.FC = () => {
  const { bills, availableBillTypes, handleCreateBill, handleEditBill } = useBillingData();
  
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const handleCreateSubmit = (values: any) => {
    handleCreateBill(values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
  };

  const handleEditSubmit = (updatedBill: Bill) => {
    handleEditBill(updatedBill);
    setIsEditModalVisible(false);
    editForm.resetFields();
    setSelectedBill(null);
  };

  const handleView = (bill: Bill) => {
    setSelectedBill(bill);
    setIsViewModalVisible(true);
  };

  const handleEdit = (bill: Bill) => {
    setSelectedBill(bill);
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsViewModalVisible(false);
    setIsEditModalVisible(false);
    setSelectedBill(null);
    createForm.resetFields();
    editForm.resetFields();
  };

  return (
    <ProtectedRoute permission="reports.view">
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!mb-1">
                Billing & Accounting
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

          <BillingTable 
            bills={bills} 
            onView={handleView}
            onEdit={handleEdit}
          />
        </Card>

        <BillForm
          visible={isCreateModalVisible}
          onCancel={handleCancel}
          onSubmit={handleCreateSubmit}
          availableBillTypes={availableBillTypes}
          form={createForm}
        />

        <ViewBillModal
          visible={isViewModalVisible}
          onCancel={handleCancel}
          bill={selectedBill}
        />

        <EditBillModal
          visible={isEditModalVisible}
          onCancel={handleCancel}
          onSubmit={handleEditSubmit}
          availableBillTypes={availableBillTypes}
          bill={selectedBill}
          form={editForm}
        />
      </div>
    </ProtectedRoute>
  );
};

export default BillingManagement;

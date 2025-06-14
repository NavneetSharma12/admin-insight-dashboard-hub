
import React, { useState } from 'react';
import { Card, Typography, Button, Space, Tabs } from 'antd';
import { Download, FileText, BarChart3 } from 'lucide-react';
import ProtectedRoute from './ProtectedRoute';
import { useReportData } from './reports/useReportData';
import ReportFilters from './reports/ReportFilters';
import FinancialSummaryCard from './reports/FinancialSummaryCard';
import RevenueCharts from './reports/RevenueCharts';
import CollectionReport from './reports/CollectionReport';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ReportsModule: React.FC = () => {
  const { reportData, filters, setFilters, exportToCSV, bills } = useReportData();
  const [activeTab, setActiveTab] = useState('overview');

  const handleApplyFilters = () => {
    // Filters are automatically applied through the hook
    console.log('Filters applied:', filters);
  };

  const handleExportReport = (type: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (type) {
      case 'bills':
        exportToCSV(bills, `bills-report-${timestamp}`);
        break;
      case 'revenue':
        exportToCSV(reportData.revenueByType, `revenue-by-type-${timestamp}`);
        break;
      case 'collection':
        exportToCSV(reportData.collectionReport, `collection-report-${timestamp}`);
        break;
      case 'monthly':
        exportToCSV(reportData.monthlyRevenue, `monthly-revenue-${timestamp}`);
        break;
      default:
        break;
    }
  };

  return (
    <ProtectedRoute permission="reports.view">
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={3} className="!mb-1">
                Financial Reports & Analytics
              </Title>
              <Text className="text-gray-600">
                Comprehensive financial reporting and analytics dashboard
              </Text>
            </div>
            <Space>
              <Button
                icon={<Download />}
                onClick={() => handleExportReport('bills')}
              >
                Export Bills
              </Button>
              <Button
                type="primary"
                icon={<FileText />}
                onClick={() => handleExportReport('collection')}
                className="bg-blue-600"
              >
                Export Collection Report
              </Button>
            </Space>
          </div>

          <ReportFilters
            filters={filters}
            onFiltersChange={setFilters}
            onApplyFilters={handleApplyFilters}
          />

          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Overview" key="overview">
              <FinancialSummaryCard data={reportData.financialSummary} />
              <RevenueCharts
                revenueByType={reportData.revenueByType}
                monthlyRevenue={reportData.monthlyRevenue}
              />
            </TabPane>

            <TabPane tab="Collection Analysis" key="collection">
              <CollectionReport data={reportData.collectionReport} />
              <div className="flex justify-end mt-4">
                <Button
                  icon={<Download />}
                  onClick={() => handleExportReport('collection')}
                >
                  Export Collection Data
                </Button>
              </div>
            </TabPane>

            <TabPane tab="Revenue Analysis" key="revenue">
              <Card title="Revenue Breakdown" className="mb-6">
                <div className="space-y-4">
                  {reportData.revenueByType.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                      <div>
                        <Text className="font-medium">{item.billType}</Text>
                        <div className="text-sm text-gray-500">
                          {item.count} bills
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{item.amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          {item.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="flex justify-end">
                <Button
                  icon={<Download />}
                  onClick={() => handleExportReport('revenue')}
                >
                  Export Revenue Data
                </Button>
              </div>
            </TabPane>

            <TabPane tab="Monthly Trends" key="trends">
              <Card title="Monthly Performance" className="mb-6">
                <div className="space-y-4">
                  {reportData.monthlyRevenue.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                      <div>
                        <Text className="font-medium">
                          {new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </Text>
                        <div className="text-sm text-gray-500">
                          {item.billsCount} bills processed
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{item.revenue.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="flex justify-end">
                <Button
                  icon={<Download />}
                  onClick={() => handleExportReport('monthly')}
                >
                  Export Monthly Data
                </Button>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default ReportsModule;

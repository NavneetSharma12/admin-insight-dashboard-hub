
import React from 'react';
import { Card, Row, Col } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { RevenueByType, MonthlyRevenue } from '../../types/reports';

interface RevenueChartsProps {
  revenueByType: RevenueByType[];
  monthlyRevenue: MonthlyRevenue[];
}

const COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2'];

const RevenueCharts: React.FC<RevenueChartsProps> = ({ revenueByType, monthlyRevenue }) => {
  return (
    <Row gutter={[24, 24]} className="mb-6">
      <Col xs={24} lg={12}>
        <Card title="Revenue by Bill Type" className="h-96">
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={revenueByType}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                dataKey="amount"
                nameKey="billType"
              >
                {revenueByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="Monthly Revenue Trend" className="h-96">
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24}>
        <Card title="Revenue Breakdown by Type" className="h-80">
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={revenueByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="billType" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']} />
              <Bar dataKey="amount" fill="#1890ff" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
};

export default RevenueCharts;

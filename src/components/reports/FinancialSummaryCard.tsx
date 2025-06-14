
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { DollarSign, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { FinancialSummary } from '../../types/reports';

interface FinancialSummaryCardProps {
  data: FinancialSummary;
}

const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ data }) => {
  return (
    <Row gutter={[16, 16]} className="mb-6">
      <Col xs={24} sm={12} lg={6}>
        <Card className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <Statistic
            title="Total Revenue"
            value={data.totalRevenue}
            precision={0}
            prefix="₹"
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <Statistic
            title="Pending Amount"
            value={data.pendingAmount}
            precision={0}
            prefix="₹"
            valueStyle={{ color: '#fa8c16' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card className="text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <Statistic
            title="Overdue Amount"
            value={data.overdueAmount}
            precision={0}
            prefix="₹"
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <Statistic
            title="Collection Rate"
            value={data.collectionRate}
            precision={1}
            suffix="%"
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default FinancialSummaryCard;


import React from 'react';
import { Card, Row, Col, Statistic, Progress, List, Avatar, Badge, Typography, Alert, Divider } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  HomeOutlined,
  ToolOutlined,
  SafetyOutlined,
  BankOutlined
} from '@ant-design/icons';
import { useAppSelector } from '../store/hooks';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const stats = [
    {
      title: 'Total Residents',
      value: 95,
      change: 8,
      positive: true,
      icon: <TeamOutlined className="text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Pending Requests',
      value: 12,
      change: 3,
      positive: false,
      icon: <ClockCircleOutlined className="text-orange-600" />,
      color: 'bg-orange-100'
    },
    {
      title: 'Active Members',
      value: 89,
      change: 5,
      positive: true,
      icon: <CheckCircleOutlined className="text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: 'Outstanding Dues',
      value: '₹85,240',
      change: 12.5,
      positive: false,
      icon: <DollarCircleOutlined className="text-red-600" />,
      color: 'bg-red-100'
    }
  ];

  const facilityStats = [
    {
      title: 'Community Hall',
      status: 'Available',
      bookings: 3,
      icon: <HomeOutlined className="text-purple-600" />,
      color: 'bg-purple-100'
    },
    {
      title: 'Swimming Pool',
      status: 'Maintenance',
      bookings: 0,
      icon: <ToolOutlined className="text-yellow-600" />,
      color: 'bg-yellow-100'
    },
    {
      title: 'Gym',
      status: 'Available',
      bookings: 8,
      icon: <SafetyOutlined className="text-indigo-600" />,
      color: 'bg-indigo-100'
    },
    {
      title: 'Parking',
      status: 'Available',
      bookings: 67,
      icon: <BankOutlined className="text-gray-600" />,
      color: 'bg-gray-100'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      user: 'Sarah Johnson',
      action: 'submitted maintenance request for Unit A-204',
      time: '15 minutes ago',
      type: 'request'
    },
    {
      id: 2,
      user: 'Mike Chen',
      action: 'paid monthly maintenance fee',
      time: '1 hour ago',
      type: 'payment'
    },
    {
      id: 3,
      user: 'Emily Davis',
      action: 'booked community hall for birthday party',
      time: '2 hours ago',
      type: 'booking'
    },
    {
      id: 4,
      user: 'Alex Rodriguez',
      action: 'submitted complaint about parking issue',
      time: '3 hours ago',
      type: 'complaint'
    },
    {
      id: 5,
      user: 'Jennifer Wilson',
      action: 'updated emergency contact information',
      time: '4 hours ago',
      type: 'update'
    },
    {
      id: 6,
      user: 'Robert Smith',
      action: 'registered guest for weekend visit',
      time: '5 hours ago',
      type: 'guest'
    }
  ];

  const pendingRequests = [
    { name: 'James Wilson', email: 'james.wilson@email.com', date: '2024-06-07', unit: 'A-204', type: 'Maintenance' },
    { name: 'Lisa Brown', email: 'lisa.brown@email.com', date: '2024-06-06', unit: 'B-105', type: 'Complaint' },
    { name: 'David Lee', email: 'david.lee@email.com', date: '2024-06-05', unit: 'C-301', type: 'Booking' },
    { name: 'Maria Garcia', email: 'maria.garcia@email.com', date: '2024-06-04', unit: 'D-202', type: 'Security' },
    { name: 'Kevin Johnson', email: 'kevin.johnson@email.com', date: '2024-06-03', unit: 'A-101', type: 'Facilities' }
  ];

  const urgentMatters = [
    { title: 'Water Tank Cleaning', priority: 'High', dueDate: 'Today', department: 'Maintenance' },
    { title: 'Elevator Maintenance', priority: 'Medium', dueDate: 'Tomorrow', department: 'Technical' },
    { title: 'Security Meeting', priority: 'High', dueDate: '2 days', department: 'Security' },
    { title: 'Fire Safety Inspection', priority: 'Medium', dueDate: '3 days', department: 'Safety' }
  ];

  const monthlyStats = {
    maintenance: { completed: 45, pending: 12, total: 57 },
    payments: { collected: 78, pending: 17, total: 95 },
    complaints: { resolved: 23, pending: 8, total: 31 },
    events: { completed: 5, upcoming: 3, total: 8 }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Alert
        message={`Welcome back, ${user?.name}!`}
        description={`Managing ${user?.societyName || 'your society'} - You have 12 pending items requiring attention.`}
        type="info"
        showIcon
        className="mb-6"
      />

      {/* Main Stats Cards */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-slate-600 text-sm">{stat.title}</Text>
                  <div className="flex items-center space-x-2 mt-1">
                    <Title level={3} className="!mb-0">
                      {stat.value}
                    </Title>
                    <div className={`flex items-center text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.positive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      <span className="ml-1">{stat.change}%</span>
                    </div>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Facility Status Cards */}
      <Card title="Facility Status Overview" className="mb-6">
        <Row gutter={[16, 16]}>
          {facilityStats.map((facility, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card size="small" className="text-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 ${facility.color}`}>
                  {facility.icon}
                </div>
                <Title level={5} className="!mb-1">{facility.title}</Title>
                <Badge 
                  status={facility.status === 'Available' ? 'success' : 'warning'} 
                  text={facility.status} 
                />
                <div className="text-sm text-gray-500 mt-1">
                  {facility.bookings} bookings
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Occupancy Rate */}
        <Col xs={24} lg={8}>
          <Card title="Unit Occupancy" className="h-full">
            <div className="text-center">
              <Progress
                type="circle"
                percent={79}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                className="mb-4"
              />
              <div>
                <Title level={4}>95/120 Units</Title>
                <Text className="text-slate-600">79% Occupied</Text>
              </div>
              <Divider />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <Text className="text-slate-500 text-sm">Available</Text>
                  <div className="text-xl font-semibold text-green-600">25</div>
                </div>
                <div>
                  <Text className="text-slate-500 text-sm">Maintenance</Text>
                  <div className="text-xl font-semibold text-orange-600">3</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Monthly Performance */}
        <Col xs={24} lg={8}>
          <Card title="Monthly Performance" className="h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Text>Maintenance Requests</Text>
                <div className="text-right">
                  <div className="text-sm text-green-600">{monthlyStats.maintenance.completed} completed</div>
                  <div className="text-xs text-gray-500">{monthlyStats.maintenance.pending} pending</div>
                </div>
              </div>
              <Progress percent={Math.round((monthlyStats.maintenance.completed / monthlyStats.maintenance.total) * 100)} strokeColor="#52c41a" />
              
              <div className="flex justify-between items-center">
                <Text>Payment Collection</Text>
                <div className="text-right">
                  <div className="text-sm text-green-600">{monthlyStats.payments.collected} collected</div>
                  <div className="text-xs text-gray-500">{monthlyStats.payments.pending} pending</div>
                </div>
              </div>
              <Progress percent={Math.round((monthlyStats.payments.collected / monthlyStats.payments.total) * 100)} strokeColor="#1890ff" />
              
              <div className="flex justify-between items-center">
                <Text>Complaint Resolution</Text>
                <div className="text-right">
                  <div className="text-sm text-green-600">{monthlyStats.complaints.resolved} resolved</div>
                  <div className="text-xs text-gray-500">{monthlyStats.complaints.pending} pending</div>
                </div>
              </div>
              <Progress percent={Math.round((monthlyStats.complaints.resolved / monthlyStats.complaints.total) * 100)} strokeColor="#722ed1" />
            </div>
          </Card>
        </Col>

        {/* Urgent Matters */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <div className="flex items-center justify-between">
                <span>Urgent Matters</span>
                <Badge count={urgentMatters.length} className="bg-red-500" />
              </div>
            } 
            className="h-full"
          >
            <List
              dataSource={urgentMatters}
              renderItem={(item) => (
                <List.Item className="border-0 px-0">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <ExclamationCircleOutlined className={`${item.priority === 'High' ? 'text-red-500' : 'text-orange-500'}`} />
                      <div>
                        <div className="font-medium text-sm">{item.title}</div>
                        <Text className="text-xs text-slate-500">{item.department} • Due: {item.dueDate}</Text>
                      </div>
                    </div>
                    <Badge 
                      status={item.priority === 'High' ? 'error' : 'warning'} 
                      text={item.priority} 
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Recent Activity */}
        <Col xs={24} lg={12}>
          <Card title="Recent Activity" className="h-full">
            <List
              dataSource={recentActivity}
              renderItem={(item) => (
                <List.Item className="border-0 px-0">
                  <div className="flex items-start space-x-3 w-full">
                    <Avatar size="small" icon={<UserOutlined />} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">
                        <span className="font-medium">{item.user}</span>
                        <span className="text-slate-600"> {item.action}</span>
                      </div>
                      <Text className="text-xs text-slate-500">{item.time}</Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Pending Actions */}
        <Col xs={24} lg={12}>
          <Card title="Pending Actions" className="h-full">
            <List
              dataSource={pendingRequests}
              renderItem={(item) => (
                <List.Item className="border-0 px-0">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <Avatar icon={<UserOutlined />} size="small" />
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <Text className="text-xs text-slate-500">Unit {item.unit} - {item.type}</Text>
                      </div>
                    </div>
                    <div className="text-right">
                      <Text className="text-xs text-slate-500">{item.date}</Text>
                      <Badge status="warning" text="Pending" />
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

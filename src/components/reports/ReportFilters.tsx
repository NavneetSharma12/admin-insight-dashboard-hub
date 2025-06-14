
import React from 'react';
import { Card, Form, Select, DatePicker, Button } from 'antd';
import { ReportFilter } from '../../types/reports';
import { useAppSelector } from '../../store/hooks';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface ReportFiltersProps {
  filters: ReportFilter;
  onFiltersChange: (filters: ReportFilter) => void;
  onApplyFilters: () => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters
}) => {
  const { user } = useAppSelector((state) => state.auth);

  const billTypes = ['Maintenance', 'Water', 'Electricity', 'Parking'];

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      onFiltersChange({
        ...filters,
        dateRange: {
          start: dates[0].format('YYYY-MM-DD'),
          end: dates[1].format('YYYY-MM-DD')
        }
      });
    }
  };

  return (
    <Card title="Report Filters" className="mb-6">
      <Form layout="inline" className="flex flex-wrap gap-4">
        <Form.Item label="Date Range">
          <RangePicker
            value={[
              dayjs(filters.dateRange.start),
              dayjs(filters.dateRange.end)
            ]}
            onChange={handleDateRangeChange}
          />
        </Form.Item>

        <Form.Item label="Bill Type">
          <Select
            value={filters.billType}
            onChange={(value) => onFiltersChange({ ...filters, billType: value })}
            placeholder="All Types"
            allowClear
            style={{ width: 150 }}
          >
            {billTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Status">
          <Select
            value={filters.status}
            onChange={(value) => onFiltersChange({ ...filters, status: value })}
            placeholder="All Status"
            allowClear
            style={{ width: 150 }}
          >
            <Option value="paid">Paid</Option>
            <Option value="pending">Pending</Option>
            <Option value="overdue">Overdue</Option>
          </Select>
        </Form.Item>

        {user?.role === 'super_admin' && (
          <Form.Item label="Society">
            <Select
              value={filters.societyId}
              onChange={(value) => onFiltersChange({ ...filters, societyId: value })}
              placeholder="All Societies"
              allowClear
              style={{ width: 200 }}
            >
              <Option value="1">Green Valley Apartments</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" onClick={onApplyFilters}>
            Apply Filters
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ReportFilters;

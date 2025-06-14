
import { useState, useMemo } from 'react';
import { Bill } from '../billing/types';
import { ReportFilter, ReportData, FinancialSummary, RevenueByType, MonthlyRevenue, CollectionReport } from '../../types/reports';
import { mockBills } from '../billing/mockData';
import { useAppSelector } from '../../store/hooks';

export const useReportData = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [bills] = useState<Bill[]>(mockBills);
  const [filters, setFilters] = useState<ReportFilter>({
    dateRange: {
      start: '2024-01-01',
      end: '2024-12-31'
    }
  });

  // Filter bills based on user role and society
  const filteredBills = useMemo(() => {
    let filtered = bills;

    // Filter by society for non-super admins
    if (user?.role !== 'super_admin' && user?.societyId) {
      filtered = filtered.filter(bill => bill.societyId === user.societyId);
    }

    // Apply additional filters
    if (filters.societyId) {
      filtered = filtered.filter(bill => bill.societyId === filters.societyId);
    }

    if (filters.billType) {
      filtered = filtered.filter(bill => bill.billType === filters.billType);
    }

    if (filters.status) {
      filtered = filtered.filter(bill => bill.status === filters.status);
    }

    // Filter by date range
    filtered = filtered.filter(bill => 
      bill.createdAt >= filters.dateRange.start && 
      bill.createdAt <= filters.dateRange.end
    );

    return filtered;
  }, [bills, filters, user]);

  const reportData = useMemo((): ReportData => {
    const totalRevenue = filteredBills
      .filter(bill => bill.status === 'paid')
      .reduce((sum, bill) => sum + bill.amount, 0);

    const pendingAmount = filteredBills
      .filter(bill => bill.status === 'pending')
      .reduce((sum, bill) => sum + bill.amount, 0);

    const overdueAmount = filteredBills
      .filter(bill => bill.status === 'overdue')
      .reduce((sum, bill) => sum + bill.amount, 0);

    const totalBilled = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);
    const collectionRate = totalBilled > 0 ? (totalRevenue / totalBilled) * 100 : 0;

    const financialSummary: FinancialSummary = {
      totalRevenue,
      pendingAmount,
      overdueAmount,
      collectionRate,
      totalBills: filteredBills.length
    };

    // Revenue by type
    const revenueByTypeMap = new Map<string, { amount: number; count: number }>();
    filteredBills
      .filter(bill => bill.status === 'paid')
      .forEach(bill => {
        const existing = revenueByTypeMap.get(bill.billType) || { amount: 0, count: 0 };
        revenueByTypeMap.set(bill.billType, {
          amount: existing.amount + bill.amount,
          count: existing.count + 1
        });
      });

    const revenueByType: RevenueByType[] = Array.from(revenueByTypeMap.entries()).map(([type, data]) => ({
      billType: type,
      amount: data.amount,
      count: data.count,
      percentage: totalRevenue > 0 ? (data.amount / totalRevenue) * 100 : 0
    }));

    // Monthly revenue (simplified - using created date)
    const monthlyRevenueMap = new Map<string, { revenue: number; count: number }>();
    filteredBills
      .filter(bill => bill.status === 'paid')
      .forEach(bill => {
        const month = bill.createdAt.substring(0, 7); // YYYY-MM
        const existing = monthlyRevenueMap.get(month) || { revenue: 0, count: 0 };
        monthlyRevenueMap.set(month, {
          revenue: existing.revenue + bill.amount,
          count: existing.count + 1
        });
      });

    const monthlyRevenue: MonthlyRevenue[] = Array.from(monthlyRevenueMap.entries()).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      billsCount: data.count
    }));

    // Collection report (simplified)
    const collectionReportMap = new Map<string, { totalBilled: number; collected: number; pending: number; overdue: number }>();
    filteredBills.forEach(bill => {
      const month = bill.createdAt.substring(0, 7);
      const existing = collectionReportMap.get(month) || { totalBilled: 0, collected: 0, pending: 0, overdue: 0 };
      
      existing.totalBilled += bill.amount;
      if (bill.status === 'paid') existing.collected += bill.amount;
      else if (bill.status === 'pending') existing.pending += bill.amount;
      else if (bill.status === 'overdue') existing.overdue += bill.amount;
      
      collectionReportMap.set(month, existing);
    });

    const collectionReport: CollectionReport[] = Array.from(collectionReportMap.entries()).map(([month, data]) => ({
      month,
      totalBilled: data.totalBilled,
      collected: data.collected,
      pending: data.pending,
      overdue: data.overdue,
      collectionRate: data.totalBilled > 0 ? (data.collected / data.totalBilled) * 100 : 0
    }));

    return {
      financialSummary,
      revenueByType,
      monthlyRevenue,
      collectionReport
    };
  }, [filteredBills]);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    reportData,
    filters,
    setFilters,
    exportToCSV,
    bills: filteredBills
  };
};


export interface ReportFilter {
  societyId?: string;
  dateRange: {
    start: string;
    end: string;
  };
  billType?: string;
  status?: 'paid' | 'pending' | 'overdue';
}

export interface FinancialSummary {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  collectionRate: number;
  totalBills: number;
}

export interface RevenueByType {
  billType: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  billsCount: number;
}

export interface CollectionReport {
  month: string;
  totalBilled: number;
  collected: number;
  pending: number;
  overdue: number;
  collectionRate: number;
}

export interface ReportData {
  financialSummary: FinancialSummary;
  revenueByType: RevenueByType[];
  monthlyRevenue: MonthlyRevenue[];
  collectionReport: CollectionReport[];
}

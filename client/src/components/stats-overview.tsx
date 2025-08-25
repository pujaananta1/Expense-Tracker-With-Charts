import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface StatsData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  expensesByCategory: Record<string, number>;
}

export default function StatsOverview() {
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ["/api/transactions/stats/summary"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Income */}
      <Card className="bg-card rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-income/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-income" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-income" data-testid="total-income">
                {formatCurrency(stats?.totalIncome || 0)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-income font-medium">+12.5%</span>
              <span className="ml-1">from last month</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card className="bg-card rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-expense/10 rounded-lg">
              <TrendingDown className="w-6 h-6 text-expense" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-expense" data-testid="total-expenses">
                {formatCurrency(stats?.totalExpenses || 0)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-expense font-medium">+8.2%</span>
              <span className="ml-1">from last month</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Income */}
      <Card className="bg-card rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Income</p>
              <p className="text-2xl font-bold text-primary" data-testid="net-income">
                {formatCurrency(stats?.netIncome || 0)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-income font-medium">+15.3%</span>
              <span className="ml-1">from last month</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

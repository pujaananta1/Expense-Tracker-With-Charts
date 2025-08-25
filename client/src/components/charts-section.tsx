import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Chart from "chart.js/auto";

interface StatsData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  expensesByCategory: Record<string, number>;
}

interface TrendsData {
  month: string;
  income: number;
  expenses: number;
}

const categoryColors: Record<string, string> = {
  bills: "#8B5CF6", // purple
  food: "#3B82F6", // blue
  others: "#EF4444", // red
  transportation: "#10B981", // green
  shopping: "#F59E0B", // yellow
  entertainment: "#EC4899", // pink
  healthcare: "#14B8A6", // teal
};

const categoryLabels: Record<string, string> = {
  bills: "Bills & Utilities",
  food: "Food & Dining",
  transportation: "Transportation",
  shopping: "Shopping",
  entertainment: "Entertainment",
  healthcare: "Healthcare",
  salary: "Salary",
  freelance: "Freelance",
  investment: "Investment",
};

export default function ChartsSection() {
  const expenseChartRef = useRef<HTMLCanvasElement>(null);
  const trendsChartRef = useRef<HTMLCanvasElement>(null);
  const expenseChartInstance = useRef<Chart | null>(null);
  const trendsChartInstance = useRef<Chart | null>(null);

  const { data: stats } = useQuery<StatsData>({
    queryKey: ["/api/transactions/stats/summary"],
  });

  const { data: trends } = useQuery<TrendsData[]>({
    queryKey: ["/api/transactions/stats/trends"],
  });

  // Expense Breakdown Chart
  useEffect(() => {
    if (!expenseChartRef.current || !stats?.expensesByCategory) return;

    // Destroy existing chart
    if (expenseChartInstance.current) {
      expenseChartInstance.current.destroy();
    }

    const ctx = expenseChartRef.current.getContext("2d");
    if (!ctx) return;

    const categories = Object.keys(stats.expensesByCategory);
    const amounts = Object.values(stats.expensesByCategory);
    const colors = categories.map(cat => categoryColors[cat] || "#6B7280");

    expenseChartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: categories.map(cat => categoryLabels[cat] || cat),
        datasets: [{
          data: amounts,
          backgroundColor: colors,
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || "";
                const value = context.parsed;
                const total = amounts.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (expenseChartInstance.current) {
        expenseChartInstance.current.destroy();
      }
    };
  }, [stats]);

  // Monthly Trends Chart
  useEffect(() => {
    if (!trendsChartRef.current || !trends || trends.length === 0) return;

    // Destroy existing chart
    if (trendsChartInstance.current) {
      trendsChartInstance.current.destroy();
    }

    const ctx = trendsChartRef.current.getContext("2d");
    if (!ctx) return;

    const labels = trends.map(t => {
      const [year, month] = t.month.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthNames[parseInt(month) - 1];
    });

    trendsChartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Income",
          data: trends.map(t => t.income),
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
          tension: 0.4,
        }, {
          label: "Expenses",
          data: trends.map(t => t.expenses),
          borderColor: "#EF4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          fill: true,
          tension: 0.4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return "$" + (value as number).toLocaleString();
              },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });

    return () => {
      if (trendsChartInstance.current) {
        trendsChartInstance.current.destroy();
      }
    };
  }, [trends]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Expense Breakdown Chart */}
      <Card className="bg-card rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Expense Breakdown</CardTitle>
            <Select defaultValue="this-month">
              <SelectTrigger className="w-40" data-testid="select-expense-period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-64">
              <canvas ref={expenseChartRef} data-testid="chart-expenses"></canvas>
            </div>
            <div className="w-full md:w-1/2 mt-4 md:mt-0 md:ml-6">
              <div className="space-y-3">
                {stats?.expensesByCategory && Object.entries(stats.expensesByCategory).map(([category, amount]) => {
                  const total = Object.values(stats.expensesByCategory).reduce((a, b) => a + b, 0);
                  const percentage = ((amount / total) * 100).toFixed(0);
                  
                  return (
                    <div key={category} className="flex items-center justify-between" data-testid={`category-${category}`}>
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3" 
                          style={{ backgroundColor: categoryColors[category] || "#6B7280" }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">
                          {categoryLabels[category] || category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(amount)}
                        </div>
                        <div className="text-xs text-gray-500">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends Chart */}
      <Card className="bg-card rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Monthly Trends</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-income rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Income</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-expense rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Expenses</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <canvas ref={trendsChartRef} data-testid="chart-trends"></canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Transaction } from "@shared/schema";

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

const categoryColors: Record<string, string> = {
  bills: "bg-purple-100 text-purple-800",
  food: "bg-blue-100 text-blue-800",
  transportation: "bg-yellow-100 text-yellow-800",
  shopping: "bg-pink-100 text-pink-800",
  entertainment: "bg-indigo-100 text-indigo-800",
  healthcare: "bg-teal-100 text-teal-800",
  salary: "bg-green-100 text-green-800",
  freelance: "bg-green-100 text-green-800",
  investment: "bg-green-100 text-green-800",
};

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/stats/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/stats/trends"] });
      
      toast({
        title: "Transaction Deleted",
        description: "The transaction has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransactionMutation.mutate(id);
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter transactions based on search term and category
  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = !searchTerm || 
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryLabels[transaction.category]?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || categoryFilter === "all" || transaction.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading) {
    return (
      <Card className="bg-card rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Transactions</CardTitle>
          <div className="mt-3 sm:mt-0 flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
                data-testid="input-search"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48" data-testid="select-filter-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm || categoryFilter ? "No transactions match your filters." : "No transactions found."}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50" data-testid={`transaction-${transaction.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description || "No description"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        className={`${categoryColors[transaction.category] || "bg-gray-100 text-gray-800"}`}
                        data-testid={`badge-category-${transaction.category}`}
                      >
                        {categoryLabels[transaction.category] || transaction.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.type === "income" ? "text-income" : "text-expense"}>
                        {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80"
                          data-testid={`button-edit-${transaction.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-expense hover:text-expense/80"
                          onClick={() => handleDelete(transaction.id)}
                          disabled={deleteTransactionMutation.isPending}
                          data-testid={`button-delete-${transaction.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{Math.min(filteredTransactions.length, 10)}</span> of{" "}
              <span className="font-medium">{filteredTransactions.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled data-testid="button-previous">
                Previous
              </Button>
              <Button variant="default" size="sm" className="bg-primary text-white" data-testid="button-page-1">
                1
              </Button>
              <Button variant="outline" size="sm" data-testid="button-next">
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

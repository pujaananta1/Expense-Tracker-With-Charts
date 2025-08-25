import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertTransaction } from "@shared/schema";

const categories = [
  { value: "food", label: "Food & Dining" },
  { value: "transportation", label: "Transportation" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Entertainment" },
  { value: "bills", label: "Bills & Utilities" },
  { value: "healthcare", label: "Healthcare" },
  { value: "salary", label: "Salary" },
  { value: "freelance", label: "Freelance" },
  { value: "investment", label: "Investment" },
];

export default function TransactionForm() {
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTransactionMutation = useMutation({
    mutationFn: async (transaction: InsertTransaction) => {
      const response = await apiRequest("POST", "/api/transactions", transaction);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/stats/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/stats/trends"] });
      
      // Reset form
      setAmount("");
      setCategory("");
      setDescription("");
      setDate(new Date().toISOString().split('T')[0]);
      
      toast({
        title: "Transaction Added",
        description: "Your transaction has been successfully added.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const transaction: InsertTransaction = {
      type: transactionType,
      amount: parseFloat(amount).toFixed(2),
      category,
      date,
      description: description || undefined,
    };

    createTransactionMutation.mutate(transaction);
  };

  return (
    <Card className="bg-card rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Add New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={transactionType === "income" ? "default" : "outline"}
                className={`${
                  transactionType === "income" 
                    ? "border-2 border-income text-white bg-income hover:bg-income/90" 
                    : "border-2 border-gray-300 text-gray-700 hover:border-income hover:text-income"
                }`}
                onClick={() => setTransactionType("income")}
                data-testid="button-type-income"
              >
                Income
              </Button>
              <Button
                type="button"
                variant={transactionType === "expense" ? "default" : "outline"}
                className={`${
                  transactionType === "expense" 
                    ? "border-2 border-expense text-white bg-expense hover:bg-expense/90" 
                    : "border-2 border-gray-300 text-gray-700 hover:border-expense hover:text-expense"
                }`}
                onClick={() => setTransactionType("expense")}
                data-testid="button-type-expense"
              >
                Expense
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                data-testid="input-amount"
              />
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-testid="select-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-testid="input-date"
            />
          </div>

          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none"
              data-testid="textarea-description"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary text-white hover:bg-primary/90"
            disabled={createTransactionMutation.isPending}
            data-testid="button-submit-transaction"
          >
            {createTransactionMutation.isPending ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

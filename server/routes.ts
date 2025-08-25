import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // Get transaction by ID
  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getTransactionById(req.params.id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  // Create new transaction
  app.post("/api/transactions", async (req, res) => {
    try {
      const validation = insertTransactionSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid transaction data", details: validation.error.errors });
      }

      const transaction = await storage.createTransaction(validation.data);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  // Update transaction
  app.put("/api/transactions/:id", async (req, res) => {
    try {
      const validation = insertTransactionSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid transaction data", details: validation.error.errors });
      }

      const transaction = await storage.updateTransaction(req.params.id, validation.data);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to update transaction" });
    }
  });

  // Delete transaction
  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTransaction(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

  // Get transactions statistics
  app.get("/api/transactions/stats/summary", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      
      const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const expenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const netIncome = income - expenses;

      // Category breakdown for expenses
      const expensesByCategory = transactions
        .filter(t => t.type === "expense")
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
          return acc;
        }, {} as Record<string, number>);

      res.json({
        totalIncome: income,
        totalExpenses: expenses,
        netIncome,
        expensesByCategory
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate statistics" });
    }
  });

  // Export transactions as CSV
  app.get("/api/transactions/export/csv", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      
      // Create CSV content
      const headers = ["Date", "Type", "Category", "Description", "Amount"];
      const csvRows = [headers.join(",")];
      
      transactions.forEach(transaction => {
        const row = [
          transaction.date,
          transaction.type,
          transaction.category,
          `"${transaction.description || ""}"`,
          transaction.amount
        ];
        csvRows.push(row.join(","));
      });
      
      const csvContent = csvRows.join("\n");
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=transactions.csv");
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ error: "Failed to export transactions" });
    }
  });

  // Get monthly trends data
  app.get("/api/transactions/stats/trends", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      
      // Group by month for the last 10 months
      const monthlyData: Record<string, { income: number; expenses: number }> = {};
      
      transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { income: 0, expenses: 0 };
        }
        
        if (transaction.type === "income") {
          monthlyData[monthKey].income += parseFloat(transaction.amount);
        } else {
          monthlyData[monthKey].expenses += parseFloat(transaction.amount);
        }
      });

      // Convert to array format for charts
      const sortedMonths = Object.keys(monthlyData).sort();
      const trends = sortedMonths.map(month => ({
        month,
        income: monthlyData[month].income,
        expenses: monthlyData[month].expenses
      }));

      res.json(trends);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trends data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import { type Transaction, type InsertTransaction } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Transaction operations
  getAllTransactions(): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string): Promise<boolean>;
  getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]>;
  getTransactionsByType(type: "income" | "expense"): Promise<Transaction[]>;
  getTransactionsByCategory(category: string): Promise<Transaction[]>;
}

export class MemStorage implements IStorage {
  private transactions: Map<string, Transaction>;

  constructor() {
    this.transactions = new Map();
    
    // Add some initial sample data
    const sampleTransactions: InsertTransaction[] = [
      {
        type: "expense",
        amount: "85.40",
        category: "food",
        description: "Grocery Shopping",
        date: "2024-10-15"
      },
      {
        type: "income", 
        amount: "850.00",
        category: "freelance",
        description: "Freelance Project",
        date: "2024-10-14"
      },
      {
        type: "expense",
        amount: "45.20", 
        category: "transportation",
        description: "Gas Station",
        date: "2024-10-13"
      },
      {
        type: "income",
        amount: "4200.00",
        category: "salary", 
        description: "Monthly Salary",
        date: "2024-10-12"
      },
      {
        type: "expense",
        amount: "120.45",
        category: "bills",
        description: "Electric Bill", 
        date: "2024-10-10"
      }
    ];

    sampleTransactions.forEach(transaction => {
      const id = randomUUID();
      const fullTransaction: Transaction = { ...transaction, id, description: transaction.description || null };
      this.transactions.set(id, fullTransaction);
    });
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { ...insertTransaction, id, description: insertTransaction.description || null };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: string, updateData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const existing = this.transactions.get(id);
    if (!existing) return undefined;
    
    const updated: Transaction = { ...existing, ...updateData };
    this.transactions.set(id, updated);
    return updated;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    return this.transactions.delete(id);
  }

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    const transactions = await this.getAllTransactions();
    return transactions.filter(t => t.date >= startDate && t.date <= endDate);
  }

  async getTransactionsByType(type: "income" | "expense"): Promise<Transaction[]> {
    const transactions = await this.getAllTransactions();
    return transactions.filter(t => t.type === type);
  }

  async getTransactionsByCategory(category: string): Promise<Transaction[]> {
    const transactions = await this.getAllTransactions();
    return transactions.filter(t => t.category === category);
  }
}

export const storage = new MemStorage();

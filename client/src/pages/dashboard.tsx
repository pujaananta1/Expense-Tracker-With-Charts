import Header from "@/components/header";
import StatsOverview from "@/components/stats-overview";
import TransactionForm from "@/components/transaction-form";
import ChartsSection from "@/components/charts-section";
import TransactionHistory from "@/components/transaction-history";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TransactionForm />
          </div>
          
          <div className="lg:col-span-2">
            <ChartsSection />
          </div>
        </div>

        <div className="mt-8">
          <TransactionHistory />
        </div>
      </main>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const { toast } = useToast();

  const handleExportCSV = async () => {
    try {
      const response = await fetch("/api/transactions/export/csv", {
        method: 'GET',
        headers: {
          'Accept': 'text/csv',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      link.style.display = 'none';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Export Successful",
        description: "Your transactions have been exported to CSV.",
      });
    } catch (error) {
      console.error("CSV Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export transactions. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-card shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold" style={{ color: '#2563EB' }} data-testid="app-title">
                ExpenseTracker Pro
              </h1>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-primary font-medium" data-testid="nav-dashboard">
              Dashboard
            </a>
            <a href="#" className="text-gray-600 hover:text-primary font-medium" data-testid="nav-transactions">
              Transactions
            </a>
            <a href="#" className="text-gray-600 hover:text-primary font-medium" data-testid="nav-reports">
              Reports
            </a>
            <a href="#" className="text-gray-600 hover:text-primary font-medium" data-testid="nav-settings">
              Settings
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleExportCSV}
              className="text-white hover:opacity-90"
              style={{ backgroundColor: '#2563EB' }}
              data-testid="button-export-csv"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <div className="w-8 h-8 bg-gray-300 rounded-full" data-testid="avatar-placeholder"></div>
          </div>
        </div>
      </div>
    </header>
  );
}

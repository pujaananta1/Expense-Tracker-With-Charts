# ExpenseTracker Pro
**Live Demo on Render:**  
👉 [https://expense-tracker-with-charts-ohjn.onrender.com](https://expense-tracker-with-charts-ohjn.onrender.com)

A modern, full-stack expense tracking web application built with React and Express.js. ExpenseTracker Pro provides comprehensive personal finance management features including transaction recording, categorization, statistical analysis, and data visualization.

![ExpenseTracker Pro](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.0+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Express.js](https://img.shields.io/badge/Express.js-4.0+-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-38B2AC)

## 🚀 Features

### 💰 Financial Management
- **Transaction Recording**: Add, edit, and delete income/expense transactions
- **Smart Categorization**: Organize transactions by categories (Food, Transportation, Bills, etc.)
- **Real-time Statistics**: View total income, expenses, and net income instantly

### 📊 Data Visualization
- **Interactive Pie Charts**: Visual breakdown of expenses by category using Chart.js
- **Monthly Trends**: Line charts showing income vs expenses over time
- **Professional Dashboard**: Clean, Mint-inspired interface with financial insights

### 🔍 Data Management
- **Advanced Search**: Find transactions by description or category
- **Category Filtering**: Filter transaction history by specific categories
- **CSV Export**: Download transaction reports for external analysis
- **Date-based Sorting**: Chronological organization of financial data

### 🎨 User Experience
- **Responsive Design**: Mobile-optimized interface that works on all devices
- **Real-time Updates**: Instant UI updates with optimistic updates
- **Toast Notifications**: User-friendly feedback for all actions
- **Professional Styling**: Clean, modern design with consistent color scheme

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript for component-based UI
- **Vite** for fast development and optimized builds
- **TailwindCSS** for utility-first styling
- **shadcn/ui** component library for consistent, accessible components
- **TanStack Query** for server state management and caching
- **Wouter** for lightweight client-side routing
- **Chart.js** for interactive data visualizations
- **React Hook Form** with Zod validation for form handling

### Backend
- **Express.js** with TypeScript for REST API
- **Drizzle ORM** with PostgreSQL schema definitions
- **Zod** for runtime validation and type safety
- **In-memory storage** with sample data for development
- **RESTful API design** with comprehensive error handling

### Development Tools
- **TypeScript** with strict configuration
- **ESBuild** for production bundling
- **Path aliases** for clean imports
- **CSS variables** for consistent theming

## 🎨 Design System

ExpenseTracker Pro follows a professional color scheme inspired by leading financial apps:

- **Primary Blue**: `#2563EB` - Professional, trustworthy interface elements
- **Income Green**: `#10B981` - Positive financial indicators
- **Expense Red**: `#EF4444` - Spending and expense indicators  
- **Background**: `#F8FAFC` - Clean, light workspace
- **Cards**: `#FFFFFF` - Content containers with subtle shadows

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/expensetracker-pro.git
   cd expensetracker-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5000
   ```

The application runs both frontend and backend on the same port for seamless development.

## 🎯 Usage

### Adding Transactions
1. Navigate to the dashboard
2. Use the "Add New Transaction" form on the left
3. Select income or expense type
4. Enter amount, category, date, and optional description
5. Click "Add Transaction"

### Viewing Analytics  
- **Stats Overview**: View total income, expenses, and net income at the top
- **Expense Breakdown**: Interactive pie chart showing spending by category
- **Monthly Trends**: Line chart comparing income vs expenses over time

### Managing Data
- **Search Transactions**: Use the search bar to find specific transactions
- **Filter by Category**: Use the dropdown to filter by transaction categories
- **Export Data**: Click "Export CSV" to download transaction reports
- **Delete Transactions**: Use the trash icon in the transaction history

## 🔌 API Endpoints

### Transactions
- `GET /api/transactions` - Retrieve all transactions
- `GET /api/transactions/:id` - Get specific transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update existing transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Analytics
- `GET /api/transactions/stats/summary` - Get financial statistics
- `GET /api/transactions/stats/trends` - Get monthly trend data
- `GET /api/transactions/export/csv` - Export transactions to CSV

### Request/Response Examples

**Create Transaction**
```bash
POST /api/transactions
Content-Type: application/json

{
  "type": "expense",
  "amount": "25.50", 
  "category": "food",
  "date": "2024-03-15",
  "description": "Lunch at cafe"
}
```

**Get Statistics**
```bash
GET /api/transactions/stats/summary

Response:
{
  "totalIncome": 5000.00,
  "totalExpenses": 1250.85,  
  "netIncome": 3749.15,
  "expensesByCategory": {
    "food": 450.25,
    "transportation": 200.60,
    "bills": 600.00
  }
}
```

## 🏗 Project Structure

```
expensetracker-pro/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   ├── header.tsx
│   │   │   ├── transaction-form.tsx
│   │   │   ├── charts-section.tsx
│   │   │   └── transaction-history.tsx
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/          # Utilities and configurations
│   │   └── App.tsx       # Main application component
│   └── index.html
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data storage interface
│   └── vite.ts           # Vite integration
├── shared/               # Shared TypeScript types
│   └── schema.ts         # Database schemas and types
└── package.json
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file for environment-specific settings:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=your_database_url_here
```

### Database Setup
For production deployment with persistent data:

1. Set up a PostgreSQL database
2. Update `DATABASE_URL` in your environment variables
3. Run database migrations:
   ```bash
   npm run db:migrate
   ```

## 🚀 Deployment
Render Deployment (Recommended)
1.Push your code to GitHub
2.Go to Render and create a new Web Service
3.Connect your GitHub repo
4.Set environment variables:
  PORT=5000
  DATABASE_URL=your_postgres_url
5.Render will build and deploy automatically

### Manual Deployment
For other platforms:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the built files to your hosting provider
3. Ensure environment variables are properly configured
4. Set up your PostgreSQL database

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Budget planning and goal setting
- [ ] Recurring transaction support
- [ ] Advanced reporting with date range filtering
- [ ] Bank account integration
- [ ] Mobile app version
- [ ] Dark mode theme
- [ ] Multi-currency support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by financial management apps like Mint and Personal Capital
- Built using modern web development best practices
- Special thanks to the open-source community for the amazing tools and libraries


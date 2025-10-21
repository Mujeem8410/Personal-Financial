
Personal Finance Visualizer 
Welcome to the Personal Finance Visualizer, a simple web application designed to help you track your income, expenses, and manage budgets with interactive charts and a clean interface.

Features 
Dashboard Overview: Get a quick summary of your Total Balance, Total Income, and Total Expenses for the current month.

Monthly Trend Chart: Visualize your Income vs. Expenses over the last six months with a bar chart.

Category Breakdown: See how your expenses are distributed for the current month using a Pie Chart (top 10 categories).

Transaction Management:

Add, edit, and delete individual transactions.

View all transactions with filtering by type (Income/Expense) and category.

Export transactions data to a CSV file.

Budgeting:

Set monthly budgets for specific expense categories.

Compare Budgeted vs. Actual spending with a bar chart.

Track budget status (Under, Approaching, Over budget) in a detailed table.

Responsive Design: Built with Tailwind CSS for a modern, responsive look.

Data Visualization: Uses Chart.js for clear and engaging data representation.

Client-Side Storage: Data is currently stored in memory.

Technologies Used 
HTML5: For the application structure.

Tailwind CSS: For styling and a utility-first approach.

JavaScript (ES6+): For all application logic and DOM manipulation.

Chart.js: For rendering all data visualizations (bar and pie charts).

Setup and Installation 🚀
This is a client-side application and does not require a backend server.

Clone the repository (if it were in one):

Bash
# git clone https://github.com/Mujeem8410/Personal-Financial.git
# cd personal-finance-visualizer
Ensure you have the files: Make sure you have the index.html, index.js, and index.css (or a similar style file, though Tailwind is used via CDN here) files in the same directory.

Open in Browser: Simply open the index.html file in your preferred web browser:

Bash
open index.html
The application will load with some generated sample data.

Usage Guide 
The application is split into three main tabs:
1. Dashboard Tab
Summary Cards: Displays the current month's financial snapshot.

Monthly Chart: Shows the income and expense trend over the last 6 months.

Category Chart: Shows a breakdown of the current month's expenses.

Recent Transactions: Lists the 5 most recent transactions.
2. Transactions Tab
Filter & Sort: Use the dropdowns to filter transactions by Income, Expense, and Category.

Add Transaction: Click "Add Transaction" to log a new entry (income or expense).

Edit/Delete: Use the actions column to modify or remove existing transactions.

Export CSV: Click "Export CSV" to download the currently filtered list of transactions.
3. Budget Tab
Set Budget: Click "Set Budget" to allocate a budget amount for an expense category for a specific month. The application will warn and update if a budget already exists for that category/month.

Budget vs Actual Chart: Compares your budgeted amount against your actual spending for each category in the current month.

Budget Details Table: Provides a detailed breakdown of Budgeted, Spent, and Remaining amounts, along with a Status indicator:

Under budget: Spending is below 90% of the budget.

Approaching limit: Spending is between 90% and 100% of the budget.

Over budget: Spending has exceeded the budgeted amount.

Code Structure 
The core application logic resides in index.js. Key functions include:



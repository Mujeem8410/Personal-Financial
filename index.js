  const categories = {
            income: ['Salary', 'Bonus', 'Freelance', 'Investments', 'Gifts', 'Other Income'],
            expense: ['Housing', 'Utilities', 'Food', 'Transportation', 'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Personal', 'Other Expenses']
        };

        // Transaction data structure
        let transactions = [];
        let budgets = [];

        // Chart instances
        let monthlyChart;
        let categoryChart;
        let budgetChart;

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            updateCurrentMonth();
            populateCategoryDropdowns();
            loadSampleData();
            setupEventListeners();
            setupTabs();
            
            // Initialize charts with empty data
            renderCharts();
        });

        function updateCurrentMonth() {
            const now = new Date();
            const monthName = now.toLocaleString('default', { month: 'long' });
            document.getElementById('current-month').textContent = `${monthName} ${now.getFullYear()}`;
        }

        function populateCategoryDropdowns() {
            const transactionCategory = document.getElementById('transaction-category');
            const budgetCategory = document.getElementById('budget-category');
            const filterCategory = document.getElementById('category-filter');
            
            // Clear existing options
            transactionCategory.innerHTML = '';
            budgetCategory.innerHTML = '';
            filterCategory.innerHTML = '<option value="all">All Categories</option>';
            
            // Expense categories
            const expenseGroup = document.createElement('optgroup');
            expenseGroup.label = 'Expenses';
            categories.expense.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                expenseGroup.appendChild(option);
                
                // Add to filter dropdown too
                const filterOption = option.cloneNode(true);
                filterCategory.appendChild(filterOption);
            });
            transactionCategory.appendChild(expenseGroup);
            budgetCategory.appendChild(expenseGroup.cloneNode(true));
            
            // Income categories
            const incomeGroup = document.createElement('optgroup');
            incomeGroup.label = 'Income';
            categories.income.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                incomeGroup.appendChild(option);
                
                // Add to filter dropdown too
                const filterOption = option.cloneNode(true);
                filterCategory.appendChild(filterOption);
            });
            transactionCategory.appendChild(incomeGroup);
        }

        function loadSampleData() {
            // Clear existing data
            transactions = [];
            budgets = [];
            
            // Add some sample transactions
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            
            // Sample transactions spread across few months
            for (let i = 0; i < 12; i++) {
                const month = (currentMonth - i + 12) % 12; // Spread across last 12 months
                const year = month > currentMonth ? currentYear - 1 : currentYear;
                
                // Income
                transactions.push({
                    id: generateId(),
                    type: 'income',
                    amount: 2800 + Math.random() * 500,
                    date: new Date(year, month, 5).toISOString().split('T')[0],
                    description: 'Monthly Salary',
                    category: 'Salary'
                });
                
                transactions.push({
                    id: generateId(),
                    type: 'income',
                    amount: 300 + Math.random() * 200,
                    date: new Date(year, month, 15).toISOString().split('T')[0],
                    description: 'Freelance Work',
                    category: 'Freelance'
                });
                
                // Expenses
                const expenseCount = 5 + Math.floor(Math.random() * 10);
                for (let j = 0; j < expenseCount; j++) {
                    const day = 1 + Math.floor(Math.random() * 28);
                    const expenseCat = categories.expense[Math.floor(Math.random() * categories.expense.length)];
                    const amount = parseFloat((10 + Math.random() * 200).toFixed(2));
                    
                    transactions.push({
                        id: generateId(),
                        type: 'expense',
                        amount: amount,
                        date: new Date(year, month, day).toISOString().split('T')[0],
                        description: expenseCat === 'Food' ? 'Dinner out' : `${expenseCat} expense`,
                        category: expenseCat
                    });
                }
            }
            
            // Add some sample budgets for current month
            categories.expense.forEach(cat => {
                if (Math.random() > 0.3) { // 70% chance to have a budget
                    budgets.push({
                        id: generateId(),
                        category: cat,
                        amount: parseFloat((100 + Math.random() * 500).toFixed(2)),
                        month: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`
                    });
                }
            });
            
            // Update UI
            updateTransactionsUI();
            updateBudgetUI();
            updateSummaryCards();
            renderCharts();
        }

        function setupEventListeners() {
            document.getElementById('transaction-filter').addEventListener('change', updateTransactionsUI);
            document.getElementById('category-filter').addEventListener('change', updateTransactionsUI);
        }

        function setupTabs() {
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove active class from all tabs
                    tabs.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    this.classList.add('active');
                    
                    // Hide all tab contents
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.add('hidden');
                    });
                    
                    // Show the selected tab content
                    const tabId = this.getAttribute('data-tab') + '-tab';
                    document.getElementById(tabId).classList.remove('hidden');
                });
            });
        }

        function renderCharts() {
            // Monthly Expenses Chart
            const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
            if (monthlyChart) monthlyChart.destroy();
            
            const monthlyData = getMonthlyExpenseData();
            monthlyChart = new Chart(monthlyCtx, {
                type: 'bar',
                data: {
                    labels: monthlyData.labels,
                    datasets: [{
                        label: 'Expenses',
                        data: monthlyData.expenses,
                        backgroundColor: 'rgba(239, 68, 68, 0.7)',
                        borderColor: 'rgba(239, 68, 68, 1)',
                        borderWidth: 1
                    }, {
                        label: 'Income',
                        data: monthlyData.income,
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Amount ($)'
                            }
                        }
                    }
                }
            });
            
            // Category Breakdown Chart
            const categoryCtx = document.getElementById('categoryChart').getContext('2d');
            if (categoryChart) categoryChart.destroy();
            
            const categoryData = getCategoryBreakdownData();
            categoryChart = new Chart(categoryCtx, {
                type: 'pie',
                data: {
                    labels: categoryData.labels,
                    datasets: [{
                        data: categoryData.amounts,
                        backgroundColor: [
                            'rgba(239, 68, 68, 0.7)',
                            'rgba(234, 88, 12, 0.7)',
                            'rgba(202, 138, 4, 0.7)',
                            'rgba(22, 163, 74, 0.7)',
                            'rgba(20, 184, 166, 0.7)',
                            'rgba(25, 146, 212, 0.7)',
                            'rgba(67, 56, 202, 0.7)',
                            'rgba(124, 58, 237, 0.7)',
                            'rgba(219, 39, 119, 0.7)',
                            'rgba(180, 83, 9, 0.7)'
                        ],
                        borderColor: [
                            'rgba(239, 68, 68, 1)',
                            'rgba(234, 88, 12, 1)',
                            'rgba(202, 138, 4, 1)',
                            'rgba(22, 163, 74, 1)',
                            'rgba(20, 184, 166, 1)',
                            'rgba(25, 146, 212, 1)',
                            'rgba(67, 56, 202, 1)',
                            'rgba(124, 58, 237, 1)',
                            'rgba(219, 39, 119, 1)',
                            'rgba(180, 83, 9, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                        }
                    }
                }
            });
            
            // Budget vs Actual Chart
            const budgetCtx = document.getElementById('budgetChart').getContext('2d');
            if (budgetChart) budgetChart.destroy();
            
            const budgetData = getBudgetComparisonData();
            if (budgetData.labels.length > 0) {
                budgetChart = new Chart(budgetCtx, {
                    type: 'bar',
                    data: {
                        labels: budgetData.labels,
                        datasets: [{
                            label: 'Budgeted',
                            data: budgetData.budgeted,
                            backgroundColor: 'rgba(96, 165, 250, 0.7)',
                            borderColor: 'rgba(96, 165, 250, 1)',
                            borderWidth: 1
                        }, {
                            label: 'Actual',
                            data: budgetData.actual,
                            backgroundColor: 'rgba(239, 68, 68, 0.7)',
                            borderColor: 'rgba(239, 68, 68, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Amount ($)'
                                }
                            }
                        }
                    }
                });
            } else {
                budgetCtx.font = '16px Arial';
                budgetCtx.fillStyle = '#888';
                budgetCtx.textAlign = 'center';
                budgetCtx.fillText('No budget data available', budgetCtx.canvas.width / 2, budgetCtx.canvas.height / 2);
            }
        }

        function getMonthlyExpenseData() {
            const now = new Date();
            const currentYear = now.getFullYear();
            const months = [];
            const expenses = [];
            const income = [];
            
            // Get data for the last 6 months
            for (let i = 5; i >= 0; i--) {
                const date = new Date(currentYear, now.getMonth() - i, 1);
                const monthName = date.toLocaleString('default', { month: 'short' });
                const year = date.getFullYear();
                months.push(`${monthName} ${year}`);
                
                const month = date.getMonth();
                const yearForFilter = date.getFullYear();
                
                // Filter transactions for this month/year
                const monthlyTransactions = transactions.filter(t => {
                    const tDate = new Date(t.date);
                    return tDate.getMonth() === month && tDate.getFullYear() === yearForFilter;
                });
                
                // Calculate totals
                const totalExpenses = monthlyTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);
                
                const totalIncome = monthlyTransactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0);
                
                expenses.push(parseFloat(totalExpenses.toFixed(2)));
                income.push(parseFloat(totalIncome.toFixed(2)));
            }
            
            return { labels: months, expenses, income };
        }

        function getCategoryBreakdownData() {
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            
            // Filter transactions for current month
            const monthlyTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear && t.type === 'expense';
            });
            
            // Group by category
            const categoryMap = new Map();
            monthlyTransactions.forEach(t => {
                if (!categoryMap.has(t.category)) {
                    categoryMap.set(t.category, 0);
                }
                categoryMap.set(t.category, categoryMap.get(t.category) + t.amount);
            });
            
            // Sort by amount descending
            const sortedCategories = Array.from(categoryMap.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10); // Limit to top 10
            
            return {
                labels: sortedCategories.map(item => item[0]),
                amounts: sortedCategories.map(item => parseFloat(item[1].toFixed(2)))
            };
        }

        function getBudgetComparisonData() {
            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            
            // Filter budgets for current month
            const monthlyBudgets = budgets.filter(b => b.month === currentMonth);
            
            if (monthlyBudgets.length === 0) {
                return { labels: [], budgeted: [], actual: [] };
            }
            
            const labels = [];
            const budgeted = [];
            const actual = [];
            
            monthlyBudgets.forEach(b => {
                labels.push(b.category);
                budgeted.push(b.amount);
                
                // Calculate actual spending for this category in current month
                const actualAmount = transactions
                    .filter(t => {
                        const tDate = new Date(t.date);
                        const tMonth = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
                        return t.category === b.category && t.type === 'expense' && tMonth === currentMonth;
                    })
                    .reduce((sum, t) => sum + t.amount, 0);
                
                actual.push(parseFloat(actualAmount.toFixed(2)));
            });
            
            return { labels, budgeted, actual };
        }

        function updateTransactionsUI() {
            const filterValue = document.getElementById('transaction-filter').value;
            const categoryValue = document.getElementById('category-filter').value;
            
            let filteredTransactions = [...transactions];
            
            // Apply type filter
            if (filterValue !== 'all') {
                filteredTransactions = filteredTransactions.filter(t => t.type === filterValue);
            }
            
            // Apply category filter
            if (categoryValue !== 'all') {
                filteredTransactions = filteredTransactions.filter(t => t.category === categoryValue);
            }
            
            // Sort by date descending
            filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Update recent transactions (show only 5 most recent)
            const recentTable = document.getElementById('recent-transactions');
            recentTable.innerHTML = '';
            
            if (filteredTransactions.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No transactions found.</td>
                `;
                recentTable.appendChild(row);
            } else {
                filteredTransactions.slice(0, 5).forEach(t => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(t.date)}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${t.description || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${t.category}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                            ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button class="text-indigo-600 hover:text-indigo-900 mr-2" onclick="editTransaction('${t.id}')">Edit</button>
                            <button class="text-red-600 hover:text-red-900" onclick="deleteTransaction('${t.id}')">Delete</button>
                        </td>
                    `;
                    recentTable.appendChild(row);
                });
            }
            
            // Update all transactions table
            const allTable = document.getElementById('all-transactions-table');
            allTable.innerHTML = '';
            
            if (filteredTransactions.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No transactions found.</td>
                `;
                allTable.appendChild(row);
            } else {
                filteredTransactions.forEach(t => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(t.date)}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${t.description || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${t.category}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                            ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button class="text-indigo-600 hover:text-indigo-900 mr-2" onclick="editTransaction('${t.id}')">Edit</button>
                            <button class="text-red-600 hover:text-red-900" onclick="deleteTransaction('${t.id}')">Delete</button>
                        </td>
                    `;
                    allTable.appendChild(row);
                });
            }
        }

        function updateBudgetUI() {
            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            
            // Filter budgets for current month
            const monthlyBudgets = budgets.filter(b => b.month === currentMonth);
            
            const budgetTable = document.getElementById('budget-details');
            budgetTable.innerHTML = '';
            
            if (monthlyBudgets.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No budgets set for this month.</td>
                `;
                budgetTable.appendChild(row);
            } else {
                monthlyBudgets.forEach(b => {
                    // Calculate actual spending for this category in current month
                    const actualAmount = transactions
                        .filter(t => {
                            const tDate = new Date(t.date);
                            const tMonth = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
                            return t.category === b.category && t.type === 'expense' && tMonth === currentMonth;
                        })
                        .reduce((sum, t) => sum + t.amount, 0);
                    
                    const remaining = b.amount - actualAmount;
                    const percentage = (actualAmount / b.amount) * 100;
                    let statusClass = 'text-green-600';
                    let statusText = 'Under budget';
                    
                    if (percentage >= 90) {
                        statusClass = 'text-yellow-600';
                        statusText = 'Approaching limit';
                    }
                    if (actualAmount > b.amount) {
                        statusClass = 'text-red-600';
                        statusText = 'Over budget';
                    }
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${b.category}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${b.amount.toFixed(2)}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${actualAmount.toFixed(2)}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}">
                            $${Math.abs(remaining).toFixed(2)} ${remaining >= 0 ? '(Remaining)' : '(Overspent)'}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm ${statusClass}">${statusText}</td>
                    `;
                    budgetTable.appendChild(row);
                });
            }
            
            // Re-render budget chart
            if (budgetChart) {
                budgetChart.destroy();
            }
            renderCharts();
        }

        function updateSummaryCards() {
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            
            // Filter transactions for current month
            const monthlyTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
            });
            
            // Calculate totals
            const totalExpenses = monthlyTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const totalIncome = monthlyTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const totalBalance = totalIncome - totalExpenses;
            
            // Update cards
            document.getElementById('total-balance').textContent = `$${totalBalance.toFixed(2)}`;
            document.getElementById('total-balance').className = `text-3xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`;
            document.getElementById('total-income').textContent = `$${totalIncome.toFixed(2)}`;
            document.getElementById('total-expense').textContent = `$${totalExpenses.toFixed(2)}`;
            
            // Update transaction count descriptions
            const expenseCount = monthlyTransactions.filter(t => t.type === 'expense').length;
            const incomeCount = monthlyTransactions.filter(t => t.type === 'income').length;
            
            document.querySelector('#total-income ~ p').textContent = 
                `${incomeCount} income transaction${incomeCount !== 1 ? 's' : ''}`;
            document.querySelector('#total-expense ~ p').textContent = 
                `${expenseCount} expense transaction${expenseCount !== 1 ? 's' : ''}`;
            document.querySelector('#total-balance ~ p').textContent = 
                `Balance is ${totalBalance >= 0 ? 'positive' : 'negative'} this month`;
        }

        function showAddTransactionModal() {
            document.getElementById('transaction-id').value = '';
            document.getElementById('transaction-type').value = 'expense';
            document.getElementById('transaction-amount').value = '';
            document.getElementById('transaction-date').value = new Date().toISOString().split('T')[0];
            document.getElementById('transaction-description').value = '';
            document.getElementById('transaction-category').value = categories.expense[0];
            document.getElementById('modal-title').textContent = 'Add Transaction';
            
            showModal('transaction-modal');
        }

        function editTransaction(id) {
            const transaction = transactions.find(t => t.id === id);
            if (transaction) {
                document.getElementById('transaction-id').value = transaction.id;
                document.getElementById('transaction-type').value = transaction.type;
                document.getElementById('transaction-amount').value = transaction.amount;
                document.getElementById('transaction-date').value = transaction.date;
                document.getElementById('transaction-description').value = transaction.description || '';
                document.getElementById('transaction-category').value = transaction.category;
                document.getElementById('modal-title').textContent = 'Edit Transaction';
                
                showModal('transaction-modal');
            }
        }

        function saveTransaction() {
            // Validate form
            const amount = parseFloat(document.getElementById('transaction-amount').value);
            const date = document.getElementById('transaction-date').value;
            
            let isValid = true;
            
            if (isNaN(amount) || amount <= 0) {
                document.getElementById('amount-error').classList.remove('hidden');
                isValid = false;
            } else {
                document.getElementById('amount-error').classList.add('hidden');
            }
            
            if (!date) {
                document.getElementById('date-error').classList.remove('hidden');
                isValid = false;
            } else {
                document.getElementById('date-error').classList.add('hidden');
            }
            
            if (!isValid) return;
            
            const id = document.getElementById('transaction-id').value;
            const type = document.getElementById('transaction-type').value;
            const description = document.getElementById('transaction-description').value;
            const category = document.getElementById('transaction-category').value;
            
            if (id) {
                // Update existing transaction
                const index = transactions.findIndex(t => t.id === id);
                if (index !== -1) {
                    transactions[index] = {
                        id,
                        type,
                        amount,
                        date,
                        description,
                        category
                    };
                }
                showAlert('Transaction updated successfully!', 'success');
            } else {
                // Add new transaction
                transactions.push({
                    id: generateId(),
                    type,
                    amount,
                    date,
                    description,
                    category
                });
                showAlert('Transaction added successfully!', 'success');
            }
            
            // Update UI
            hideModal('transaction-modal');
            updateTransactionsUI();
            updateSummaryCards();
            renderCharts();
        }

        function deleteTransaction(id) {
            if (confirm('Are you sure you want to delete this transaction?')) {
                transactions = transactions.filter(t => t.id !== id);
                showAlert('Transaction deleted successfully!', 'success');
                updateTransactionsUI();
                updateSummaryCards();
                renderCharts();
            }
        }

        function showAddBudgetModal() {
            document.getElementById('budget-id').value = '';
            document.getElementById('budget-category').value = categories.expense[0];
            document.getElementById('budget-amount').value = '';
            
            const now = new Date();
            document.getElementById('budget-month').value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            
            showModal('budget-modal');
        }

        function saveBudget() {
            // Validate form
            const amount = parseFloat(document.getElementById('budget-amount').value);
            const month = document.getElementById('budget-month').value;
            
            let isValid = true;
            
            if (isNaN(amount) || amount <= 0) {
                document.getElementById('budget-amount-error').classList.remove('hidden');
                isValid = false;
            } else {
                document.getElementById('budget-amount-error').classList.add('hidden');
            }
            
            if (!month) {
                document.getElementById('budget-month-error').classList.remove('hidden');
                isValid = false;
            } else {
                document.getElementById('budget-month-error').classList.add('hidden');
            }
            
            if (!isValid) return;
            
            const id = document.getElementById('budget-id').value;
            const category = document.getElementById('budget-category').value;
            
            if (id) {
                // Update existing budget
                const index = budgets.findIndex(b => b.id === id);
                if (index !== -1) {
                    budgets[index] = {
                        id,
                        category,
                        amount,
                        month
                    };
                }
                showAlert('Budget updated successfully!', 'success');
            } else {
                // Check if budget already exists for this category and month
                const existingIndex = budgets.findIndex(b => 
                    b.category === category && b.month === month
                );
                
                if (existingIndex !== -1) {
                    showAlert('Budget already exists for this category and month. Editing instead.', 'warning');
                    budgets[existingIndex] = {
                        id: budgets[existingIndex].id,
                        category,
                        amount,
                        month
                    };
                } else {
                    // Add new budget
                    budgets.push({
                        id: generateId(),
                        category,
                        amount,
                        month
                    });
                    showAlert('Budget added successfully!', 'success');
                }
            }
            
            // Update UI
            hideModal('budget-modal');
            updateBudgetUI();
        }

        function exportTransactions() {
            const filterValue = document.getElementById('transaction-filter').value;
            const categoryValue = document.getElementById('category-filter').value;
            
            let filteredTransactions = [...transactions];
            
            // Apply type filter
            if (filterValue !== 'all') {
                filteredTransactions = filteredTransactions.filter(t => t.type === filterValue);
            }
            
            // Apply category filter
            if (categoryValue !== 'all') {
                filteredTransactions = filteredTransactions.filter(t => t.category === categoryValue);
            }
            
            // Sort by date descending
            filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Convert to CSV
            const headers = ['Type', 'Date', 'Description', 'Category', 'Amount'];
            const rows = filteredTransactions.map(t => [
                t.type.charAt(0).toUpperCase() + t.type.slice(1), // Capitalize first letter
                t.date,
                t.description || '',
                t.category,
                t.type === 'income' ? t.amount : -t.amount
            ]);
            
            let csvContent = headers.join(',') + '\n';
            rows.forEach(row => {
                csvContent += row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',') + '\n';
            });
            
            // Download CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showAlert('Transactions exported to CSV!', 'success');
        }

        function showModal(modalId) {
            document.getElementById(modalId).classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        }

        function hideModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }

        function showAlert(message, type = 'info') {
            const alertContainer = document.getElementById('alert-container');
            
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert p-4 rounded-md shadow-md ${
                type === 'success' ? 'bg-green-100 text-green-800' :
                type === 'error' ? 'bg-red-100 text-red-800' :
                type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
            }`;
            
            alertDiv.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>${message}</div>
                    <button class="text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;
            
            alertContainer.appendChild(alertDiv);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.classList.add('opacity-0', 'transition-opacity', 'duration-300');
                    setTimeout(() => {
                        if (alertDiv.parentNode) {
                            alertDiv.remove();
                        }
                    }, 300);
                }
            }, 5000);
        }

        function generateId() {
            return '_' + Math.random().toString(36).substr(2, 9);
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import { ArrowLeft, Calendar, TrendingUp, DollarSign, PieChart as PieChartIcon, BarChart3 } from "lucide-react";

function Reports() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalSpent, setTotalSpent] = useState(0);

  const COLORS = [
    '#0ea5e9',
    '#06b6d4',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#ef4444',
    '#6366f1',
  ];

  useEffect(() => {
    fetchExpenses();
  }, [selectedMonth, selectedYear]);

  async function fetchExpenses() {
    setLoading(true);
    try {
      const startDate = new Date(selectedYear, selectedMonth, 1);
      const endDate = new Date(selectedYear, selectedMonth + 1, 0);

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      setExpenses(data || []);
      processChartData(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  }

  function processChartData(expenseList) {
    const categoryMap = {};
    let total = 0;

    expenseList.forEach(expense => {
      const category = expense.category || 'Uncategorized';
      const amount = parseFloat(expense.amount) || 0;
      
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += amount;
      total += amount;
    });

    const categoryArray = Object.keys(categoryMap).map(category => ({
      name: category,
      value: categoryMap[category],
      percentage: total > 0 ? ((categoryMap[category] / total) * 100).toFixed(1) : 0
    })).sort((a, b) => b.value - a.value);

    setCategoryData(categoryArray);
    setTotalSpent(total);

    const dailyMap = {};
    expenseList.forEach(expense => {
      const day = new Date(expense.date).getDate();
      if (!dailyMap[day]) {
        dailyMap[day] = 0;
      }
      dailyMap[day] += parseFloat(expense.amount) || 0;
    });

    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const dailyArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      dailyArray.push({
        day: i,
        amount: dailyMap[i] || 0
      });
    }

    setMonthlyData(dailyArray);
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Reports & Analytics</h1>
              <p className="text-zinc-400 mt-1">Visualize your spending patterns</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-sky-500/10 rounded-lg">
                    <DollarSign className="w-6 h-6 text-sky-500" />
                  </div>
                  <h3 className="text-zinc-400 text-sm font-medium">Total Spent</h3>
                </div>
                <p className="text-3xl font-bold">${totalSpent.toFixed(2)}</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="text-zinc-400 text-sm font-medium">Transactions</h3>
                </div>
                <p className="text-3xl font-bold">{expenses.length}</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-pink-500/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-pink-500" />
                  </div>
                  <h3 className="text-zinc-400 text-sm font-medium">Avg per Day</h3>
                </div>
                <p className="text-3xl font-bold">
                  ${expenses.length > 0 ? (totalSpent / new Date(selectedYear, selectedMonth + 1, 0).getDate()).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-sky-500" />
                  <h2 className="text-xl font-bold">Spending by Category</h2>
                </div>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                      <XAxis 
                        dataKey="name" 
                        stroke="#71717a"
                        tick={{ fill: '#a1a1aa' }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        stroke="#71717a"
                        tick={{ fill: '#a1a1aa' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181b',
                          border: '1px solid #27272a',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value) => `$${value.toFixed(2)}`}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-zinc-500">
                    No expenses found for this period
                  </div>
                )}
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <PieChartIcon className="w-6 h-6 text-sky-500" />
                  <h2 className="text-xl font-bold">Category Distribution</h2>
                </div>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181b',
                          border: '1px solid #27272a',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value) => `$${value.toFixed(2)}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-zinc-500">
                    No data to display
                  </div>
                )}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-sky-500" />
                <h2 className="text-xl font-bold">Daily Spending Trend</h2>
              </div>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <XAxis 
                      dataKey="day" 
                      stroke="#71717a"
                      tick={{ fill: '#a1a1aa' }}
                    />
                    <YAxis 
                      stroke="#71717a"
                      tick={{ fill: '#a1a1aa' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid #27272a',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value) => `$${value.toFixed(2)}`}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-zinc-500">
                  No daily data available
                </div>
              )}
            </div>

            {categoryData.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mt-6">
                <h2 className="text-xl font-bold mb-4">Category Breakdown</h2>
                <div className="space-y-3">
                  {categoryData.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-400">{category.percentage}%</span>
                        <span className="font-bold text-sky-500">${category.value.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Loader2, DollarSign, TrendingDown, Wallet, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [budget, setBudget] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setUser(user);
    await loadDashboardData(user.id);
  }

  async function loadDashboardData(userId) {
    setLoading(true);
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: expenses, error: expensesError } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", startOfMonth.toISOString())
        .order("created_at", { ascending: false });

      if (expensesError) throw expensesError;

      const monthTotal = expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;
      setTotalSpent(monthTotal);
      setRecentTransactions(expenses?.slice(0, 5) || []);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("monthly_budget")
        .eq("id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile error:", profileError);
      }

      const userBudget = profile?.monthly_budget || 0;
      setBudget(userBudget);
      setRemaining(userBudget - monthTotal);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Your financial overview for this month</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Total Spent</span>
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-white">
              {formatCurrency(totalSpent)}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Monthly Budget</span>
              <DollarSign className="w-5 h-5 text-sky-500" />
            </div>
            <div className="text-3xl font-bold text-white">
              {formatCurrency(budget)}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm font-medium">Remaining</span>
              <Wallet className="w-5 h-5 text-green-500" />
            </div>
            <div className={`text-3xl font-bold ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(remaining)}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
            <button
              onClick={() => navigate("/expenses")}
              className="text-sky-500 hover:text-sky-400 text-sm font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No transactions yet this month</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {transaction.description || transaction.category || "Expense"}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-red-400">
                      -{formatCurrency(transaction.amount)}
                    </p>
                    {transaction.category && (
                      <p className="text-xs text-gray-500 mt-1">
                        {transaction.category}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, DollarSign, Tag, FileText, Calendar, Plus } from "lucide-react";

export default function AddExpense() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    note: "",
    date: new Date().toISOString().split("T")[0]
  });

  const categories = ["Food", "Transport", "Housing", "Other"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData?.user) {
        setError("You must be logged in to add expenses");
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("expenses")
        .insert([
          {
            user_id: userData.user.id,
            amount: parseFloat(formData.amount),
            category: formData.category,
            note: formData.note,
            date: formData.date
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Error adding expense:", err);
      setError(err.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold">Add Expense</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="space-y-5">
              <div>
                <label htmlFor="amount" className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                  <DollarSign className="w-4 h-4 text-[#0ea5e9]" />
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="category" className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                  <Tag className="w-4 h-4 text-[#0ea5e9]" />
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-gray-800">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-[#0ea5e9]" />
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="note" className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                  <FileText className="w-4 h-4 text-[#0ea5e9]" />
                  Note (optional)
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add a description..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add Expense
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
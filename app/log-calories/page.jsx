"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient"; // Adjust path if needed

export default function LogCaloriesPage() {
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (data?.user) {
        setCurrentUser(data.user);
        console.log("Current user:", data.user);
      } else {
        setCurrentUser(null);
        console.log("Not logged in:", error);
      }
    });
  }, []);

  // Form states
  const [mealType, setMealType] = useState("");
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (!currentUser) {
      alert("Please log in to log your meal.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("meals").insert([
      {
        user_id: currentUser.id,
        date: date || new Date().toISOString().split("T")[0],
        meal_type: mealType,
        food,
        calories: calories ? Number(calories) : null,
        protein: protein ? Number(protein) : null,
        carbs: carbs ? Number(carbs) : null,
        fat: fat ? Number(fat) : null,
        notes,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error logging meal: " + error.message);
    } else {
      alert("Meal logged successfully!");
      setMealType("");
      setFood("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
      setDate("");
      setNotes("");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <div className="mb-4">
        {currentUser ? (
          <span className="text-green-600 font-semibold">
            Logged in as: {currentUser.email}
          </span>
        ) : (
          <span className="text-red-600 font-semibold">
            Not logged in
          </span>
        )}
      </div>
      <h2 className="text-2xl font-bold mb-4">Log Calories / Meal</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          placeholder="Meal Type (breakfast, lunch, dinner, snack)"
          value={mealType}
          onChange={e => setMealType(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          placeholder="Food"
          value={food}
          onChange={e => setFood(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          placeholder="Calories"
          type="number"
          value={calories}
          onChange={e => setCalories(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          placeholder="Protein (g)"
          type="number"
          value={protein}
          onChange={e => setProtein(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Carbs (g)"
          type="number"
          value={carbs}
          onChange={e => setCarbs(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Fat (g)"
          type="number"
          value={fat}
          onChange={e => setFat(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold"
        >
          {loading ? "Logging..." : "Log Meal"}
        </button>
      </form>
    </div>
  );
}
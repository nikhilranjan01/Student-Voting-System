import React, { useState } from "react";
import { toast } from "react-toastify";

function AdminNomineeForm({ token, setNominees }) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("president");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/nominees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ name, position }),
      });

      if (!res.ok) throw new Error("Failed to add nominee");

      const newNominee = await res.json();
      setNominees((prev) => [...prev, newNominee]);
      setName("");

      toast.success("Nominee added successfully!");
    } catch (error) {
      console.error("Add nominee error:", error);
      toast.error("Failed to add nominee.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200 mb-10">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        Add New Nominee
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Candidate Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Candidate Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter candidate name"
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            disabled={isLoading}
            required
          />
        </div>

        {/* Position */}
        <div>
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Position
          </label>
          <select
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            disabled={isLoading}
          >
            <option value="president">President</option>
            <option value="vice-president">Vice President</option>
            <option value="secretary">Secretary</option>
            <option value="treasurer">Treasurer</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 rounded-lg text-white bg-green-600 hover:bg-green-700 active:scale-95 transition font-semibold shadow-md disabled:bg-green-400 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 mx-auto text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 
                0 0 5.373 0 12h4zm2 5.291A7.962 
                7.962 0 014 12H0c0 3.042 1.135 
                5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            "Add Nominee"
          )}
        </button>
      </form>
    </div>
  );
}

export default AdminNomineeForm;

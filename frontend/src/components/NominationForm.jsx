import React, { useState } from "react";
import { toast } from "react-toastify";

function NominationForm({ token, setNominees }) {
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
      if (!res.ok) throw new Error("Failed to submit nomination");
      const newNominee = await res.json();

      setNominees((prev) => {
        const exists = prev.find((n) => n._id === newNominee._id);
        if (exists) {
          return prev.map((n) => (n._id === newNominee._id ? newNominee : n));
        }
        return [...prev, newNominee];
      });

      setName("");
      toast.success("Nomination submitted successfully!");
    } catch (error) {
      console.error("Nomination error:", error);
      toast.error("Failed to submit nomination.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-10">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Nominate a Candidate
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Candidate Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter candidate name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <select
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={isLoading}
          >
            <option value="president">President</option>
            <option value="vice-president">Vice President</option>
            <option value="secretary">Secretary</option>
            <option value="treasurer">Treasurer</option>
          </select>
        </div>
        <button
          type="submit"
          className={`w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition disabled:bg-green-400 ${isLoading ? "cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit Nomination"}
        </button>
      </form>
    </div>
  );
}

export default NominationForm;

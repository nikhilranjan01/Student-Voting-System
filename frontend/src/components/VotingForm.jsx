import React, { useState } from "react";
import { toast } from "react-toastify";

function VotingForm({ token, nominees, setNominees }) {
  const [votes, setVotes] = useState({
    president: "",
    "vice-president": "",
    secretary: "",
    treasurer: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async () => {
    setIsLoading(true);
    try {
      const hasVotes = Object.values(votes).some((nomineeId) => nomineeId);
      if (!hasVotes) {
        throw new Error("Please select at least one candidate.");
      }

      for (const [position, nomineeId] of Object.entries(votes)) {
        if (!nomineeId) continue;

        const res = await fetch(
          `https://voting-system-zcs7.onrender.com/api/votes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
            body: JSON.stringify({ nomineeId, position }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          // Handle "already voted for this position"
          throw new Error(data.msg || "Failed to submit vote");
        }

        // Update nominees state with updated vote count
        setNominees((prev) =>
          prev.map((n) => (n._id === data._id ? data : n))
        );
      }

      toast.success("Votes submitted successfully!");
    } catch (error) {
      console.error("Voting error:", error);
      toast.error(error.message || "Failed to submit votes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Cast Your Vote
      </h3>
      {["president", "vice-president", "secretary", "treasurer"].map(
        (position) => (
          <div key={position} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {position.replace("-", " ").toUpperCase()}
            </label>
            <select
              value={votes[position]}
              onChange={(e) =>
                setVotes({ ...votes, [position]: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              <option value="">Select Candidate</option>
              {nominees
                .filter((n) => n.position === position)
                .map((n) => (
                  <option key={n._id} value={n._id}>
                    {n.name} ({n.votes || 0} votes)
                  </option>
                ))}
            </select>
          </div>
        )
      )}
      <button
        onClick={handleVote}
        className={`w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 ${
          isLoading ? "cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Submit Votes"}
      </button>
    </div>
  );
}

export default VotingForm;

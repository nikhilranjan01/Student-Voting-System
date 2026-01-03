import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [nominees, setNominees] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect user if token missing
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch nominees
  useEffect(() => {
    const fetchNominees = async () => {
      try {
        const response = await axios.get("https://voting-system-zcs7.onrender.com/api/nominees", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });
        setNominees(response.data);
      } catch (err) {
        setError("Failed to load nominees.");
      }
    };
    fetchNominees();
  }, []);

  // Handle vote
  const handleVote = async (nomineeId, position) => {
    try {
      await axios.post(
        "https://voting-system-zcs7.onrender.com/api/votes",
        { nomineeId, position },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      alert("Vote cast successfully!");
    } catch (err) {
      setError(err.response?.data?.msg || "Voting failed.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-start py-10"
      style={{ backgroundImage: "url('/images/background.jpeg')" }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <h2 className="text-3xl font-bold text-white drop-shadow mb-6">
          Student Dashboard
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 bg-white/70 p-3 rounded mb-4 w-fit px-5 shadow">
            {error}
          </p>
        )}

        {/* Nominee List */}
        {nominees.length === 0 ? (
          <p className="text-white text-lg bg-black/40 p-4 w-fit rounded">
            No nominees available for voting.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nominees.map((nominee) => (
              <div
                key={nominee._id}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-gray-300 hover:shadow-2xl transition"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {nominee.name}
                </h3>

                <p className="mt-1 text-gray-600">
                  <strong className="text-gray-800">Position:</strong>{" "}
                  {nominee.position}
                </p>

                <button
                  onClick={() =>
                    handleVote(nominee._id, nominee.position)
                  }
                  className="mt-4 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 active:scale-95 transition font-medium shadow-md"
                >
                  Vote
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminDashboard = () => {
  const [results, setResults] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [nomineeName, setNomineeName] = useState("");
  const [position, setPosition] = useState("president");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔐 Check token validity
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  // 📊 Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          "https://voting-system-zcs7.onrender.com/api/votes/results",
          { headers: { "x-auth-token": localStorage.getItem("token") } }
        );
        setResults(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load results.");
      }
    };
    fetchResults();
  }, []);

  // 👤 Fetch nominees
  useEffect(() => {
    const fetchNominees = async () => {
      try {
        const response = await axios.get("https://voting-system-zcs7.onrender.com/api/nominees", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });
        setNominees(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load nominees.");
      }
    };
    fetchNominees();
  }, []);

  // ➕ Add nominee
  const addNominee = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://voting-system-zcs7.onrender.com/api/nominees",
        { name: nomineeName, position },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setNominees([...nominees, response.data]);
      setNomineeName("");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add nominee.");
    }
  };

  // ❌ Delete nominee
  const deleteNominee = async (id) => {
    try {
      await axios.delete(`https://voting-system-zcs7.onrender.com/api/nominees/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setNominees(nominees.filter((nominee) => nominee._id !== id));
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete nominee.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center pt-24"
      style={{ backgroundImage: "url('/images/background.jpeg')" }}
    >
      <div className="backdrop-blur-md bg-white bg-opacity-70 max-w-5xl mx-auto p-6 rounded-2xl shadow-xl">

        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          Admin Dashboard
        </h2>

        {error && (
          <p className="text-center text-red-500 bg-red-100 p-2 rounded mb-4">
            {error}
          </p>
        )}

        {/* Add Nominee */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Add Nominee
          </h3>

          <form onSubmit={addNominee} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={nomineeName}
              onChange={(e) => setNomineeName(e.target.value)}
              placeholder="Nominee Name"
              className="flex-1 p-3 border rounded-lg focus:ring focus:ring-indigo-300"
              required
            />

            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            >
              <option value="president">President</option>
              <option value="vice-president">Vice-President</option>
              <option value="secretary">Secretary</option>
              <option value="treasurer">Treasurer</option>
            </select>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg transition"
            >
              Add
            </button>
          </form>
        </div>

        {/* Nominees List */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Nominees List
          </h3>

          {nominees.length === 0 ? (
            <p className="text-gray-600">No nominees added yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {nominees.map((nominee) => (
                <div
                  key={nominee._id}
                  className="p-4 border rounded-lg shadow-sm bg-white"
                >
                  <p className="font-semibold text-lg">{nominee.name}</p>
                  <p className="text-gray-700 capitalize">
                    Position: {nominee.position}
                  </p>

                  <button
                    onClick={() => deleteNominee(nominee._id)}
                    className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Election Results
          </h3>

          {results.length === 0 ? (
            <p className="text-gray-600">No votes cast yet.</p>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result._id.nomineeId}
                  className="p-4 border rounded-lg bg-gray-50 shadow-sm"
                >
                  <p>
                    <strong>Nominee:</strong> {result.nominee.name}
                  </p>
                  <p>
                    <strong>Position:</strong> {result._id.position}
                  </p>
                  <p>
                    <strong>Votes:</strong> {result.count}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

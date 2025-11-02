

import React, { useState, useEffect } from "react";
import axios from "axios";

const GetAllsellers = () => {
  const [sellers, setsellers] = useState([]);
  const [buyers, setbuyers] = useState([]);
  const [users , setusers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchsellers();
    fetchbuyers();
    fethusers();
  }, []);

  const fetchsellers = async () => {
    try {
      const response = await axios.get("/api/sellers");
      setsellers(response.data.data);
    } catch (err) {
      setError("err ayaa jiro, fadlan isku day mar kale.");
      console.error("Error fetching sellers:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchbuyers = async () => {
    try {
      const response = await axios.get("/api/buyers");
      setbuyers(response.data.data);
    } catch (err) {
      console.error("Error fetching buyers:", err);
    }
  };
  const fethusers = async () => {
    try {
      const response = await axios.get("/api/user"); 
      setusers(response.data.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Wax Yar Sug...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Khalad</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchsellers}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Isku day mar kale
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Share Summary</h1>
           
          </div>
        </div>
                {/* Summary */}
        {sellers.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">All Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">All Shares</p>
                <p className="text-2xl font-bold text-gray-900">{sellers.length}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">All Buyers</p>
                <p className="text-2xl font-bold text-gray-900">{buyers.length}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 mb-2"> shares</p>
                <p className="text-2xl font-bold text-blue-700">
                  {sellers.reduce((sum, seller) => sum + seller.samiga, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 mb-2">Total Value</p>
                <p className="text-2xl font-bold text-green-700">
                  ${sellers.reduce((sum, seller) => sum + seller.value, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* sellers List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {sellers.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <div className="text-5xl mb-4">📝</div>
              <p>emty</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                   Campany Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                     Rate
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Share
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Value
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((seller) => (
                    <tr 
                      key={seller._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {seller.fullname}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 ">
                          {seller.rate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-blue-600 text-base">
                          {seller.samiga.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-green-600 text-base">
                          ${seller.value.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-500 text-sm">
                          {new Date(seller.createdAt).toLocaleDateString('so-SO')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default GetAllsellers;
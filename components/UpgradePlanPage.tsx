"use client";
import { useState } from "react";

export function UpgradeConfirmedPage() {
  const [promoCode, setPromoCode] = useState("");
  const [message, setMessage] = useState("");

  const handleUpgrade = async () => {
    const response = await fetch("/api/upgrade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ promoCode }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(data.message);

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Upgrade Plan</h2>
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={handleUpgrade}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Upgrade
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}

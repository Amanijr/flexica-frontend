"use client";

import { useState, useEffect } from "react";

export default function DevTestControls() {
  const [forceInsufficient, setForceInsufficient] = useState(false);

  useEffect(() => {
    setForceInsufficient(localStorage.getItem("TEST_FORCE_INSUFFICIENT_STOCK") === "1");
  }, []);

  const toggle = () => {
    const next = !forceInsufficient;
    setForceInsufficient(next);
    if (next) localStorage.setItem("TEST_FORCE_INSUFFICIENT_STOCK", "1");
    else localStorage.removeItem("TEST_FORCE_INSUFFICIENT_STOCK");
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Developer Test Controls</h2>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={forceInsufficient} onChange={toggle} />
          <span>Force insufficient-stock on placeOrder()</span>
        </label>
      </div>
      <p className="text-sm text-gray-500 mt-3">This page is for local testing only.</p>
    </div>
  );
}

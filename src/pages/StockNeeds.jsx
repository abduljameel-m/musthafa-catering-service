import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StockCard from "../components/StockCard";
import { getFromStorage, saveToStorage } from "../services/storageService";

function StockNeeds() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    setStocks(getFromStorage("stocks", []));
  }, []);

  const updateStocks = (updatedStocks) => {
    setStocks(updatedStocks);
    saveToStorage("stocks", updatedStocks);
  };

  const handleIncrease = (id) => {
    const updatedStocks = stocks.map((stock) =>
      stock.id === id ? { ...stock, quantity: stock.quantity + 1 } : stock
    );

    updateStocks(updatedStocks);
  };

  const handleDecrease = (id) => {
    const updatedStocks = stocks.map((stock) =>
      stock.id === id
        ? { ...stock, quantity: Math.max(0, stock.quantity - 1) }
        : stock
    );

    updateStocks(updatedStocks);
  };

  return (
    <Layout role="employee">
      <div className="page-header">
        <div>
          <p className="eyebrow">Employee</p>
          <h1>Shop Needs</h1>
          <p>Increase or decrease daily shop stock needs clearly.</p>
        </div>
      </div>

      <div className="stock-grid">
        {stocks.map((stock) => (
          <StockCard
            key={stock.id}
            stock={stock}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
        ))}
      </div>
    </Layout>
  );
}

export default StockNeeds;
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StockCard from "../components/StockCard";
import { getFromStorage } from "../services/storageService";

function StockOverview() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    setStocks(getFromStorage("stocks", []));
  }, []);

  return (
    <Layout role="admin">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Stock Overview</h1>
          <p>View all stock counts updated by employees.</p>
        </div>
      </div>

      <div className="stock-grid">
        {stocks.map((stock) => (
          <StockCard key={stock.id} stock={stock} readonly />
        ))}
      </div>
    </Layout>
  );
}

export default StockOverview;
import { Minus, Plus } from "lucide-react";

function StockCard({ stock, onIncrease, onDecrease, readonly = false }) {
  const isLowStock = stock.quantity < 5;

  return (
    <div className="stock-card">
      <div>
        <h3>{stock.name}</h3>
        <p>Current stock</p>
      </div>

      <div className="stock-count-row">
        {!readonly && (
          <button className="count-button" onClick={() => onDecrease(stock.id)}>
            <Minus size={16} />
          </button>
        )}

        <strong className={isLowStock ? "low-stock-text" : ""}>
          {stock.quantity}
        </strong>

        {!readonly && (
          <button className="count-button" onClick={() => onIncrease(stock.id)}>
            <Plus size={16} />
          </button>
        )}
      </div>

      {isLowStock && <span className="status-badge danger">Low Stock</span>}
    </div>
  );
}

export default StockCard;
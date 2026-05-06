function SummaryCard({ title, value, icon: Icon, type = "purple" }) {
  return (
    <div className={`summary-card ${type}`}>
      <div className="summary-icon">{Icon && <Icon size={22} />}</div>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

export default SummaryCard;
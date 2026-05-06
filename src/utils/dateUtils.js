export const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

export const isLeaveDateValid = (selectedDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const leaveDate = new Date(selectedDate);
  leaveDate.setHours(0, 0, 0, 0);

  const differenceInTime = leaveDate.getTime() - today.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  return differenceInDays >= 2;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
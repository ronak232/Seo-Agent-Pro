export const getScoreStatus = (score:number) => {
  if (score >= 80)
    return { color: "text-green-600", bg: "bg-green-100", status: "Excellent" };
  if (score >= 60)
    return { color: "text-yellow-600", bg: "bg-yellow-100", status: "Good" };
  return {
    color: "text-red-600",
    bg: "bg-red-100",
    status: "Needs Improvement",
  };
};

export const formatDate = (value) => {
  if (!value) return "Unknown date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatRole = (role) => {
  if (!role) return "";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export const initialsFor = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export const scoreColor = (score) => {
  const numericScore = Number(score) || 0;
  if (numericScore >= 80) return "#22C55E";
  if (numericScore >= 60) return "#F59E0B";
  return "#EF4444";
};

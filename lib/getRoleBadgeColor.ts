export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-red-100 text-red-800 border border-red-500";
    case "EDITOR":
      return "bg-blue-100 text-blue-800 border border-blue-500";
    case "VIEWER":
      return "bg-gray-100 text-gray-800 border border-gray-500";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-500";
  }
};

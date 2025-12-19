export type Role = "ADMIN" | "EDITOR" | "VIEWER";
export type Permission = "CREATE" | "EDIT" | "DELETE" | "VIEW";

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  ADMIN: ["CREATE", "EDIT", "DELETE", "VIEW"],
  EDITOR: ["CREATE", "EDIT", "VIEW"],
  VIEWER: ["VIEW"],
};

import { Permission, Role, ROLE_PERMISSIONS } from "./roles";

export function hasPermission(role: Role, permission: Permission) {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function requirePermission(role: Role, permission: Permission) {
  if (!hasPermission(role, permission)) {
    throw new Error("Unauthorized");
  }
}

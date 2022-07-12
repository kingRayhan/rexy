export enum UserRolePermissions {
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
}

export enum AdminRolePermissions {
  ADMINISTRATOR = 'ADMINISTRATOR',
  MANAGE_ROLE_AND_PERMISSION = 'MANAGE_ROLE_AND_PERMISSION',
}

export const Permission = {
  ...UserRolePermissions,
  ...AdminRolePermissions,
};

export type Permission = keyof typeof Permission;

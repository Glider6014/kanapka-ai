export enum UserPermissions {
  readRecipes = 'read:recipes',
  readUsers = 'read:users',
  writeRecipes = 'write:recipes',
  writeUsers = 'write:users',
  deleteUsers = 'delete:users',
}

export const userPermissionsList = Object.values(UserPermissions);

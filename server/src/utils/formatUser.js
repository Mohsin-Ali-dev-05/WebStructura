/**
 * Public user payload shared by auth and profile endpoints.
 */
export function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

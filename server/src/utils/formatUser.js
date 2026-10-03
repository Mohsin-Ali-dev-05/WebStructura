/**
 * Public user payload shared by auth and profile endpoints.
 */
export function formatUser(user) {
  const plain =
    user && typeof user.toObject === 'function'
      ? user.toObject()
      : user || {};

  const passwordLoaded = Object.prototype.hasOwnProperty.call(
    plain,
    'passwordHash',
  );

  return {
    id: plain._id,
    name: plain.name,
    email: plain.email,
    avatarUrl: plain.avatarUrl || null,
    googleLinked: Boolean(plain.googleId),
    // When passwordHash was not selected, infer from Google linkage.
    hasPassword: passwordLoaded
      ? Boolean(plain.passwordHash)
      : !plain.googleId,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

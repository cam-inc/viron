package auth

/*
// Emailアドレスでサインイン
export const signinEmail = async (
  email: string,
  password: string
): Promise<string> => {
  let adminUser = await findOneByEmail(email);
  if (!adminUser) {
    const firstAdminUser = await createFirstAdminUser(
      { email, password },
      AUTH_TYPE.EMAIL
    );
    if (!firstAdminUser) {
      throw signinFailed();
    }
    adminUser = firstAdminUser;
  }

  if (
    adminUser.authType !== AUTH_TYPE.EMAIL ||
    !verifyPassword(
      password,
      adminUser.password as string,
      adminUser.salt as string
    )
  ) {
    throw signinFailed();
  }

  return signJwt(adminUser.id);
};
*/

'use server';

// accountId	来自 Appwrite 的 userId，是注册后用户在 Auth 系统中的唯一标识符
// OTP（邮箱登录）	安全、用户友好，不用密码，让用户点一下邮件链接即可完成登录

import { ID, Query } from 'node-appwrite';
import { appwriteConfig } from '../appwrite/config';
import { createAdminClient, createSessionClient } from '../appwrite';
import { parseStringify } from '../utils';
import { cookies } from 'next/headers';
import { avatarPlaceholderUrl } from '@/constants';
import { redirect } from 'next/navigation';

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal('email', [email])],
  );
  return result.total > 0 ? result.documents[0] : null;
};
const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

// appwrite给发一个email一次性登录的OTP
export const sendEmailOTP = async (email: string) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, 'Failed to send email OTP');
  }
};

// sign up function
export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: 'User existed,redirect to sign-in' };
  }
  const accountId = await sendEmailOTP(email);

  if (!accountId) throw new Error('Failed to send OTP');

  // create one
  const { databases } = await createAdminClient();
  await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    ID.unique(),
    {
      fullName,
      email,
      avatar: avatarPlaceholderUrl,
      accountId,
    },
  );
  return parseStringify({ accountId });
};

// 用账号ID + OTP（一次性密码）尝试登录，看是否成功 → 成功就发放 session（登录凭证）
export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);

    //  将会话的 secret（凭证）存入浏览器的 cookie，配置了一些安全选项
    (await cookies()).set('appwrite-session', session.secret, {
      path: '/', // cookie 在根路径有效
      httpOnly: true, // 只能被服务器访问，前端 JS 无法访问，防止 XSS
      sameSite: 'strict', // 防止跨站请求伪造 CSRF
      secure: true, // 仅在 HTTPS 连接下传输 cookie
    });
    //  返回一个清理过的对象，只含 sessionId，避免传递复杂对象
    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, 'Failed to verify OTP');
  }
};
// 提取session的user
export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();
    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal('accountId', [result.$id])],
    );

    if (user.total <= 0) return null;
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();
  try {
    // Delete the current session
    await account.deleteSession('current');

    (await cookies()).delete('appwrite-session');
    // ✅ 只在成功时跳转
    redirect('/sign-in');
  } catch (error) {
    handleError(error, 'Failed to sign out user');
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existedUser = await getUserByEmail(email);

    // existed, send OTP
    if (existedUser) {
      await sendEmailOTP(email);
      return parseStringify({ accountId: existedUser.accountId });
    }
    return parseStringify({ accountId: null, error: 'User not Found' });
  } catch (error) {
    handleError(error, 'Failed to sign in user');
  }
};

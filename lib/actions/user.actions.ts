"use server"

// accountId	来自 Appwrite 的 userId，是注册后用户在 Auth 系统中的唯一标识符
// OTP（邮箱登录）	安全、用户友好，不用密码，让用户点一下邮件链接即可完成登录

import { ID, Query } from "node-appwrite";
import { appwriteConfig } from "../appwrite/config";
import { createAdminClient } from "../appwrite";

const getUserByEmail=async (email:string)=>{
  const {databases} = await createAdminClient();
  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])],
  );
  return result.total >0 ? result.documents[0] :null
}
const handleError = (error:unknown,message:string)=>{
  console.log(error,message)
  throw error
}

// appwrite给发一个email一次性登录的OTP
const sendEmailOTP=async(email:string)=>{
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(),email)
    return session.userId
  } catch (error) {
    handleError(error,"Failed to send email OTP");
  }

}
// sign up
const createAccount = async ({ fullName, email }: { fullName:string, email:string }) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP(email);


  if(!accountId) throw new Error("Failed to send OTP");
  if(!existingUser){
    // create one
    const {databases} = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2uLl8zBoK0_iM5pNwJAC8hQ2f68YKtlgc7Q&s",
        accountId,
      }
    )
  }
  return parseStringify({ accountId });
};


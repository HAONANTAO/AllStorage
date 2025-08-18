'use server';

import { createAdminClient } from '../appwrite';
import { InputFile } from 'node-appwrite/file';
import { appwriteConfig } from '../appwrite/config';
import { ID, Query } from 'node-appwrite';
import { constructFileUrl, getFileType, parseStringify } from '../utils';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './user.actions';

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();

  try {
    console.log('file size:', file.size);
    if (!file || file.size === 0) {
      throw new Error('file buffer is empty');
    }
    // 如果 file 是浏览器的 File 对象，需要先转换：
    const buffer = Buffer.from(await file.arrayBuffer());
    const inputFile = InputFile.fromBuffer(buffer, file.name);

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile,
    );
    console.log('test', bucketFile.$id);
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      // for shared users
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument,
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, 'Failed to create file document');
      });

    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, 'Failed to upload file');
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createQueries = (currentUser: any) => {
  const queries = [
    // 查找 owner 等于这个用户 ID 或者 users 包含这个用户的邮箱 的文档。
    Query.or([
      Query.equal('owner', currentUser.$id),
      Query.contains('users', currentUser.email),
    ]),
  ];
  // TODO:search sort limits...
  return queries;
};

export const getFiles = async () => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('user not found');
    }
    // search query creation
    const queries = createQueries(currentUser);

    // get files
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries,
    );
    // console.log(files);
    return parseStringify(files);
  } catch (error) {
    handleError(error, 'failed to getFiles from databases');
  }
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();
  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name: newName,
      },
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, 'failed to rename file');
  }
};

export const shareFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();
  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        users: emails,
      },
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, 'failed to shared file');
  }
};

export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient();
  try {
    //  delete from database
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bucketId,
      fileId,
    );
    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
      // then delete from storage
    }
    revalidatePath(path);
    return parseStringify(deletedFile);
  } catch (error) {
    handleError(error, 'failed to delete the file');
  }
};

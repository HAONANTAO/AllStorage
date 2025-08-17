import { Models } from 'node-appwrite';
import React from 'react';
import Thumbnail from './Thumbnail';
import FormatedDateTime from './FormatedDateTime';
import { convertFileSize, formatDateTime } from '@/lib/utils';

const ImageThumbnail = ({ file }: { file: Models.Document }) => {
  return (
    <div className="file-details-thumbnail">
      <Thumbnail
        type={file.type}
        extension={file.extension}
        url={file.url}></Thumbnail>
      <div className="flex flex-col ">
        <p className="subtitle-2 mb-1">{file.name}</p>
        <FormatedDateTime className="caption" date={file.$createdAt} />
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex">
      <p className="file-details-label">{label}</p>
      <p className="file-details-value">{value}</p>
    </div>
  );
};
export const FileDetails = ({ file }: { file: Models.Document }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      {/* details */}
      <DetailRow label="Format:" value={file.extension} />
      <DetailRow label="Size:" value={convertFileSize(file.size)} />
      <DetailRow label="Owner:" value={file.owner.fullName} />
      <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
    </>
  );
};

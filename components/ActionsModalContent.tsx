import { Models } from 'node-appwrite';
import React from 'react';
import Thumbnail from './Thumbnail';
import FormatedDateTime from './FormatedDateTime';

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

const Detailrow = ({ label, value }: { label: string; value: string }) => {
  return <div>Detailrow</div>;
};
export const FileDetails = ({ file }: { file: Models.Document }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <Detailrow />
    </>
  );
};

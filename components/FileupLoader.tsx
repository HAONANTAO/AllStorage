"use client"
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}
const FileupLoader = ({ownerId,accountId,className}:Props) => {
  const [files,SetFiles] = useState<File[]>([])
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      {/*  会触发 getRootProps 的 click 事件 */}
      <Button type="button" className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width="24"
          height="24"
        />
        <p>Upload</p>
      </Button>
    {files.length>=1 && <ul className="uploader-preview-list">
      <h4 className="h4 text-light-100">Uploading</h4>
      {files.map((file,index)=>{
        const {type,extension} = getFileType(file.name)
      })}
      </ul>}

      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag drop some files here, or click to select files</p>
      )}
    </div>
  );
}

export default FileupLoader
function useState<T>(arg0: {}): [any, any] {
  throw new Error("Function not implemented.");
}


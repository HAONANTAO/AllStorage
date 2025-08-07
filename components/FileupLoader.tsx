"use client"
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import Image from "next/image";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}
const FileupLoader = ({ownerId,accountId,className}:Props) => {
  const [files,setFiles] = useState<File[]>([])
  const handleRemoveFile =(e:React.MouseEvent,fileName:string)=>{
    // 不传播下去点击事件
    e.stopPropagation()
    setFiles((prevfiles)=>prevfiles.filter((file)=>file.name!==fileName))
  }
  const onDrop = useCallback( async(acceptedFiles:File[]) => {
    // Do something with the files
    setFiles(acceptedFiles);
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
        return (
          <li key={`${file.name}-${index}`} className="uploader-preview-item">
            <div className="flex items-center gap-3">
              {/* 缩略图组件 */}
              <Thumbnail
                type={type}
                extension={extension}
                url={convertFileToUrl(file)}
              />
              <div className="preview-item-name">
                {file.name}
                {/* 加载条loader */}
                <Image
                  src="/assets/icons/file-loader.gif"
                  alt="loader"
                  width={80}
                  height={26}
                />
              </div>
            </div>
            <Image src="/assets/icons/remove.svg" width={24} height={24} alt="remove" onClick={(e)=>handleRemoveFile(e,file.name)}/>
          </li>
        );
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


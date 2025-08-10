"use client"
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import Image from "next/image";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";
import { uploadFile } from "@/lib/actions/file.action";
interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}
// The core
const FileupLoader = ({ownerId,accountId,className}:Props) => {
  const path = usePathname();
  const {toast} =useToast()
  const [files,setFiles] = useState<File[]>([])
  const handleRemoveFile =(e:React.MouseEvent<HTMLImageElement,MouseEvent>,fileName:string)=>{
    // 不传播下去点击事件冒泡
    e.stopPropagation()
    setFiles((prevfiles)=>prevfiles.filter((file)=>file.name!==fileName))
  }
  const onDrop = useCallback( async(acceptedFiles:File[]) => {
    // Do something with the files
    // 上传文件细节
    setFiles(acceptedFiles);
    // 一个个上传文件
    const uploadPromise = acceptedFiles.map(async(file)=>{
      // exceed the max size
      if(file.size>MAX_FILE_SIZE){
        setFiles((prevfiles)=>prevfiles.filter((f)=>f.name!==file.name))
        return toast({
          title:"File size too large",
          description:(<p className="body-2 text-white">
            <span className="font-semibold">
              {file.name} is too large, Max file size is 50MB
            </span>
          </p>),className:"error-toast"
        });
      }
      return uploadFile({file,ownerId,accountId,path}).then((uploadFile)=>{
        if(uploadFile){
          setFiles((prevfiles)=>prevfiles.filter((f)=>f.name!==file.name))
        }
      });
    })
    // 等全部上传完
    await Promise.all(uploadPromise);
  }, [ownerId,accountId,path]);
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

      
    </div>
  );
}

export default FileupLoader


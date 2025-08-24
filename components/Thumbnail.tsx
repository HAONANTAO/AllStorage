import { cn, getFileIcon } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

interface Props{
  type:string
  extension:string
  url:string,
  imageClassname?:string,
  className?:string
}

export const Thumbnail = ({type,extension,url="",imageClassname,className}:Props) => {
  // svg hard show in thubmnail
  const isImage= type==="image" && extension !== "svg"
  return (
    // 带有说明的独立内容块，通常用于图片、图表、代码示例等，并且常配合 <figcaption> 标签使用来添加说明文字。
    <figure className={cn("thumbnail",className)}>
      {/* check if its image? */}
      <Image src={isImage?url:getFileIcon(extension,type)} alt="thumbnail" width={100} height={100} className={cn("size-8 object-contain",imageClassname,isImage&& "thumbnail-image")}/>
    </figure>
  );
}

export default Thumbnail

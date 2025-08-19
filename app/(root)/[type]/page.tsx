import Card from '@/components/Card';
import Sort from '@/components/Sort';
import { getFiles } from '@/lib/actions/file.action';
import { getFileTypesParams } from '@/lib/utils';

import { Models } from 'node-appwrite';
import React from 'react'

// 根据 URL 动态显示一个标题，比如 /music → 页面上显示 "Music"。
const page = async({params}:SearchParamProps) => {
    const type = ((await params)?.type as string) || '';
    const types = getFileTypesParams(type) as FileType[]
  const files = await getFiles({types});

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

{/* Size */}
        <div className="total-size-section">
          <p className="body-1">
            Total:
            <span className="h5">0 MB</span>
          </p>

{/* sort */}
          <div className="sort-container">
            <p className=" body-1 hidden text-light-200  sm:block ">Sort by:</p>
            <Sort/>
          </div>
        </div>
      </section>

      {/* Core: render the files */}
      {files.total>0?
      (<section className="file-list">
        {files.documents.map((file:Models.Document)=>
        (<Card key={file.$id} file={file}/>))}
      </section>):
      <p className='empty-list'>No Files uploaded</p>}
    </div>
  );
}

export default page

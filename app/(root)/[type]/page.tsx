import React from 'react'

// 根据 URL 动态显示一个标题，比如 /music → 页面上显示 "Music"。
const page = async({params}:SearchParamProps) => {
  const type = (await params)?.type as string || ""
  return <div className="page-container">
    <section className="w-full">
      <h1 className='h1 capitalize'>{type}</h1>
    </section>
  </div>;
}

export default page

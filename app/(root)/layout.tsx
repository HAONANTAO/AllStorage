import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import SideBar from '@/components/SideBar'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <main className="flex h-screen">
      <SideBar></SideBar>
      <section className="flex h-full flex-1 flex-col ">
        <MobileNavigation></MobileNavigation>
        <Header></Header>
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}

export default layout

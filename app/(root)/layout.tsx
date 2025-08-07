import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import SideBar from '@/components/SideBar'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import React from 'react'
import { Toaster } from "@/components/ui/toaster";
 
const layout = async ({children}:{children:React.ReactNode}) => {
  const currentUser = await getCurrentUser();
  if(! currentUser) return redirect("/sign-in")
  return (
    <main className="flex h-screen">
      <SideBar {...currentUser}></SideBar>
      <section className="flex h-full flex-1 flex-col ">
        <MobileNavigation {...currentUser}></MobileNavigation>
        <Header></Header>
        <div className="main-content">{children}</div>
      </section>
      <Toaster />
    </main>
  );
}

export default layout

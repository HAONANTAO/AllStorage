import React from 'react'
import Image from 'next/image'
const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className="flex min-h-screen">
      {/* large screen" left/right side, non-large: one page with icon on top */}

      {/* left side  */}
      <section className=" hidden w-1/2 items-center justify-center bg-brand p-10 lg:flex ">
        <div className=" max-h-[800px] max-w-[480px] flex-col justify-center space-y-12 ">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            width={224}
            height={82}
            className="h-auto"
          />
          <div className="space-y-5 text-white">
            <h1 className="h1">Manage Your Files the best way</h1>
            <p className="body-1">
              This is a place where you can store all your documentations
            </p>
          </div>
          <Image
            src="/assets/images/files.png"
            alt="files"
            width={342}
            height={342}
            className=" transition-all hover:rotate-2 hover:scale-110"
          />
        </div>
      </section>
     
      {/* right side */}
      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10  lg:justify-center lg:p-10 lg:py-0">
        {/* hidden for large screen */}
        <div className="mb-16 lg:hidden">
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="logo"
            width={224}
            height={82}
            className="h-auto w-[200px] lg:w-[250px]"
          />
        </div>
        {children}
      </section>
    </div>
  );
}

export default Layout

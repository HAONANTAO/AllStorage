
import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import FileupLoader from './FileupLoader'
import Search from './Search'
import { signOutUser } from '@/lib/actions/user.actions'
const Header = ({ownerId,accountId}:{ownerId:string,accountId:string}) => {
  return (
    <header className="header">
      <Search></Search>
      <div className="header-wrapper">
        <FileupLoader ownerId={ownerId} accountId={accountId}></FileupLoader>
        {/* 疑问：要加await use server? */}
        <form action={signOutUser}>
          {/* signout button */}
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
}

export default Header

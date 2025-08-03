import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import FileupLoader from './FileupLoader'
import Search from './Search'
const Header = () => {
  return (
   <header className='header'>
    <Search></Search>
   <div className='header-wrapper'>
    <FileupLoader></FileupLoader>
    <form>
      {/* signout button */}
      <Button type="submit" className="sign-out-button">
        <Image src="/assets/icons/logout.svg" alt="logo"
        width={24} height={24}
        className="w-6" />
      </Button>
    </form>
    </div>
    
    </header>
  )
}

export default Header

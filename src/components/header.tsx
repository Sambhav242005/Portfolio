import React from 'react';
import Image from 'next/image'
import { ResponsiveMenu } from './responsive-menu';
export default function Header() {
  return (
    <header className='h-auto  p-2 bg-[#433D48] drop-shadow-lg w-full flex items-center justify-between  '>
      <Image className='rounded-full fixed drop-shadow-xl  top-[25%] aspect-auto h-auto max-w-[10vh] '  src={"/logo.jpg"} width={400} height={100} alt="Logo" />
      <ResponsiveMenu />
    </header>
  );
}


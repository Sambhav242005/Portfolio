import React from 'react';
import Image from 'next/image'
import { ResponsiveMenu } from './responsive-menu';
export default function Header() {
  return (
    <header className='h-auto  p-2 pl-6 bg-[#D6EAF8] drop-shadow  w-full flex items-center justify-between  '>
      <Image className='rounded-full fixed drop-shadow-xl  top-[10px] aspect-auto h-auto max-w-[13vh] '  src={"/logo.jpg"} width={400} height={100} alt="Logo" />
      <hr className='bg-black text-black h-2' />
      <ResponsiveMenu />
    </header>
  );
}


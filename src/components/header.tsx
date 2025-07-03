import React from 'react';
import Image from 'next/image'
import { ResponsiveMenu } from './responsive-menu';
export default function Header() {
  return (
    <header className='h-auto  p-2  bg-slate-50 drop-shadow  w-full flex items-center justify-between   '>
      <Image className='rounded-full fixed drop-shadow-xl top-[1vh]  md:top-[2vh] aspect-auto h-auto w-[16vw]  md:w-[8vw]  '  src={"/logo.jpg"} width={400} height={100} alt="Logo" />
      <ResponsiveMenu />
    </header>
  );
}


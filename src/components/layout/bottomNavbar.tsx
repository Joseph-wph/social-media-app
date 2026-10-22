'use client';

import Link from 'next/link';
import { Home, Plus, User } from 'lucide-react';

export default function BottomNav() {
  return (
    <div className='fixed bottom-5 left-1/2 z-50 w-full max-w-xs -translate-x-1/2 px-4'>
      <nav className='flex items-center justify-around rounded-full border border-white/10 bg-[#0E1117]/95 px-6 py-2.5 shadow-2xl backdrop-blur-md'>
        <Link
          href='/'
          className='flex flex-col items-center gap-1 text-white/50 transition hover:text-white'
        >
          <Home size={18} />
          <span className='text-[10px] font-medium'>Home</span>
        </Link>

        <Link
          href='/addPost'
          aria-label='Create post'
          className='flex size-10 items-center justify-center rounded-full bg-[#6C38FF] text-white shadow-lg transition hover:bg-[#5a2ee0]'
        >
          <Plus size={20} />
        </Link>

        <Link
          href='/myProfile'
          className='flex flex-col items-center gap-1 text-white/50 transition hover:text-white'
        >
          <User size={18} />
          <span className='text-[10px] font-medium'>Profile</span>
        </Link>
      </nav>
    </div>
  );
}

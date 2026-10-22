'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Menu, UserRound, X } from 'lucide-react';

import Container from '@/components/layout/container';
import NavbarSearch from '@/components/layout/navbarSearch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const initials = user?.name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    logout();
  };

  return (
    <header className='sticky top-0 z-50 border-b border-white/10 bg-black'>
      <Container>
        <nav
          aria-label='Main navigation'
          className='relative flex h-16 items-center justify-between gap-3'
        >
          {/* Brand */}
          <Link href='/' aria-label='Sociality home' className='shrink-0'>
            <Image
              src='/assets/icons/logo/logotype.png'
              alt='Sociality'
              width={137}
              height={36}
              priority
              className='h-auto w-26.25 object-contain sm:w-34.25'
            />
          </Link>

          {/* Search */}
          <NavbarSearch />

          {/* Right side */}
          <div className='ml-auto flex shrink-0 items-center gap-3'>
            {user ? (
              /* Logged-in user */
              <div className='relative flex items-center gap-3'>
                {/* Avatar trigger */}
                <button
                  type='button'
                  aria-label='Open profile menu'
                  aria-expanded={isProfileMenuOpen}
                  onClick={() => setIsProfileMenuOpen((open) => !open)}
                  className='flex items-center gap-3 rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary-3'
                >
                  <Avatar size='default' className='size-9'>
                    <AvatarImage
                      src={user.avatarUrl ?? undefined}
                      alt={user.name}
                    />

                    <AvatarFallback className='bg-[#7F51F9] font-semibold text-white'>
                      {initials || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <span className='hidden max-w-48 truncate text-sm font-semibold text-white md:block'>
                    {user.name}
                  </span>
                </button>

                {/* Profile dropdown */}
                {isProfileMenuOpen && (
                  <div className='absolute top-full right-0 z-50 mt-3 w-56 rounded-xl border border-white/10 bg-[#111111] p-2 shadow-xl'>
                    <Link
                      href='/myProfile'
                      onClick={() => setIsProfileMenuOpen(false)}
                      className='flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10'
                    >
                      <UserRound size={20} />
                      <span>My Profile</span>
                    </Link>

                    <button
                      type='button'
                      onClick={handleLogout}
                      className='flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-3'
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Desktop guest buttons */}
                <div className='hidden items-center gap-3 md:flex'>
                  <Link
                    href='/login'
                    className='flex h-11 w-32.5 items-center justify-center rounded-full border border-gray-600 bg-transparent text-sm font-semibold text-white transition-colors hover:border-primary-3 hover:bg-primary-3'
                  >
                    Log In
                  </Link>

                  <Link
                    href='/register'
                    className='flex h-11 w-32.5 items-center justify-center rounded-full border border-gray-600 bg-transparent text-sm font-semibold text-white transition-colors hover:border-primary-3 hover:bg-primary-3'
                  >
                    Register
                  </Link>
                </div>

                {/* Mobile burger button */}
                <button
                  type='button'
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMenuOpen}
                  onClick={() => setIsMenuOpen((open) => !open)}
                  className='flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 md:hidden'
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile dropdown menu */}
                {isMenuOpen && (
                  <div className='fixed inset-x-0 top-16 z-50 flex justify-center border-b border-white/10 bg-black px-4 py-3 md:hidden'>
                    <div className='flex w-full max-w-sm items-center justify-center gap-2'>
                      <Link
                        href='/login'
                        onClick={() => setIsMenuOpen(false)}
                        className='flex h-10 flex-1 items-center justify-center rounded-full border border-gray-600 bg-transparent text-sm font-semibold text-white transition-colors hover:border-primary-3 hover:bg-primary-3'
                      >
                        Log In
                      </Link>

                      <Link
                        href='/register'
                        onClick={() => setIsMenuOpen(false)}
                        className='flex h-10 flex-1 items-center justify-center rounded-full border border-gray-600 bg-transparent text-sm font-semibold text-white transition-colors hover:border-primary-3 hover:bg-primary-3'
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}

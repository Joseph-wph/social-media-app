'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, LoaderCircle } from 'lucide-react';

import { useSearchUsers } from '@/hooks/useSearchUsers';

export default function NavbarSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  const { data, isFetching, isError } = useSearchUsers(debouncedQuery);

  const users = data?.data.users ?? [];
  const showResults = debouncedQuery.length >= 2;

  const closeSearch = () => {
    setIsMobileOpen(false);
    setQuery('');
    setDebouncedQuery('');
  };

  const results = (
    <div className='absolute top-full left-0 z-60 mt-2 max-h-96 w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#111111] p-2 shadow-2xl'>
      {debouncedQuery.length < 2 ? (
        <p className='px-3 py-4 text-sm text-gray-400'>
          Type at least 2 characters to search.
        </p>
      ) : isFetching ? (
        <div className='flex items-center justify-center gap-2 px-3 py-6 text-sm text-gray-400'>
          <LoaderCircle size={18} className='animate-spin' />
          Searching users...
        </div>
      ) : isError ? (
        <p className='px-3 py-4 text-sm text-red-400'>
          Could not load search results. Please try again.
        </p>
      ) : users.length === 0 ? (
        <p className='px-3 py-4 text-sm text-gray-400'>No users found.</p>
      ) : (
        <>
          <p className='px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>
            People
          </p>

          {users.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${encodeURIComponent(user.username)}`}
              onClick={closeSearch}
              className='flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/10'
            >
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt=''
                  width={40}
                  height={40}
                  unoptimized
                  className='size-10 shrink-0 rounded-full object-cover'
                />
              ) : (
                <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-[#7F51F9] font-semibold text-white'>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-semibold text-white'>
                  {user.name}
                </p>
                <p className='truncate text-xs text-gray-400'>
                  @{user.username}
                </p>
              </div>
            </Link>
          ))}
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop search */}
      <div className='absolute left-1/2 hidden w-[min(491px,40vw)] -translate-x-1/2 md:block'>
        <div className='relative'>
          <Search
            size={20}
            aria-hidden='true'
            className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#71717A]'
          />

          <input
            type='search'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search people...'
            aria-label='Search people'
            autoComplete='off'
            className='h-12 w-full rounded-full border border-white/10 bg-[#111111] pr-4 pl-12 text-sm text-white outline-none transition-colors placeholder:text-[#71717A] focus:border-primary-3 focus:ring-2 focus:ring-primary-3/20'
          />

          {showResults && results}
        </div>
      </div>

      {/* Mobile search trigger */}
      <button
        type='button'
        aria-label='Open search'
        aria-expanded={isMobileOpen}
        onClick={() => setIsMobileOpen((open) => !open)}
        className='flex size-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 md:hidden'
      >
        {isMobileOpen ? <X size={22} /> : <Search size={22} />}
      </button>

      {/* Mobile search panel */}
      {isMobileOpen && (
        <div className='fixed inset-x-0 top-16 z-60 border-b border-white/10 bg-black px-4 py-3 md:hidden'>
          <div className='relative'>
            <Search
              size={20}
              aria-hidden='true'
              className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#71717A]'
            />

            <input
              type='search'
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Search people...'
              aria-label='Search people'
              autoComplete='off'
              autoFocus
              className='h-11 w-full rounded-full border border-white/10 bg-[#111111] pr-4 pl-12 text-sm text-white outline-none placeholder:text-[#71717A] focus:border-primary-3'
            />

            {showResults && results}
          </div>
        </div>
      )}
    </>
  );
}

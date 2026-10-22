import Image from 'next/image';

type PostAvatarProps = {
  src?: string | null;
  name: string;
  size?: string;
};

export default function PostAvatar({
  src,
  name,
  size = 'size-9',
}: PostAvatarProps) {
  return (
    <div
      className={`relative ${size} shrink-0 overflow-hidden rounded-full border border-white/10 bg-zinc-900`}
    >
      {src ? (
        <Image
          src={src}
          alt={`${name}'s avatar`}
          fill
          unoptimized
          sizes='36px'
          className='object-cover'
        />
      ) : (
        <div className='flex h-full w-full items-center justify-center bg-[#6936F2] text-xs font-bold text-white'>
          {name.charAt(0).toUpperCase() || '?'}
        </div>
      )}
    </div>
  );
}

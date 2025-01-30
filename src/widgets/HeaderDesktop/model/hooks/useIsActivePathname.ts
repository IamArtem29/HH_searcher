import { usePathname } from 'next/navigation';

export const useIsActivePathname = (name: string) => {
  const pathname = usePathname();

  return pathname === `/${name}`;
};

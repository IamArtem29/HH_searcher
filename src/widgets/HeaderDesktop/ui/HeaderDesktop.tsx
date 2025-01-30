'use client';

import Link from 'next/link';
import { BarChart2, ScrollText, LineChart } from 'lucide-react';
import { useIsActivePathname } from '../model/hooks/useIsActivePathname';

const NOT_ACTIVE =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary';

const ACTIVE =
  'flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary';

export const HeaderDesktop = () => {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BarChart2 className="h-6 w-6" />
            <span className="">аННалитика</span>
          </Link>
        </div>

        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/vacancies"
              className={useIsActivePathname('vacancies') ? ACTIVE : NOT_ACTIVE}
            >
              <ScrollText className="h-4 w-4" />
              Вакансии
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

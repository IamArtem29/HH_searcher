'use client';

import { getFromCookie, saveToCookie } from '@/shared/cookieMove';
import { saveToLocalStorage } from '@/shared/localStorageMove';
import { HeaderDesktop } from '@/widgets/HeaderDesktop/ui/HeaderDesktop';
import { HeaderMobile } from '@/widgets/HeaderMobile/ui/HeaderMobile';
import { useEffect } from 'react';

const Main = ({ children }: any) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    const accessToken = getFromCookie('access_token');

    if (accessToken) {
      fetch(`https://api.hh.ru/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          saveToLocalStorage('me', data);
        })
        .catch((error) => {
          console.error('Error fetching API data:', error);
        });
    } else if (code && !accessToken) {
      fetch(`api/authorize?${urlParams.toString()}`)
        .then((response) => response.json())
        .then((data) => {
          const { access_token, token_type, refresh_token, expires_in } = data;

          saveToCookie('access_token', access_token, expires_in);
          saveToCookie('token_type', token_type, expires_in);
          saveToCookie('refresh_token', refresh_token, expires_in);
          saveToCookie('expires_in', expires_in, expires_in);

          if (access_token) {
            fetch('https://api.hh.ru/oauth/token', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            })
              .then((response) => response.json())
              .then((data) => {
                saveToLocalStorage('me', data);
              })
              .catch((error) => {
                console.error('Error fetching API data:', error);
              });
          }
        })
        .catch((error) => {
          console.error('Проблема с авторизацией: ', error);
        });
    }
  }, []);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <HeaderDesktop />
      <div className="flex flex-col">
        <HeaderMobile />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Main;

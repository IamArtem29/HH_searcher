'use client';

import { FC, useState } from 'react';

import { cn } from '@/lib/utils';
import { ModalContainer } from '@/shared/ModalContainer/ui/ModalContainer';
import { ISubmitButton } from '@/shared/ModalContainer/model/interfaces';

const title: string = 'Подтверждение входа';

const declineButton: string = 'Отмена';

const openButton = { text: 'Вход' };

const submitButton: ISubmitButton = {
  submitText: 'Войти',
  link: `https://hh.ru/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`,
};

export const AuthModal: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmitClick = () => {
    setIsOpen(false);
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      openButton={openButton}
      title={title}
      onSubmitClick={handleSubmitClick}
      submitButton={submitButton}
      declineButton={declineButton}
    >
      <div className="flex flex-col gap-2 my-4">
        <div className={cn('w-full h-auto')}>
          Вход будет осуществлён через сайт hh. Полученные данные будут хранится
          и использоваться только в рамках этого сайта. Авторизуясь, вы
          принимаете условия использования данного веб-сайта.
        </div>
        <div>
          В качестве условия использования этого веб-сайта вы гарантируете, что
          не будете использовать этот веб-сайт или любой контент, полученный с
          этого веб-сайта, для любых целей, которые являются незаконными или
          запрещены настоящими условиями.
        </div>
      </div>
    </ModalContainer>
  );
};

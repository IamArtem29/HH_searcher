export const saveToCookie = (name: string, value: any, sec: number) => {
  const date = new Date();
  date.setTime(date.getTime() + sec * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie =
    name + '=' + JSON.stringify(value) + ';' + expires + ';path=/';
};

export const getFromCookie = (name: string) => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const value = c.substring(nameEQ.length, c.length);
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error('Error parsing cookie value:', e);
        return value;
      }
    }
  }
  return null;
};

export const removeFromCookie = (name: string) => {
  document.cookie = name + '=; Max-Age=-99999999;';
};

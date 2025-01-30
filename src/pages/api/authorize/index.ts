import nc from 'next-connect';

const handler = nc<any, any>();

handler.get(async (req, res) => {
  const { query } = req;

  const { code } = query;

  const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
  const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  fetch(
    `https://api.hh.ru/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((error) => console.error('Error:', error));
});

export default handler;

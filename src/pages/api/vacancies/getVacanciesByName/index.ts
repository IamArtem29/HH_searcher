import nc from "next-connect";

const handler = nc<any, any>();

const perPage = 100;

handler.get(async (req, res) => {
  const { query } = req;

  const { name } = query;

  const searchParams = new URLSearchParams();

  searchParams.set("text", name);
  searchParams.set("per_page", JSON.stringify(perPage));

  const vacanciesResponse = await fetch(
    `https://api.hh.ru/vacancies?${searchParams.toString()}`
  ).then((data) => data.json());

  const { items, found } = vacanciesResponse;

  const vacancies = items;

  const pagesAmount = Math.ceil(found / Number(perPage));

  for (let i = 1; i < (pagesAmount > 20 ? 20 : pagesAmount); i++) {
    const page = i;

    const searchParams = new URLSearchParams();

    searchParams.set("text", name);
    searchParams.set("page", `${page}`);
    searchParams.set("per_page", `${perPage}`);

    const vacanciesResponse = await fetch(
      `https://api.hh.ru/vacancies?${searchParams.toString()}`
    ).then((data) => data.json());

    const { items } = vacanciesResponse;

    

    vacancies.push(...items);
  }

  res.json({ vacancies, name });
});

export default handler;

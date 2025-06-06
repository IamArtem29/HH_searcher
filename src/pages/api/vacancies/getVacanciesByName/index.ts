import nc from 'next-connect';

const handler = nc<any, any>();

const perPage = 100;

handler.get(async (req, res) => {
  const { query } = req;

  const { name, experience, salaryFrom, salaryTo, currency, gross } = query;

  const searchParams = new URLSearchParams();

  searchParams.set('text', name);
  searchParams.set('per_page', JSON.stringify(perPage));

  // Добавляем параметры фильтрации
  if (experience) {
    searchParams.set('experience', experience);
  }
  if (salaryFrom) {
    searchParams.set('salary', salaryFrom);
    searchParams.set('currency', currency || 'RUR');
  }

  const vacanciesResponse = await fetch(
    `https://api.hh.ru/vacancies?${searchParams.toString()}`
  ).then((data) => data.json());

  const { items, found } = vacanciesResponse;

  let vacancies = items;

  const pagesAmount = Math.ceil(found / Number(perPage));

  for (let i = 1; i < (pagesAmount > 20 ? 20 : pagesAmount); i++) {
    const page = i;

    const pageParams = new URLSearchParams(searchParams);
    pageParams.set('page', `${page}`);

    const vacanciesResponse = await fetch(
      `https://api.hh.ru/vacancies?${pageParams.toString()}`
    ).then((data) => data.json());

    const { items } = vacanciesResponse;
    vacancies = vacancies.concat(items);
  }

  // Дополнительная фильтрация на нашей стороне
  if (salaryTo || gross) {
    vacancies = vacancies.filter((vacancy: any) => {
      const salary = vacancy.salary;
      if (!salary) return false;

      // Фильтрация по верхней границе зарплаты
      if (salaryTo && salary.to && salary.to > Number(salaryTo)) {
        return false;
      }

      // Фильтрация по типу зарплаты
      if (gross && salary.gross !== (gross === 'true')) {
        return false;
      }

      return true;
    });
  }

  res.json({ vacancies, name });
});

export default handler;

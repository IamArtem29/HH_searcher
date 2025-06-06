import nc from 'next-connect';

const handler = nc<any, any>();

export type Skill = {
  name: string;
  amount: number;
  percentage: number;
};

export type VacancyAmount = {
  value: number;
  valueWithSalary: number;
};

export type AnalysisContent = {
  avgSalary: number;
  amount: VacancyAmount;
  skills: Skill[];
};

const mainSkills = ['html', 'css', 'react', 'vue', 'ts', 'typescript'];

const getAvgSalary = (salary: any) => {
  if (!salary) {
    return;
  }

  const { from, to, currency } = salary;

  if (currency !== 'RUR') return;

  switch (true) {
    case !!from && !!to:
      return (from + to) / 2;

    case !!from:
      return from;
  }
};

const perPage = 100;

handler.get(async (req, res) => {
  const { query } = req;

  const {
    vacancySearchParams,
    skills: stringSkills,
    experience,
    salaryFrom,
    salaryTo,
    currency,
    gross,
  } = query;

  const userSkills: string[] = JSON.parse(stringSkills);

  const searchParams = new URLSearchParams();

  searchParams.set('text', vacancySearchParams);
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

  const analysisContent: AnalysisContent = {
    avgSalary: 0,
    skills: [],
    amount: { value: vacancies.length, valueWithSalary: 0 },
  };

  vacancies.forEach((vacancy: any) => {
    const { salary, snippet } = vacancy;
    const avgSalary = getAvgSalary(salary);

    if (avgSalary) {
      analysisContent.amount.valueWithSalary++;
      if (analysisContent.avgSalary) {
        analysisContent.avgSalary +=
          (avgSalary - analysisContent.avgSalary) /
          analysisContent.amount.valueWithSalary;
      } else {
        analysisContent.avgSalary = avgSalary;
      }
    }

    const { requirement } = snippet;

    userSkills.forEach((mainSkill) => {
      if (!requirement) return;
      if (requirement.toLowerCase().includes(mainSkill)) {
        const currentSkill = analysisContent.skills.find(
          (skill) => skill.name === mainSkill
        );

        const percentage = (1 / analysisContent.amount.value) * 100;

        if (currentSkill) {
          currentSkill.amount++;
          currentSkill.percentage += percentage;
        } else {
          analysisContent.skills.push({
            name: mainSkill,
            amount: 1,
            percentage,
          });
        }
      }
    });
  });

  res.json({ analysisContent });
});

export default handler;

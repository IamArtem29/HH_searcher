import nc from "next-connect";

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

const mainSkills = ["html", "css", "react", "vue", "ts", "typescript"];

const getAvgSalary = (salary: any) => {
  if (!salary) {
    return;
  }

  const { from, to, currency } = salary;

  if (currency !== "RUR") return;

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

  const { vacancySearchParams, skills: stringSkills } = query;

  const userSkills: string[] = JSON.parse(stringSkills);

  const searchParams = new URLSearchParams();

  searchParams.set("text", vacancySearchParams);
  searchParams.set("per_page", JSON.stringify(perPage));

  const vacanciesResponse = await fetch(
    `https://api.hh.ru/vacancies?${searchParams.toString()}`
  ).then((data) => data.json());

  const { items, found } = vacanciesResponse;

  const vacancies = items;

  const pagesAmount = Math.ceil(found / Number(perPage));

  const analysisContent: AnalysisContent = {
    avgSalary: 0,
    skills: [],
    amount: { value: found, valueWithSalary: 0 },
  };

  for (let i = 1; i < (pagesAmount > 20 ? 20 : pagesAmount); i++) {
    const page = i;

    const searchParams = new URLSearchParams();

    searchParams.set("text", vacancySearchParams);
    searchParams.set("page", `${page}`);
    searchParams.set("per_page", `${perPage}`);

    const vacanciesResponse = await fetch(
      `https://api.hh.ru/vacancies?${searchParams.toString()}`
    ).then((data) => data.json());

    const { items } = vacanciesResponse;

    vacancies.push(...items);
  }

  vacancies.map((vacancy: { salary: any; snippet: any }) => {
    const { skills, amount } = analysisContent;

    const { salary, snippet } = vacancy;

    const avgSalary = getAvgSalary(salary);

    if (avgSalary) {
      amount.valueWithSalary++;
      if (analysisContent.avgSalary) {
        analysisContent.avgSalary +=
          (avgSalary - analysisContent.avgSalary) / amount.valueWithSalary;
      } else {
        analysisContent.avgSalary = avgSalary;
      }
    }

    const { requirement } = snippet;

    userSkills.map((mainSkill) => {
      if (!requirement) return;
      if (requirement.toLowerCase().includes(mainSkill)) {
        const currentSkill = skills.find((skill) => skill.name === mainSkill);

        const percentage = (1 / amount.value) * 100;

        if (currentSkill) {
          currentSkill.amount++;
          currentSkill.percentage += percentage;
        } else {
          skills.push({
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

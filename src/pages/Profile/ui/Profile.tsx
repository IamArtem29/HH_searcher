'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const Profile = () => {
  const item = localStorage.getItem('customSkillSets') as string;

  const newItem = JSON.parse(item);

  return (
    <section className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Профиль</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        ></nav>
        <div className="grid gap-6">
          <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
              <CardTitle>Сохраненные пресеты</CardTitle>
              <CardDescription>
                Сохраняте фильтры для быстрого поиска вакансий по вашим условиям
              </CardDescription>
            </CardHeader>
            <CardContent>
              {newItem.map((person, index) => (
                <div key={index}>
                  <h2>Название: {person.name}</h2>
                  <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
                    {person.skills.map((skill, skillIndex) => (
                      <li key={skillIndex}>{skill}</li>
                    ))}
                    <hr style={{ margin: '16px 0' }} />
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

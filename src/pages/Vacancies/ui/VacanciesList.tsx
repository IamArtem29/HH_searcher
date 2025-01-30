'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { MagnifyingGlassIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useState, useEffect, ChangeEvent, Key } from 'react';
import VacancyCard from '../../../widgets/VacancyCard/ui/VacancyCard';
import styles from './VacanciesList.module.css';
import { SkillSetPicker } from '@/components/SkillSet/SkillSetPicker/SkillSetPicker';
import { useSkillSet } from '@/components/SkillSet/useSkillSet';
import { SkillSetAdder } from '@/components/SkillSet/SkillSetAdder/SkillSetAdder';
import { Chart } from '@/shared/Chart/Chart';
import { Label } from '@/components/ui/label';

const VacanciesList = () => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>({});

  const { skillSet } = useSkillSet();

  const { analysisContent = {} } = analysisResult;
  const { avgSalary, skills = [], amount = {} } = analysisContent;
  const { value, valueWithSalary } = amount;

  const [name, setName] = useState<string>('');
  const [queryText, setQueryText] = useState<string>('');

  const ReturnWord = () => {
    switch (true) {
      case isLoading: {
        return (
          <div className="flex flex-1 items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="motivational-text max-w-md mx-auto p-6">
                <h2 className="text-2xl font-bold mb-4">
                  Начните поиск для анализа рынка
                </h2>

                <p className="text-sm text-muted-foreground">
                  Развивайтесь и продвигайтесь вперед, каждый шаг приближает вас
                  к цели!
                </p>
              </div>
            </div>
          </div>
        );
      }

      case isLoading: {
        return (
          <div className="flex items-center justify-center">
            <div
              className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        );
      }

      default: {
        return null;
      }
    }
  };

  const handleClear = () => {
    setName('');
  };

  const setNameValue = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const handleSearch = async () => {
    const getVacancies = async () => {
      setIsLoading(true);
      const searchParams = new URLSearchParams();

      searchParams.set('name', JSON.stringify(name));

      const { vacancies, name: queryText } = await fetch(
        `api/vacancies/getVacanciesByName?${searchParams.toString()}`
      ).then((res) => res.json());

      setData(vacancies);
      setQueryText(queryText);

      setIsLoading(false);
    };

    const getVacanciesAnalysis = async () => {
      const searchParams = new URLSearchParams();

      searchParams.set('vacancySearchParams', name);
      searchParams.set('skills', JSON.stringify(skillSet?.skills));

      const result = fetch(
        `api/vacancies/getVacanciesAnalysis?${searchParams.toString()}`
      );

      result.then((res) => res.json()).then((data) => setAnalysisResult(data));

      setIsAnalysisLoading(false);
    };

    await Promise.all([getVacancies(), getVacanciesAnalysis()]);
  };

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Распределение навыков по вакансиям',
      align: 'left',
    },
    xAxis: {
      categories: [''],
      title: {
        text: 'Навыки',
      },
      gridLineWidth: 1,
      lineWidth: 0,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Присутствие в вакансиях, %',
      },
      labels: {
        overflow: 'justify',
      },
      gridLineWidth: 0,
    },
    series: [
      ...skills.map(({ name, percentage }: any) => {
        return { type: 'column', name, data: [percentage] };
      }),
    ],
    tooltip: {
      valueSuffix: ' %',
    },
  };

  return (
    <div className="flex flex-col gap-6">
      <Label>СкиллСет</Label>
      <div className="flex gap-4">
        <SkillSetPicker />
        <SkillSetAdder />
      </div>
      <div className={styles.search}>
        <Input
          name="name"
          onChange={setNameValue}
          placeholder="Поиск вакансии"
          value={name}
        />
        <Button size="icon" onClick={handleClear} disabled={!name}>
          <Cross2Icon className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" />
        <Button
          size="icon"
          onClick={handleSearch}
          disabled={isLoading || !name}
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
        </Button>
      </div>

      {!!data.length ? (
        <div className="flex flex-col gap-6">
          <div>
            <div>{`Количесто: ${value}, Вакансии с зарплатой: ${valueWithSalary}`}</div>
            <div
              style={{ marginBottom: '20px' }}
            >{`Средняя зарплата: ${avgSalary}`}</div>
            {skills.length && <Chart options={chartOptions} />}
          </div>
          <div className="h-calc-screen overflow-y-scroll flex flex-col gap-6">
            {data.map((dataItem: any, index: any) => {
              return <VacancyCard dataItem={dataItem} key={index} />;
            })}
          </div>
        </div>
      ) : (
        <ReturnWord />
      )}
    </div>
  );
};

export default VacanciesList;

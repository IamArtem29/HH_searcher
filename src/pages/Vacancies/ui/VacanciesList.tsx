'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  MagnifyingGlassIcon,
  Cross2Icon,
  MixerHorizontalIcon,
} from '@radix-ui/react-icons';
import { useState, useEffect, ChangeEvent } from 'react';
import VacancyCard from '../../../widgets/VacancyCard/ui/VacancyCard';
import styles from './VacanciesList.module.css';
import { SkillSetPicker } from '@/components/SkillSet/SkillSetPicker/SkillSetPicker';
import { useSkillSet } from '@/components/SkillSet/useSkillSet';
import { SkillSetAdder } from '@/components/SkillSet/SkillSetAdder/SkillSetAdder';
import { Chart } from '@/shared/Chart/Chart';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const VacanciesList = () => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>({});
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const { skillSet } = useSkillSet();

  const { analysisContent = {} } = analysisResult;
  const { avgSalary, skills = [], amount = {} } = analysisContent;
  const { value, valueWithSalary } = amount;

  const [name, setName] = useState<string>('');
  const [queryText, setQueryText] = useState<string>('');

  const [filters, setFilters] = useState({
    experience: '',
    salaryFrom: '',
    salaryTo: '',
    currency: 'RUR',
    gross: true,
  });

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

      if (filters.experience) {
        searchParams.set('experience', filters.experience);
      }
      if (filters.salaryFrom) {
        searchParams.set('salaryFrom', filters.salaryFrom);
      }
      if (filters.salaryTo) {
        searchParams.set('salaryTo', filters.salaryTo);
      }
      searchParams.set('currency', filters.currency);
      searchParams.set('gross', JSON.stringify(filters.gross));

      const { vacancies, name: queryText } = await fetch(
        `api/vacancies/getVacanciesByName?${searchParams.toString()}`
      ).then((res) => res.json());

      setData(vacancies);
      setQueryText(queryText);

      setIsLoading(false);
    };

    const getVacanciesAnalysis = async () => {
      setIsAnalysisLoading(true);
      const searchParams = new URLSearchParams();

      searchParams.set('vacancySearchParams', name);
      searchParams.set('skills', JSON.stringify(skillSet?.skills || []));

      if (filters.experience) {
        searchParams.set('experience', filters.experience);
      }
      if (filters.salaryFrom) {
        searchParams.set('salaryFrom', filters.salaryFrom);
      }
      if (filters.salaryTo) {
        searchParams.set('salaryTo', filters.salaryTo);
      }
      searchParams.set('currency', filters.currency);
      searchParams.set('gross', JSON.stringify(filters.gross));

      try {
        const response = await fetch(
          `api/vacancies/getVacanciesAnalysis?${searchParams.toString()}`
        );
        const data = await response.json();
        setAnalysisResult(data);
      } catch (error) {
        console.error('Error fetching analysis:', error);
      } finally {
        setIsAnalysisLoading(false);
      }
    };

    await Promise.all([getVacancies(), getVacanciesAnalysis()]);
  };

  const handleResetFilters = () => {
    setFilters({
      experience: '',
      salaryFrom: '',
      salaryTo: '',
      currency: 'RUR',
      gross: true,
    });
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

        <Button size="icon" onClick={() => setIsFilterDialogOpen(true)}>
          <MixerHorizontalIcon className="h-4 w-4" />
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

      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Фильтры вакансий</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="experience" className="text-right">
                Опыт работы
              </Label>
              <Select
                value={filters.experience}
                onValueChange={(value) =>
                  setFilters({ ...filters, experience: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите опыт" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="noExperience">Нет опыта</SelectItem>
                  <SelectItem value="between1And3">1-3 года</SelectItem>
                  <SelectItem value="between3And6">3-6 лет</SelectItem>
                  <SelectItem value="moreThan6">Более 6 лет</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Зарплата</Label>
              <div className="col-span-3 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="salaryFrom">От</Label>
                  <Input
                    id="salaryFrom"
                    type="number"
                    value={filters.salaryFrom}
                    onChange={(e) =>
                      setFilters({ ...filters, salaryFrom: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="salaryTo">До</Label>
                  <Input
                    id="salaryTo"
                    type="number"
                    value={filters.salaryTo}
                    onChange={(e) =>
                      setFilters({ ...filters, salaryTo: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Валюта</Label>
              <Select
                value={filters.currency}
                onValueChange={(value) =>
                  setFilters({ ...filters, currency: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите валюту" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RUR">Рубли (RUB)</SelectItem>
                  <SelectItem value="USD">Доллары (USD)</SelectItem>
                  <SelectItem value="EUR">Евро (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleResetFilters}>
              Сбросить фильтры
            </Button>
            <Button onClick={() => setIsFilterDialogOpen(false)}>
              Применить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!!data.length ? (
        <div className="flex flex-col gap-6">
          <div>
            <div>{`Количество: ${value}, Вакансии с зарплатой: ${valueWithSalary}`}</div>
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

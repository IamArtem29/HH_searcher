import { useSkillSet } from '../useSkillSet';
import { useEffect } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type SkillSet = {
  name: string;
  skills: string[];
};

const predefinedSkillSets: SkillSet[] = [];

const getSkillSets = () => {
  if (typeof window !== 'undefined') {
    const customSkillSets = localStorage.getItem('customSkillSets');
    const parsedCustomSkillSets: SkillSet[] = customSkillSets
      ? JSON.parse(customSkillSets)
      : [];

    return predefinedSkillSets.concat(parsedCustomSkillSets);
  }
  return [];
};

export const SkillSetPicker = () => {
  const { setSkillSet, skillSet } = useSkillSet();

  const skillSets = getSkillSets();

  const handleChange = (value: string) => {
    const selectedSkillSet = skillSets.find((set) => set.name === value);
    setSkillSet(selectedSkillSet || null);
  };

  useEffect(() => {
    setSkillSet(skillSets[0]);
  }, []);

  return (
    <Select value={skillSet?.name || ''} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue placeholder={(skillSet?.name as any) || 'Выберите сет'} />
      </SelectTrigger>
      <SelectContent>
        {skillSets.map((item, index) => {
          return (
            <SelectItem key={index} value={item.name}>
              {item.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

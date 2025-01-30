import useSWR from "swr";
import { SkillSet } from "./SkillSetPicker/SkillSetPicker";

export const useSkillSet = () => {
  const { data: skillSet, mutate: setSkillSet } = useSWR<SkillSet | null>(
    "skillSet",
    {
      fallbackData: null,
    }
  );

  return { skillSet, setSkillSet };
};

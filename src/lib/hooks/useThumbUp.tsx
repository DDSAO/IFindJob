import { PlayThumbUpAtom } from "@/components/Tailwind/Layouts/PageWithNav";
import { useRecoilState } from "recoil";
export const useThumbUp = () => {
  const [thumbUp, setThumbUp] = useRecoilState(PlayThumbUpAtom);

  return () => {
    setThumbUp(true);
  };
};

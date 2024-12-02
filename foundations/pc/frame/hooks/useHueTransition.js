import { useSpring } from "react-spring";
import useStore from "@/components/screen/store";

export function useHueTransition() {
  const currentArchitectures = useStore((state) => state.currentArchitectures);
  const targetHue = currentArchitectures?.[0]?.hue ?? 230;

  const { hue } = useSpring({
    hue: targetHue,
    config: { tension: 120, friction: 14 },
  });

  return { hue: hue.get(), currentArchitectures };
}

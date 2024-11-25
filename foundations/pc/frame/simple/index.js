import * as S from "./styles";
import useStore from "@/components/screen/store";
import { useLayoutEffect, useRef, useState } from "react";

export default function Frame() {
  const currentArchitectures = useStore((state) => state.currentArchitectures);
  const titleRef = useRef(null);
  const verRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    titleWidth: 27,
    verWidth: 2,
  });

  useLayoutEffect(() => {
    if (
      titleRef.current &&
      verRef.current &&
      currentArchitectures?.length > 0
    ) {
      const titleWidth = titleRef.current.getBoundingClientRect().width;
      const verWidth = verRef.current.getBoundingClientRect().width;

      const vw = window.innerWidth / 100;
      const titleVw = titleWidth / vw;
      const verVw = verWidth / vw;

      setDimensions({
        titleWidth: titleVw + 2,
        verWidth: verVw + 1,
      });
    }
  }, [currentArchitectures]);

  if (!currentArchitectures || currentArchitectures.length === 0) return null;

  const { name, version } = currentArchitectures[0];

  return (
    <S.Container>
      <S.HorizontalLine $width={dimensions} />
      <S.HorizontalLine2 $width={dimensions} />

      <S.ModelTitle ref={titleRef} $width={dimensions}>
        <S.Ver ref={verRef}>{version}</S.Ver>
        <S.Title>{name}</S.Title>
      </S.ModelTitle>
    </S.Container>
  );
}

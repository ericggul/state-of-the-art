import * as S from "./styles";
import { memo, useEffect, useMemo } from "react";
import useAudio from "@/components/backend/utils/useAudio";
import useConversation from "@/components/backend/utils/useConversation";
import useStore from "./store";
import useScreenStore from "@/components/screen/store";

import Backend0 from "@/foundations/backend/0";
import Backend1 from "@/foundations/backend/1";
import Backend2 from "@/foundations/backend/2";
import Backend3 from "@/foundations/backend/3";
import Backend4 from "@/foundations/backend/4";

import dynamic from "next/dynamic";

import * as CONST from "@/utils/constant";

const TranscriptComponent = dynamic(
  () => import("@/components/backend/transcript"),
  {
    ssr: false,
  }
);

const TESTING = false;

// Memoize common props to prevent recreating object on every render
const defaultRange = { x: [0.05, 0.95], y: [0.05, 0.95] };
const backend4Range = { x: [0.2, 0.8], y: [0.2, 0.8] };
const defaultProps = {
  visible: true,
  timeUnit: 1,
};

const Backend = memo(function Backend({ socket }) {
  const { loop, level } = useStore();

  useConversation({ socket });
  useAudio();

  // Memoize the current Backend component based on level
  const CurrentBackend = useMemo(() => {
    if (TESTING) {
      return <Backend0 range={defaultRange} {...defaultProps} />;
    }

    switch (level) {
      case 0:
        return <Backend0 range={defaultRange} {...defaultProps} />;
      case 1:
        return <Backend1 range={defaultRange} {...defaultProps} />;
      case 2:
        return <Backend2 range={defaultRange} {...defaultProps} />;
      case 3:
        return <Backend3 range={defaultRange} {...defaultProps} />;
      default:
        return (
          <Backend4 range={backend4Range} {...defaultProps} timeUnit={0.1} />
        );
    }
  }, [level]);

  const deviceIndex = useScreenStore((state) => state.deviceIndex);
  const isProjector = useScreenStore((state) => state.isProjector);

  return (
    <S.Container>
      {CurrentBackend}
      {level >= CONST.MIX_BACKEND_LEVEL && deviceIndex <= 2 && (
        <S.Top $deviceIndex={deviceIndex} />
      )}
      {!isProjector && <TranscriptComponent />}
    </S.Container>
  );
});

Backend.displayName = "Backend";
export default Backend;

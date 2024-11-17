import * as S from "./styles";

import { useMemo, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import useSocket from "@/utils/socket/on-off/useSocketMobile";

import useMobileVisibility from "@/utils/hooks/_old/useMobileVisibility";

import AssistantUI from "@/foundations/test-frontend/assistant";

export default function El() {
  ////TO DO
  //to implement: React-use?

  const mobileId = useMemo(() => uuidv4(), []);

  const [requestVisibilityCheck, setRequestVisibilityCheck] = useState(false);
  const socket = useSocket({
    mobileId,
    requestVisibilityCheckFromSocketInit: setRequestVisibilityCheck,
  });

  const isTabVisible = useMobileVisibility({
    socket,
    mobileId,
    requestVisibilityCheck,
    setRequestVisibilityCheck,
  });

  return (
    <S.Container>
      <AssistantUI />
    </S.Container>
  );
}

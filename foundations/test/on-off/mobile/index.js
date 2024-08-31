import * as S from "./styles";

import { useMemo, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";
import useSocket from "@/utils/socket/on-off/useSocketMobile";

import useVisibilityCheck from "@/utils/hooks/useVisibilityCheck";

export default function El() {
  const mobileId = useMemo(() => uuidv4(), []);

  const socket = useSocket({ mobileId });

  const isTabVisible = useVisibilityCheck();
  console.log("is tab visible", isTabVisible);

  return <S.Container></S.Container>;
}

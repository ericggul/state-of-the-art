import * as S from "./styles";

import { useMemo, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import useSocket from "@/utils/socket/on-off/useSocketMobile";

import useVisibilityCheck from "@/utils/hooks/useVisibilityCheck";

export default function El() {
  ////TO DO
  //to implement: React-use?

  const mobileId = useMemo(() => uuidv4(), []);

  const [requestVisibilityCheck, setRequestVisibilityCheck] = useState(false);
  const socket = useSocket({ mobileId, requestVisibilityCheckFromSocketInit: setRequestVisibilityCheck });

  const isTabVisible = useVisibilityCheck({ socket, mobileId, requestVisibilityCheck, setRequestVisibilityCheck });
  console.log("is tab visible", isTabVisible);

  return <S.Container></S.Container>;
}

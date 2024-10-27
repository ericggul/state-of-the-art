"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

//styling
import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

import useScreenStore from "@/components/screen/store";
import useSocketScreen from "@/utils/socket/useSocketScreen";

const AvatarWrapper = dynamic(() =>
  import("@/foundations/frontend/avatar/wrapper")
);

export default function RelationPage() {
  const { idx } = useParams();

  return <Container>{idx == "0" && <AvatarWrapper />}</Container>;
}

const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
`;

import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";
import { TIFFANY_BLUE, TIFFANY_BLUE_DARK } from "./utils/constants";

export const Container = styled.div`
  ${WholeContainer}
  display: flex;
  flex-direction: column;
  padding: 2vw;
  background: #000000;
  color: ${TIFFANY_BLUE};
`;

export const Header = styled.header`
  margin-bottom: 2vw;
`;

export const Title = styled.h1`
  font-size: 2.5vw;
  margin-bottom: 0.5vw;
  color: ${TIFFANY_BLUE};
  text-shadow: 0 0 10px ${TIFFANY_BLUE};
`;

export const Subtitle = styled.h2`
  font-size: 1.2vw;
  color: ${TIFFANY_BLUE_DARK};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25vw, 1fr));
  gap: 2vw;
`;

export const Card = styled.div`
  background: rgba(129, 216, 208, 0.1);
  border-radius: 10px;
  padding: 1.5vw;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(129, 216, 208, 0.2);
  border: 1px solid rgba(129, 216, 208, 0.1);
`;

export const CardTitle = styled.h3`
  font-size: 1.2vw;
  margin-bottom: 1vw;
  color: ${TIFFANY_BLUE};
  text-shadow: 0 0 5px ${TIFFANY_BLUE};
`;

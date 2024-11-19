import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2vw;
  padding: 1.5vw;
  background: rgba(255, 255, 255, 0.02);
  clip-path: polygon(
    0 0,
    calc(100% - 1vw) 0,
    100% 1vw,
    100% 100%,
    1vw 100%,
    0 calc(100% - 1vw)
  );
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vw;
`;

export const Title = styled.h4`
  font-size: 1.2vw;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
`;

export const PaperList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const PaperItem = styled.li`
  font-size: 0.9vw;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1vw;
  padding: 1vw;
  background: rgba(255, 255, 255, 0.05);
  clip-path: polygon(
    0 0,
    calc(100% - 0.5vw) 0,
    100% 0.5vw,
    100% 100%,
    0.5vw 100%,
    0 calc(100% - 0.5vw)
  );

  &:last-child {
    margin-bottom: 0;
  }
`;

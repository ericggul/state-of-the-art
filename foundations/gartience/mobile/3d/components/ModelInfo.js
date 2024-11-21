import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  font-family: "Inter", sans-serif;
  z-index: 10;
`;

const ModelName = styled.h2`
  font-size: 1.5rem;
  font-weight: 300;
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const ModelYear = styled.p`
  font-size: 0.9rem;
  opacity: 0.7;
  margin: 4px 0 0 0;
  font-weight: 200;
  letter-spacing: 1px;
`;

export default function ModelInfo({ name, year }) {
  return (
    <Container>
      <ModelName>{name || "Unknown Model"}</ModelName>
      <ModelYear>
        {year || "Year Unknown"} | Neural Networks Controlling the World
      </ModelYear>
    </Container>
  );
}

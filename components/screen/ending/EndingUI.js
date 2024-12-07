import * as S from "./styles";

export default function EndingUI({ isVisible, isFadingOut }) {
  return (
    <S.Container $isVisible={isVisible} $isFadingOut={isFadingOut}>
      <S.Content $isVisible={isVisible} $isFadingOut={isFadingOut}>
        <S.Title>SoTA</S.Title>
        <S.Subtitle>State-of-the-Art</S.Subtitle>

        <S.Section>
          <S.Text>Multi-Device Web Artwork</S.Text>
          <S.Text>4 displays, 2 Projections, 4 channel-sound</S.Text>
          <S.TechStack>
            Next.js, Three.js, Socket.io, OpenAI API, TouchDesigner
          </S.TechStack>
        </S.Section>

        <S.Section>
          <S.Institution>XD Lab (Experience Design Lab)</S.Institution>
          <S.InstitutionDepartment>
            Department of Industrial Design, KAIST
          </S.InstitutionDepartment>
          <S.Credit>
            Concept Design, Visualisation, Software Developer |{" "}
            <strong>Jeanyoon Choi</strong>
          </S.Credit>
          <S.Spacer />
          <S.Credit>
            Sound Design | <strong>Euan Kang</strong>
          </S.Credit>
          <S.Credit>
            Avatar Design | <strong>Sejoon Park</strong>
          </S.Credit>
          <S.Credit>
            UI Design | <strong>Minhyeok Seo</strong>
          </S.Credit>
          <S.Spacer />
          <S.Credit>
            Artistic Director, Advisor | <strong>Prof. Yiyun Kang</strong>
          </S.Credit>
        </S.Section>

        <S.Link
          href="http://www.xdlab.net"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.xdlab.net
        </S.Link>

        <S.EndText>The End</S.EndText>
      </S.Content>
    </S.Container>
  );
}

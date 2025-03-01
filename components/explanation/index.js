import * as S from "./styles";
import { memo, useEffect } from "react";
import Script from "next/script";

const IMG = "/images/icon.png";
const IMG2 = "/images/icon2.png";

function Explanation() {
  // Load Vimeo player script
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://player.vimeo.com/api/player.js";
  //   script.async = true;
  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  return (
    <S.Wrapper>
      <S.MainContainer>
        <S.Header>
          <S.Title>SoTA</S.Title>
          <S.Subtitle>State-of-the-Art</S.Subtitle>

          <S.InfoSection>
            <S.InfoText>
              Multi-Device Web Artwork, 2024
              <br />4 displays, 2 Projections, 4 channel-sound
            </S.InfoText>

            <S.ExhibitionInfo>
              KAIST Art Museum Opening Media Art Exhibition
              <br />
              Dec 17 2024 - Jun 30 2025
            </S.ExhibitionInfo>
            <S.ExhibitionInfo>
              KAIST 미술관 개관 미디어아트 기획전
              <br />
              2024.12.17 - 2025.6.30
            </S.ExhibitionInfo>
            <S.TechStack>
              Next.js, Three.js, Socket.io, OpenAI API, Claude 3.5, Langchain,
              TouchDesigner, Blender, Ableton Live, Viseme, D3.js
            </S.TechStack>
          </S.InfoSection>

          <S.CreditsSection
            onClick={() =>
              window.open(
                "http://www.xdlab.net",
                "_blank",
                "noopener,noreferrer"
              )
            }
            style={{ cursor: "pointer" }}
          >
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
          </S.CreditsSection>

          <S.VideoContainer>
            <S.VideoWrapper>
              <iframe
                src="https://player.vimeo.com/video/1061512520?h=862a6a902a&badge=0&autopause=0&player_id=0&app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                title="SoTA_MAS_V3"
              />
            </S.VideoWrapper>
          </S.VideoContainer>

          <S.LabLink
            href="http://www.xdlab.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.xdlab.net
          </S.LabLink>
        </S.Header>

        <S.ImageContainer>
          <S.ImageWrapper>
            <S.StyledImage src={IMG} alt="SoTA Visualization 1" />
          </S.ImageWrapper>
          <S.ImageWrapper>
            <S.StyledImage src={IMG2} alt="SoTA Visualization 2" />
          </S.ImageWrapper>
        </S.ImageContainer>

        <S.ContentContainer>
          <S.TextColumn>
            {stateOfTheArtText.en.map((paragraph, index) => (
              <S.TextWrapper key={`en-${index}`}>{paragraph}</S.TextWrapper>
            ))}
          </S.TextColumn>
          <S.TextColumn>
            {stateOfTheArtText.ko.map((paragraph, index) => (
              <S.TextWrapper key={`ko-${index}`}>{paragraph}</S.TextWrapper>
            ))}
          </S.TextColumn>
        </S.ContentContainer>
      </S.MainContainer>
    </S.Wrapper>
  );
}

export default memo(Explanation);

export const stateOfTheArtText = {
  ko: [
    "인공지능 연구에서 State-of-the-Art(이하 SoTA)는 기존의 모델들보다 퍼포먼스가 우수한, 거의 예술의 경지에 다다른 모델들을 일컫는다. 인간이 창조했지만 인간보다 더 뛰어난 인공적(Artificial | Künstliche) 창조물을 예술(Art | Kunst) 이라 일컫는것 보다 더 자연스러운 수식어도 없을 것이다. 그러나, 여기서 AI 연구자들이 일컫는 '예술'이란 난해한 현대예술이 아닌, 미켈란젤로나 티치아노처럼 절대적 아름다움을 추구하는 전통적인, 재현적인 예술을 의미할 터이다. 예컨대 SoTA의 이상향은 모더니즘 이전, 재현 중심의 고전 예술에 비견된다.",
    "그러나 최근 SoTA의 이상향이 점차 변하고 있는듯 하다. 종전에는 Convolution의 필터링 방식이나 Transformer의 Attention 메카니즘과 같이 뇌의 구조 혹은 논리의 구조에 영감을 얻어 AI 연구자가 직접 설계한 인공신경망 모델이 SoTA의 성과를 이룩했다면, 이제는 GPU 대량 학습에 의한, 규모의 경제에 의한 대량 훈련이 SoTA의 기록을 연일 갱신한다. 예컨대 리시 서튼(Rich Sutton)이 지적했듯, 인간 연구자의 재현적 설계 기법이 점차 무어의 법칙에 의존한 기계적 스케일링으로 대체되는 씁쓸한 교훈을 AI 연구자들은 마주하고 있다. 예컨대 사진 이후의 예술이 재현에서 추상으로 바뀌었듯, SoTA 또한 점차 재현의 영역에서 추상의 영역으로 전이되고 있다.",
    "1930년대 발터 벤야민(Walter Benjamin)이 기술복제시대의 새로운 미학을 제시했듯이, 2020년대 우리는 AI복제시대에 들어서며 SoTA의 새로운 기준을 마주한다. 기술복제시대 이후 조형예술이 모더니즘과 추상화의 계보를 따라 점차 '예술을 위한 예술(L'art pour l'art)' 로 나아갔듯, AI의 대량 생산도 'AI를 위한 AI(L'IA pour l'IA)'로 향할 가능성이 크다. 구글 전 CEO 에릭 슈미트(Eric Schmidt)가 경고한, 인간 이해할 수 없는 언어로 대화하는 LLM(Large Language Model | 대형 언어 모델) 에이전트 시대의 도래는 이를 뒷받침한다. SoTA는 점차 더 대형화되고 추상화되어, 인간의 손길을 떠난 채 스스로 진화해나갈 것이다. 이미 가장 뛰어난 AI가 SAT, IMO, 복잡한 코딩 작업에서 인간을 능가하고 있는 현시점에서, 더 뛰어난 AI가 등장할때 우리는 어떤 잣대로 SoTA를 평가하고 이해할 수 있을 것인가? 그 기준은 인간 지능의 영역을 넘어선 지점에 자리한다. SoTA는 점차 인간의 이해를 넘어, 미지의 추상적 영역으로 향하고 있다.",
    "벤야민 이후 20년, 서양 미술은 모더니즘과 추상 회화의 절정에 이르며 잭슨 폴록(Jackson Pollock)을 필두로 한 추상표현주의(Abstract Expressionism) 시대를 맞이했다. 당대 유력 평론가 그린버그(Clement Greenberg)는 모더니즘 회화의 핵심으로 캔버스의 물질적 평면성을 강조했고, 추상표현주의는 그 평면성을 극단으로 끌어올린 결과였다. 이처럼 모더니즘(Modernism)의 끝자락에 추상표현주의가 자리했다면, 연결주의(Connectionism)에 기반한 SoTA 인공신경망의 끝에는 수많은 선들이 무작위적으로 연결되는 추상적 표현이 자리잡지 않을까? 근래의 SoTA는 재현적인 아름다움이 아닌, 폴록의 액션페인팅과 같이 기계의 연결구조를 고도로 추상화한 형태를 지니지 않을까? 본 작품이 모더니즘-추상표현주의의 계보를 은유하여, 인공신경망 속 무수한 연결 구조를 시각화한 이유도 여기에 있다.",
    "추상표현주의 이후, 조형예술은 더 이상 캔버스 속 순수함만을 지향하지 않았다. 미니멀리즘, 팝아트, 포스트모더니즘으로 이어지는 계보는 세상과 관계하고 비판하는 새로운 예술의 가능성을 제시했다. 마찬가지로 AI가 극단의 추상성을 발현한 이후, 인간과 공존 가능한 AI를 상상해낼 수 있을까? 극도로 추상화된 대형 AI의 이후는 무엇일까? 그리고 그 길에서, 연결주의에 기반한 추상표현주의가 SoTA의 필연적 진화 과정일 것인가?",
    "본 멀티 디바이스 웹 작품 State--of-the-Art는 SoTA의 현재와 근미래를 재현 예술과 추상표현주의에 빗대어 은유한다. 관람객은 모바일폰을 통해 프로젝터 2대와 PC 4대로 구성된 갤러리 환경을 지휘하며, 118개의 SoTA 인공신경망 모델의 재현적 모습을 경험한다. 각 채널은 SoTA 모델의 재현적 3차원 구조, 작동 원리, 다른 모델들간의 관계 등을 제시한다. 관람객은 처음에는 이 재현적 아름다움을 이해하려 하지만, 휘몰아치는 SoTA들의 리스트와 수많은 AI 연구자들의 노고는 점차 관람객의 무관심과 지루함 속에서 잊혀진다.",
    "그러나 관람객이 모바일 인터랙션을 멈추고 갤러리를 떠나려는 순간, 모든 화면은 흑백 모노크롬으로 전환되며 LLM의 토큰 임베딩간* 관계를 추상적으로 시각화한 혼돈의 채널로 변모한다. 이는 재현적 아름다움에서 완전히 벗어나, 인공신경망의 무작위적 연결이 만들어내는 추상표현주의의 경지를 드러낸다. 관람객은 더 이상 SoTA를 이해할 수 없으며, 오로지 감각적으로 느껴질 수만 있는 거대한 추상의 소용돌이에 직면한다. 그리고 이것이 인간의 손을 떠나 추상화되고 있는, 인간이 알아들을 수 없는 언어로 끊임없이 대화하고 진화해나갈 SoTA 인공신경망의 근미래 모습이다.",
  ],
  en: [
    "In AI research, State-of-the-Art (SoTA) refers to models that outperform existing ones, reaching a level akin to art. Surely, describing an artificial (Künstliche) creation which surpasses its human creators as art (Kunst) should be an unsurprising metaphor. However, the 'art' that AI researchers refer to here might not be abstruse modern art, but rather, a traditional, representational art that pursues conventional beauty, much like Michelangelo or Titan. Thus, the idea of SoTA is comparable to the pre-modernist, representational classical art.",
    "However, this notion seems to have recently drastically changed. AI researchers used to achieve SoTA by directly designing artificial neural networks inspired by the brain's structure or logical frameworks - clearly, a representative approach, as could be signified within Convolutions and Attention Layers. Recently, however, the economies of scale achieved through massive GPU calculations renew SoTA records daily. As Rich Sutton pointed out in his 'Bitter Lesson', human-designed representational techniques are increasingly being replaced by mechanical scaling in line with Moore's Law. Just as art shifted from representation to abstraction after the advent of photography, SoTA is also transitioning from the realm of representation to that of abstraction.",
    "Back in the 1930s, Walter Benjamin depicted the aesthetical changes in art following the age of mechanical reproduction. Correspondingly, in the 2020s, as we enter the age of AI reproduction, we are confronting new characteristics of SoTA. After the era of mechanical reproduction, the visual arts progressed along the lineage of Modernism and abstraction, gradually advancing toward art for art's sake - L'art pour l'art. In parallel, with the mass production of AI, it is likely that Neural Networks will advance towards AI for AI's sake -  L'IA pour l'IA. Former Google CEO Eric Schmidt's warning - that Large Language Model (LLM) agents will soon communicate in their own language incomprehensible to humans - supports this trajectory towards self-referential abstraction. SoTA will become increasingly larger and more abstract, evolving autonomously beyond human intervention. When the most advanced AIs surpass the smartest humans in SAT, IMO, and complex coding tasks, how will we evaluate or even comprehend their performance? That standard lies beyond the realm of human intelligence's comprehension. SoTA is progressively moving beyond human capabilities, heading toward an unknown domain of abstraction.",
    "Twenty years after Benjamin, Western visual arts reached the pinnacle of Modernism and abstract art, ushering in the era of Abstract Expressionism, notably led by Jackson Pollock. An influential critic at the time, Clement Greenberg, emphasised the material flatness of the canvas as the core essence of Modernist painting, with Abstract Expressionism acting as a symbolic result of pushing that flatness to its extreme. Just as Abstract Expressionism was situated at the end of Modernism, might the culmination of SoTA artificial neural networks based on Connectionism be characterised by abstract expressions formed through interconnected lines? The SoTA of the near future will not embody representational beauty, but will assume abstract expressive forms - depicting their high-dimensional interconnectivity between vectorised tokens - akin to Pollock's action paintings. This is why this artwork metaphorically visualises the myriad connection structures within artificial neural networks, alluding to the lineage from Modernism to Abstract Expressionism.",
    "After the peak of Abstract Expressionism, the visual arts no longer aimed solely for purity within the canvas nor for the Art for Art's sake. Subsequent movements like Minimalism, Pop Art, and Postmodernism presented new possibilities for art that relates to and is situated within society. Similarly, after AI manifests its extreme abstraction, can we expect an AI that can coexist with humans to emerge? What will follow the era of extremely abstracted, large-scale AI? And following that path, is the extreme abstraction of neural network's evolutionary trajectory the inevitable process of SoTA?",
    "This multi-device web artwork, 'State-of-the-Art', metaphorically compares the present and near future of SoTA to representational art and Abstract Expressionism, correspondingly. Visitors interactively control a gallery environment consisting of two projectors and four PCs through their mobile phones, experiencing the representational appearances of 118 SoTA artificial neural network models. Each channel presents the representational 3D structures of SoTA models, their operating principles, and the rhizomatic relationships among different models. Initially, visitors strive to understand this representational beauty, but the whirlwind of SoTA lists and the efforts of countless AI researchers gradually fade into their indifference and boredom.",
    "However, the moment visitors cease mobile interaction and attempt to leave the gallery, all screens switch to black-and-white monochrome, transforming into chaotic channels that abstractly visualise the LLM's token embedding* cross-similarity. This departure from representational beauty reveals the realm of Abstract Expressionism created by the random connections within artificial neural networks. Visitors can no longer comprehend SoTA, confronting a vortex of immense abstraction that can only be sensorially perceived. This is the near-future visage of SoTA artificial neural networks - abstracted beyond human touch, continuously conversing and evolving in languages incomprehensible to humans.",
  ],
};

import * as S from "./styles";
import { Fragment, useState } from "react";
import useLogProbs from "@/foundations/test/3-output/utils/useLogProbsFiltered2";
import usePosCalc from "./usePosCalc";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

export default function Layer3({ newResponse }) {
  const logProbs = useLogProbs({ newResponse, filter: 0.02 });

  // Set isAnimating to true to randomize positions
  const { wordPosCalc } = usePosCalc({ logProbs, tokens: logProbs.map((el) => el.token), isAnimating: true, range: { x: [0, 1] } });

  const [showWords, setShowWords] = useState(new Array(logProbs.length).fill(""));

  return (
    <S.Container>
      <Tokens logProbs={logProbs} wordPosCalc={wordPosCalc} show={true} setShowWords={setShowWords} />
      <S.Sentence>{showWords.join(" ")}</S.Sentence>
    </S.Container>
  );
}

function Tokens({ logProbs, wordPosCalc, show, setShowWords }) {
  return (
    <S.Tokens
      style={{
        opacity: show ? 1 : 0,
      }}
    >
      {logProbs.map((token, i) => (
        <Token xIdx={i} key={i} token={token.token} logprobs={token.top_logprobs} wordPosCalc={wordPosCalc} setShowWords={setShowWords} />
      ))}
    </S.Tokens>
  );
}

function Token({ xIdx, token, logprobs, wordPosCalc, setShowWords }) {
  const [show, setShow] = useState(0);

  useRandomInterval(
    () => {
      const target = Math.floor(Math.random() * logprobs.length);
      setShow(target);
      setShowWords((prev) => {
        const newWords = [...prev];
        newWords[xIdx] = logprobs[target].token;
        return newWords;
      });
    },
    5,
    400
  );

  return (
    <Fragment>
      <S.Candidate
        style={{
          left: wordPosCalc(xIdx, -1)[0], // Only the X position is randomized
          top: wordPosCalc(xIdx, -1)[1], // Y position remains unchanged
        }}
      >
        {logprobs[show].token} | {logprobs[show].percentage.toFixed(2) + "%"}
      </S.Candidate>

      {logprobs
        .filter((_, idx) => idx !== show)
        // Random order
        .sort(() => Math.random() - 0.5)
        .map((target, yIdx) => (
          <S.Candidate
            style={{
              left: wordPosCalc(xIdx, yIdx)[0],
              top: wordPosCalc(xIdx, yIdx)[1],
              opacity: 0.5 - Math.abs(yIdx - logprobs.length / 2) * 0.05,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
            }}
            key={yIdx}
          >
            {target.token} | {target.percentage.toFixed(2) + "%"}
          </S.Candidate>
        ))}
    </Fragment>
  );
}

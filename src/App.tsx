import { useState } from "react";
import CharCanvas from "./CharCanvas";
import { HIRAGANA_STROKES, POKEMON_NAMES } from "./odai";
import "./styles.css";

export default function App() {
  const [output, setOutput] = useState("");
  const [debugOut, setDebugOut] = useState("");
  const [odai, setOdai] = useState("")

  function onInitMondai() {
    const newOdaiIndex = Math.floor(Math.random() * POKEMON_NAMES.length);
    setOdai(POKEMON_NAMES[newOdaiIndex]);
    setOutput("さあがんばろう！");
  }

  function onCharResult(resultText: string) {
    setOutput(resultText)
  }

  return (
    <div className="App">
      <h1>ひらがなのおけいこ</h1>
      <div>
        {odai.split("").map(char => (
          <CharCanvas
            odai={{char, strokes: HIRAGANA_STROKES[char]}}
            onResult={onCharResult}
          ></CharCanvas>
        ))}
      </div>
      <button onClick={onInitMondai}>もんだい</button>
      <div>{output}</div>
      <div style={{ display: "none" }}>{debugOut}</div>
    </div>
  );
}

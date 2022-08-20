import React, { useRef, useState } from "react";
import CharCanvas from "./CharCanvas";
import { countColors, convertTouchPos, getResultText } from "./lib";
import { ODAI_LIST } from "./odai";
import "./styles.css";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [output, setOutput] = useState("");
  const [modelPixelCount, setModelPixelCount] = useState(0);
  const [remainedStrokes, setRemainedStrokes] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [debugOut, setDebugOut] = useState("");
  const [odai, setOdai] = useState({ char: '', strokes: 0 })

  function onInitMondai() {
    if (!canvasRef.current) return;

    // 初期化
    const newOdai = Math.floor(Math.random() * ODAI_LIST.length);

    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    let ctx = canvasRef.current.getContext("2d");
    if (!ctx) {
      console.error('getContext("2d") returns null.')
      return;
    }
    // 塗りつぶす
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    // 文字を描く
    ctx.font = "200px 'Klee One'";
    ctx.fillStyle = "#eee";
    ctx.fillText(ODAI_LIST[newOdai].char, 50, 250);

    // グレーをカウント
    const colorCount = countColors(canvasRef.current);
    setModelPixelCount(colorCount.model);
    // console.log(colorCount.model);

    // ストローク数をリセット
    setRemainedStrokes(ODAI_LIST[newOdai].strokes);
    setOutput("さあがんばろう！");

    setOdai(ODAI_LIST[newOdai]);
  }

  function onTouchStart(ev: React.TouchEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) return;
    if (remainedStrokes <= 0) return;

    const newPos = convertTouchPos(ev.touches[0], canvasRef.current);
    setDebugOut(`onTouchStart: ${newPos.x}, ${newPos.y}`);
    setPos(newPos);
  }

  function onTouchMove(ev: React.TouchEvent<HTMLCanvasElement>) {
    if (remainedStrokes <= 0) return;
    if (!canvasRef.current) return;

    const newPos = convertTouchPos(ev.touches[0], canvasRef.current);

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) {
      console.error('getContext("2d") returns null.')
      return;
    }
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(newPos.x, newPos.y);
    ctx.stroke();

    setPos(newPos);
  }

  function onTouchEnd() {
    if (remainedStrokes <= 0) return;
    if (!canvasRef.current) return;

    setRemainedStrokes(remainedStrokes - 1);
    if (remainedStrokes === 1) {
      // 終わり
      const finalColorCount = countColors(canvasRef.current);
      const resultText = getResultText(modelPixelCount, finalColorCount);
      setOutput(resultText);
    }
  }

  return (
    <div className="App">
      <h1>ひらがなのおけいこ</h1>
      <div>
        <CharCanvas odai={odai}></CharCanvas>
        <canvas
          ref={canvasRef}
          width="300"
          height="300"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
      </div>
      <button onClick={onInitMondai}>もんだい</button>
      <div>{output}</div>
      <div style={{ display: "none" }}>{debugOut}</div>
    </div>
  );
}

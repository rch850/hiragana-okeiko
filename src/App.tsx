import React, { useRef, useState } from "react";
import { ODAI_LIST } from "./odai";
import "./styles.css";

/** Classes of pixel */
type PixelClass = 'model' | 'stroke' | 'other';

/** 位置計算 */
function getClientTouchPos(touch: React.Touch, el: Element) {
  const canvasRect = el.getBoundingClientRect();
  return {
    x: touch.clientX - canvasRect.x,
    y: touch.clientY - canvasRect.y
  };
}

/** Return class of a pixel. */
function classifyColor(imageData: ImageData, x: number, y: number): PixelClass {
  const r = imageData.data[(x + y * imageData.width) * 4];
  if (r < 250 && r >= 200) return 'model';
  if (r < 10) return 'stroke';
  return 'other';
}

/** Return numbers of pixels for each classes. */
function countColors(canvas: HTMLCanvasElement) {
  let count = { model: 0, stroke: 0 };
  const ctx = canvas.getContext("2d");
  if (!ctx) return count;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const color = classifyColor(imageData, x, y)
      if (color === 'model') count.model++;
      if (color === 'stroke') count.stroke++;
    }
  }
  return count;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [output, setOutput] = useState("");
  const [modelPixelCount, setModelPixelCount] = useState(0);
  const [remainedStrokes, setRemainedStrokes] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [debugOut, setDebugOut] = useState("");

  function onInitMondai() {
    if (!canvasRef.current) return;

    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;

    // 初期化
    const newOdai = Math.floor(Math.random() * ODAI_LIST.length);

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
  }

  function onTouchStart(ev: React.TouchEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) return;
    if (remainedStrokes <= 0) return;

    const newPos = getClientTouchPos(ev.touches[0], canvasRef.current);
    setDebugOut(`onTouchStart: ${newPos.x}, ${newPos.y}`);
    setPos(newPos);
  }

  function onTouchMove(ev: React.TouchEvent<HTMLCanvasElement>) {
    if (remainedStrokes <= 0) return;
    if (!canvasRef.current) return;

    const newPos = getClientTouchPos(ev.touches[0], canvasRef.current);

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
      const filledModelRate = finalColorCount.model / modelPixelCount;
      const strokeRate = finalColorCount.stroke / modelPixelCount;
      setDebugOut(`rate: ${filledModelRate}`);
      if (strokeRate >= 3.0) {
        setOutput("まっくろだよ！");
      } else if (filledModelRate <= 0.7) {
        setOutput("じょうずだね！");
      } else if (filledModelRate <= 0.9) {
        setOutput("やったね！");
      } else {
        setOutput("がんばったね！");
      }
    }
  }

  return (
    <div className="App">
      <h1>ひらがなのおけいこ</h1>
      <div>
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

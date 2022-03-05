import React, { useRef, useState } from "react";
import { ODAI_LIST } from "./odai";
import "./styles.css";

/** 位置計算 */
function getClientTouchPos(touch: React.Touch, el: Element) {
  const canvasRect = el.getBoundingClientRect();
  return {
    x: touch.clientX - canvasRect.x,
    y: touch.clientY - canvasRect.y
  };
}

/** ピクセルがグレーかどうかを返す */
function isGray(imageData: ImageData, x: number, y: number): boolean {
  const r = imageData.data[(x + y * imageData.width) * 4];
  return r < 250 && r >= 200;
}

/** グレーのピクセル数を返す */
function countGray(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let count = 0;
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      if (isGray(imageData, x, y)) count++;
    }
  }
  return count;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [output, setOutput] = useState("");
  const [grayCount, setGrayCount] = useState(0);
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
    const grayCount = countGray(canvasRef.current);
    setGrayCount(grayCount);
    // console.log(grayCount);

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
      const finalGrayCount = countGray(canvasRef.current);
      const rate = finalGrayCount / grayCount;
      setDebugOut(`rate: ${rate}`);
      if (rate <= 0.7) {
        setOutput("じょうずだね！");
      } else if (rate <= 0.9) {
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

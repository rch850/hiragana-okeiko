import { useEffect, useRef, useState } from "react";
import { convertTouchPos, countColors, getResultText } from "./lib";
import { Odai } from "./odai";

type CharCanvasProps = {
  /** お題 */
  odai: Odai
  /** 書き終わったときに呼び出される。 */
  onResult: (text: string) => void
}

export default function CharCanvas(props: CharCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [modelPixelCount, setModelPixelCount] = useState(0);
  const [remainedStrokes, setRemainedStrokes] = useState(props.odai.strokes);

  useEffect(() => {
    setRemainedStrokes(props.odai.strokes);

    if (canvasRef.current) {
      let ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // 塗りつぶす
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, 300, 300);
        // 文字を描く
        ctx.font = "200px 'Klee One'";
        ctx.fillStyle = "#eee";
        ctx.fillText(props.odai.char, 50, 250);
        // グレーをカウント
        setModelPixelCount(countColors(canvasRef.current).model);
      }
    }
  }, [props.odai.char])

  function onTouchStart(ev: React.TouchEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) {
      console.warn('canvasRef.current is falsy.')
      return
    }
    if (remainedStrokes <= 0) return;

    const newPos = convertTouchPos(ev.touches[0], canvasRef.current);
    setPos(newPos);
  }

  function onTouchMove(ev: React.TouchEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) {
      console.warn('canvasRef.current is falsy.')
      return
    }
    if (remainedStrokes <= 0) return;

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
    if (!canvasRef.current) {
      console.warn('canvasRef.current is falsy.')
      return
    }
    if (remainedStrokes <= 0) return;

    setRemainedStrokes(remainedStrokes - 1);
    if (remainedStrokes === 1) {
      // 終わり
      const finalColorCount = countColors(canvasRef.current);
      const resultText = getResultText(modelPixelCount, finalColorCount);
      props.onResult(resultText);
    }
  }

  return (
    <canvas
        ref={canvasRef}
        width="300"
        height="300"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
    />
  )
}
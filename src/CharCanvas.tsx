import { useRef, useState } from "react";
import { convertTouchPos } from "./lib";

export default function CharCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function onTouchStart(ev: React.TouchEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) {
      console.warn('canvasRef.current is falsy.')
      return
    }

    const newPos = convertTouchPos(ev.touches[0], canvasRef.current);
    setPos(newPos);
  }

  function onTouchMove(ev: React.TouchEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) {
      console.warn('canvasRef.current is falsy.')
      return
    }

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
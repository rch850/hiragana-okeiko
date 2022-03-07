/** Classes of pixel */
type PixelClass = 'model' | 'stroke' | 'other';

export type ColorCount = Record<Exclude<PixelClass, 'other'>, number>;

/** 位置計算 */
export function convertTouchPos(touch: React.Touch, el: Element) {
  const canvasRect = el.getBoundingClientRect();
  return {
    x: touch.clientX - canvasRect.x,
    y: touch.clientY - canvasRect.y
  };
}

/** Return numbers of pixels for each classes. */
export function countColors(canvas: HTMLCanvasElement): ColorCount {
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

/** Return class of a pixel. */
function classifyColor(imageData: ImageData, x: number, y: number): PixelClass {
  const r = imageData.data[(x + y * imageData.width) * 4];
  if (r < 250 && r >= 200)
    return 'model';
  if (r < 10)
    return 'stroke';
  return 'other';
}

export function getResultText(modelPixelCount: number, finalColorCount: ColorCount): string {
  const filledModelRate = finalColorCount.model / modelPixelCount;
  const strokeRate = finalColorCount.stroke / modelPixelCount;

  if (strokeRate >= 3.0) {
    return "まっくろだよ！";
  } else if (filledModelRate <= 0.7) {
    return "じょうずだね！";
  } else if (filledModelRate <= 0.9) {
    return "やったね！";
  } else {
    return "がんばったね！";
  }
}

// https://stackoverflow.com/a/49853392/1081774

export function preventDefault(e: Event) {
  // TODO: Improve scroll prevention
  // In some case, cancelable is false and it cannot disable scroll .
  // see: https://qiita.com/yusukeasari/items/a6433f47cdc6018a643f
  if (e.cancelable) {
    e.preventDefault();
  }
}

export function disableScroll() {
  document.body.addEventListener('touchmove', preventDefault, { passive: false });
}

export function enableScroll() {
  document.body.removeEventListener('touchmove', preventDefault);
}
// https://stackoverflow.com/a/49853392/1081774

export function preventDefault(e: Event) {
  e.preventDefault();
}

export function disableScroll() {
  document.body.addEventListener('touchmove', preventDefault, { passive: false });
}

export function enableScroll() {
  document.body.removeEventListener('touchmove', preventDefault);
}
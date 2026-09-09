export type VisibleShellBox = {
  top: number;
  height: number;
  pinToBottom: boolean;
};

/**
 * Geometry for pinning `#root` to the visible webview.
 *
 * Grok / in-app WKWebViews often report visualViewport.height shorter than
 * innerHeight with offsetTop === 0. Treat that leftover as a *top* inset and
 * stretch the shell to the layout bottom so the dock can sit on the visible
 * viewport bottom (dock-correct-bottom.png) instead of hanging mid-list.
 *
 * When offsetTop is a real inset and there is no leftover below the visual
 * viewport (Safari URL bar), size the shell to that band only.
 */
export function computeVisibleShellBox(input: {
  innerHeight: number;
  visualViewport?: { height: number; offsetTop: number; scale: number } | null;
}): VisibleShellBox {
  const inner = input.innerHeight || 0;
  const vv = input.visualViewport;
  const scale = vv?.scale ?? 1;
  let top = 0;
  let height = inner;
  let pinToBottom = true;

  if (vv && scale === 1 && vv.height > 0) {
    top = vv.offsetTop || 0;
    height = vv.height;
    const bottomGap = inner - top - height;
    if (top === 0 && inner > height + 1) {
      top = inner - height;
      pinToBottom = true;
    } else if (top > 0 && bottomGap <= 1) {
      pinToBottom = false;
    } else {
      pinToBottom = true;
    }
  }

  if (top < 0) {
    top = 0;
  }
  if (inner > 0 && top + height > inner) {
    height = Math.max(0, inner - top);
  }
  if (height <= 0 && inner > 0) {
    height = inner - top;
  }

  return { top, height, pinToBottom };
}

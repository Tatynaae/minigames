import './snackbar.scss';

type SnackbarVariant = 'success' | 'error';

const AUTO_DISMISS_MS = 4000;

let container: HTMLElement | null = null;
let dismissTimer: ReturnType<typeof setTimeout> | null = null;

function getContainer(): HTMLElement {
  if (!container) {
    container = document.createElement('div');
    container.className = 'snackbar';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  return container;
}

function hide(): void {
  const el = getContainer();
  el.classList.remove('snackbar--visible');
  if (dismissTimer !== null) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
  }
}

function iconFor(variant: SnackbarVariant): string {
  return variant === 'success' ? 'check_circle' : 'error';
}

export function showSnackbar(message: string, variant: SnackbarVariant): void {
  const el = getContainer();

  hide();

  el.classList.remove('snackbar--success', 'snackbar--error');
  el.classList.add(`snackbar--${variant}`);

  el.innerHTML = `
    <span class="material-symbols-outlined snackbar__icon" aria-hidden="true">${iconFor(variant)}</span>
    <span class="snackbar__message">${message}</span>
    <button type="button" class="snackbar__close" aria-label="Dismiss notification">
      <span class="material-symbols-outlined" aria-hidden="true">close</span>
    </button>
  `;

  el.querySelector('.snackbar__close')?.addEventListener('click', hide);

  requestAnimationFrame(() => {
    el.classList.add('snackbar--visible');
  });

  dismissTimer = setTimeout(hide, AUTO_DISMISS_MS);
}

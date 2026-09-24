import './auth-dialog.scss';
import { AUTH_OPEN_EVENT, type AuthMode } from '../header/header';
import googleIcon from '../../assets/icons/google-icon.svg';

interface FieldConfig {
  id: string;
  label: string;
  type: string;
  icon: string;
  placeholder: string;
  autocomplete: string;
  hasVisibilityToggle?: boolean;
}

interface PanelConfig {
  mode: AuthMode;
  title: string;
  subtitle: string;
  fields: FieldConfig[];
  ctaLabel: string;
  googleLabel: string;
  footerText: string;
  switchLabel: string;
  switchTarget: AuthMode;
  showForgotPassword?: boolean;
}

const LOGIN_PANEL: PanelConfig = {
  mode: 'login',
  title: 'Welcome Back!',
  subtitle: 'Sign in to resume your games and progress.',
  fields: [
    {
      id: 'login-email',
      label: 'Email Address',
      type: 'email',
      icon: 'mail',
      placeholder: 'e.g. alex@minigames.com',
      autocomplete: 'email',
    },
    {
      id: 'login-password',
      label: 'Password',
      type: 'password',
      icon: 'lock',
      placeholder: '••••••••',
      autocomplete: 'current-password',
      hasVisibilityToggle: true,
    },
  ],
  ctaLabel: 'Login',
  googleLabel: 'Continue with Google',
  footerText: "Don't have an account?",
  switchLabel: 'Register',
  switchTarget: 'register',
  showForgotPassword: true,
};

const REGISTER_PANEL: PanelConfig = {
  mode: 'register',
  title: 'Create Account',
  subtitle: 'Join MiniGames to track your score & streak.',
  fields: [
    {
      id: 'register-username',
      label: 'Username',
      type: 'text',
      icon: 'person',
      placeholder: 'e.g. CozyGamer_99',
      autocomplete: 'username',
    },
    {
      id: 'register-email',
      label: 'Email Address',
      type: 'email',
      icon: 'mail',
      placeholder: 'your.email@domain.com',
      autocomplete: 'email',
    },
    {
      id: 'register-password',
      label: 'Password',
      type: 'password',
      icon: 'lock',
      placeholder: 'Min. 8 characters',
      autocomplete: 'new-password',
      hasVisibilityToggle: true,
    },
    {
      id: 'register-confirm-password',
      label: 'Confirm Password',
      type: 'password',
      icon: 'lock',
      placeholder: 'Repeat your password',
      autocomplete: 'new-password',
      hasVisibilityToggle: true,
    },
  ],
  ctaLabel: 'Create Account',
  googleLabel: 'Sign up with Google',
  footerText: 'Already have an account?',
  switchLabel: 'Login',
  switchTarget: 'login',
};

function renderField(field: FieldConfig): string {
  return `
    <div class="auth-form__field">
      <label for="${field.id}" class="auth-form__label">${field.label}</label>
      <div class="auth-form__input-wrapper">
        <span class="material-symbols-outlined" aria-hidden="true">${field.icon}</span>
        <input
          type="${field.type}"
          id="${field.id}"
          name="${field.id}"
          class="auth-form__input"
          placeholder="${field.placeholder}"
          autocomplete="${field.autocomplete}"
          required
        />
        ${
          field.hasVisibilityToggle
            ? `
              <button type="button" class="auth-form__visibility-toggle" data-visibility-toggle aria-label="Show password">
                <span class="material-symbols-outlined" aria-hidden="true">visibility</span>
              </button>
            `
            : ''
        }
      </div>
    </div>
  `;
}

function renderPanel(config: PanelConfig): string {
  return `
    <section
      class="auth-dialog__panel-content"
      id="auth-panel-${config.mode}"
      role="tabpanel"
      aria-labelledby="auth-tab-${config.mode}"
      data-panel="${config.mode}"
      ${config.mode === 'register' ? 'hidden' : ''}
    >
      <header class="auth-dialog__header">
        <h2 class="auth-dialog__title" id="auth-dialog-title-${config.mode}">${config.title}</h2>
        <p class="auth-dialog__subtitle">${config.subtitle}</p>
      </header>

      <form class="auth-form" novalidate data-auth-form="${config.mode}">
        <div class="auth-form__fields">
          ${config.fields.map(renderField).join('')}

          ${
            config.showForgotPassword
              ? `
                <div class="auth-form__links-row">
                  <button type="button" class="auth-form__link">Forgot Password?</button>
                </div>
              `
              : ''
          }
        </div>

        <div class="auth-form__actions">
          <button type="submit" class="btn btn--cta">${config.ctaLabel}</button>
          <div class="auth-form__divider">
            <span></span>
            <span class="auth-form__divider-text">or</span>
            <span></span>
          </div>
          <button type="button" class="btn btn--google">
            <img src="${googleIcon}" alt="" class="auth-form__google-icon" />
            ${config.googleLabel}
          </button>
        </div>
      </form>

      <p class="auth-dialog__footer">
        ${config.footerText}
        <button type="button" class="auth-dialog__switch-link" data-switch-tab="${config.switchTarget}">
          ${config.switchLabel}
        </button>
      </p>
    </section>
  `;
}

export function createAuthDialog(): HTMLDialogElement {
  const dialog = document.createElement('dialog');
  dialog.className = 'auth-dialog';
  dialog.id = 'auth-dialog';
  dialog.innerHTML = `
    <div class="auth-dialog__panel">
      <div class="auth-dialog__tabs" role="tablist">
        <button
          type="button"
          class="auth-dialog__tab"
          role="tab"
          id="auth-tab-login"
          aria-controls="auth-panel-login"
          aria-selected="true"
          data-tab="login"
        >
          Login
        </button>
        <button
          type="button"
          class="auth-dialog__tab"
          role="tab"
          id="auth-tab-register"
          aria-controls="auth-panel-register"
          aria-selected="false"
          data-tab="register"
        >
          Register
        </button>
      </div>

      ${renderPanel(LOGIN_PANEL)}
      ${renderPanel(REGISTER_PANEL)}
    </div>
  `;

  initAuthDialogBehavior(dialog);

  return dialog;
}

function setActiveTab(dialog: HTMLDialogElement, mode: AuthMode): void {
  dialog.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((tab) => {
    tab.setAttribute('aria-selected', String(tab.dataset.tab === mode));
  });

  dialog.querySelectorAll<HTMLElement>('[data-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.panel !== mode;
  });
}

function initAuthDialogBehavior(dialog: HTMLDialogElement): void {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  dialog.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.tab as AuthMode;
      setActiveTab(dialog, mode);
    });
  });

  dialog.querySelectorAll<HTMLButtonElement>('[data-switch-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.switchTab as AuthMode;
      setActiveTab(dialog, mode);
    });
  });

  dialog.querySelectorAll<HTMLButtonElement>('[data-visibility-toggle]').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const input = toggle.previousElementSibling as HTMLInputElement | null;
      const icon = toggle.querySelector('.material-symbols-outlined');
      if (!input || !icon) {
        return;
      }
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      icon.textContent = isPassword ? 'visibility_off' : 'visibility';
      toggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });

  dialog.querySelectorAll<HTMLFormElement>('[data-auth-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      dialog.close();
    });
  });

  document.addEventListener(AUTH_OPEN_EVENT, ((event: CustomEvent<AuthMode>) => {
    setActiveTab(dialog, event.detail);
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  }) as EventListener);
}

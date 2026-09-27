import './developer-cta.scss';
import developerIllustration from '../../assets/images/game-developer.png';

export function createDeveloperCta(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'developer-cta';
  section.setAttribute('aria-label', 'For game developers');
  section.innerHTML = `
    <div class="developer-cta__illustration" aria-hidden="true"></div>

    <div class="developer-cta__card">
      <h2 class="developer-cta__title">Are You a Game Developer?</h2>
      <p class="developer-cta__description">
        Want to see your game on MiniGames? We're always looking for fun, engaging mini games to
        add to our platform. Submit your game and reach thousands of players!
      </p>
      <button type="button" class="btn btn--submit">
        <span class="material-symbols-outlined" aria-hidden="true">upload</span>
        Submit Form
      </button>
      <p class="developer-cta__contact">
        or contact us at <a href="mailto:developers@minigames.com">developers@minigames.com</a>
      </p>
    </div>
  `;

  const illustration = section.querySelector<HTMLElement>('.developer-cta__illustration');
  illustration?.style.setProperty('--developer-illustration', `url(${developerIllustration})`);

  return section;
}

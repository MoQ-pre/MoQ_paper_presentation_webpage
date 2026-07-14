const reservedLinks = {
  pdf: '',
  github: '',
  arxiv: '',
};

const linkNote = document.querySelector('.link-note');
document.querySelectorAll('.pending-link').forEach((link) => {
  const key = link.dataset.linkKey;
  if (reservedLinks[key]) link.href = reservedLinks[key];
  link.addEventListener('click', (event) => {
    if (reservedLinks[key]) return;
    event.preventDefault();
    if (linkNote) linkNote.textContent = `${key === 'github' ? 'Code' : key.toUpperCase()} is reserved for the final release.`;
  });
});

const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
menuButton?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? 'Close' : 'Menu';
});

document.querySelectorAll('.mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton) menuButton.textContent = 'Menu';
  });
});

const frameNumber = (number) => String(number).padStart(2, '0');
const ralFrames = (task, setting, view, sourceImages) => sourceImages.map(
  (sourceImage, index) => `assets/detection-frames/real/${task}/${setting}/${view}/frame-${frameNumber(index + 1)}-ral-image-${sourceImage}.png`,
);
const simFrames = (task, firstSourceImage, lastSourceImage, firstFrame = 1) => Array.from(
  { length: lastSourceImage - firstSourceImage + 1 },
  (_, index) => `assets/detection-frames/sim/${task}/frame-${frameNumber(firstFrame + index)}-source-${firstSourceImage + index}.png`,
);

const frameSets = {
  'task1-clean-head': ralFrames('task1', 'clean', 'head', [85, 87, 89, 91]),
  'task1-clean-right-wrist': ralFrames('task1', 'clean', 'right-wrist', [86, 88, 90, 92]),
  'task1-random-head': ralFrames('task1', 'random', 'head', [95, 97, 99, 101]),
  'task1-random-right-wrist': ralFrames('task1', 'random', 'right-wrist', [96, 98, 100, 102]),
  'task2-clean-head': ralFrames('task2', 'clean', 'head', [108, 111, 114, 117, 120]),
  'task2-clean-left-wrist': ralFrames('task2', 'clean', 'left-wrist', [109, 112, 115, 118, 121]),
  'task2-clean-right-wrist': ralFrames('task2', 'clean', 'right-wrist', [110, 113, 116, 119, 122]),
  'task3-clean-head': ralFrames('task3', 'clean', 'head', [123, 125, 127, 129]),
  'task3-clean-left-wrist': ralFrames('task3', 'clean', 'left-wrist', [124, 126, 128, 130]),
  'task3-random-head': ralFrames('task3', 'random', 'head', [133, 135, 137, 139]),
  'task3-random-left-wrist': ralFrames('task3', 'random', 'left-wrist', [134, 136, 138, 140]),
  'task4-clean-head': ralFrames('task4', 'clean', 'head', [145, 147, 149, 151]),
  'task4-clean-left-wrist': ralFrames('task4', 'clean', 'left-wrist', [146, 148, 150, 152]),
  'task4-random-head': ralFrames('task4', 'random', 'head', [153, 155, 157, 159]),
  'task4-random-left-wrist': ralFrames('task4', 'random', 'left-wrist', [154, 156, 158, 160]),
  'sim-hammer-clean': simFrames('hammer', 19, 23),
  'sim-hammer-random': simFrames('hammer', 24, 28, 6),
  'sim-stand-clean': simFrames('stand', 29, 34),
  'sim-stand-random': simFrames('stand', 35, 40, 7),
  'sim-basket-clean': simFrames('basket', 41, 49),
  'sim-basket-random': simFrames('basket', 50, 58, 10),
  'sim-phone-clean': simFrames('phone', 59, 63),
  'sim-phone-random': simFrames('phone', 64, 68, 6),
  'sim-plate-clean': simFrames('plate', 69, 74),
  'sim-plate-random': simFrames('plate', 75, 80, 7),
};

document.querySelectorAll('[data-frame-set]').forEach((strip) => {
  const frames = frameSets[strip.dataset.frameSet] || [];
  const description = strip.dataset.frameAlt || 'Detection';
  strip.style.setProperty('--frame-count', String(frames.length));
  frames.forEach((source, index) => {
    const button = document.createElement('button');
    button.className = 'sequence-zoom sequence-frame';
    button.type = 'button';
    button.setAttribute('aria-label', `Enlarge ${description} frame ${index + 1}`);
    button.setAttribute('aria-pressed', 'false');

    const image = document.createElement('img');
    image.src = source;
    image.alt = `${description} frame ${index + 1}`;
    image.loading = 'lazy';
    button.append(image);
    strip.append(button);
  });
});

document.querySelectorAll('.sequence-zoom').forEach((button) => {
  button.addEventListener('click', () => {
    const isZoomed = button.classList.toggle('is-zoomed');
    button.setAttribute('aria-pressed', String(isZoomed));
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('.sequence-zoom.is-zoomed').forEach((button) => {
    button.classList.remove('is-zoomed');
    button.setAttribute('aria-pressed', 'false');
  });
});

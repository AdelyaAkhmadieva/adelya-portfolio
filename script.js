// Превью и интерактивные HTML/CSS-макеты работ.
const WORKS = [
  { file: 'works/01-nike-preview.png', demo: 'demos/nike.html', name: { ru: 'Кроссовки', en: 'Sneakers' }, type: 'ui', brand: 'Nike' },
  { file: 'works/02-vision.svg', demo: 'demos/vision.html', name: { ru: 'Очки', en: 'Headset' }, type: 'ui', brand: 'Apple' },
  { file: 'works/03-drone.svg', demo: 'demos/drone.html', name: { ru: 'Дрон', en: 'Drone' }, type: 'card', brand: 'MDR' },
  { file: 'works/04-buds.svg', demo: 'demos/buds.html', name: { ru: 'Наушники', en: 'Earbuds' }, type: 'ux', brand: 'Samsung' },
  { file: 'works/05-dryer.svg', demo: 'demos/dryer.html', name: { ru: 'Фен', en: 'Hair dryer' }, type: 'card', brand: 'Whoosh' },
  { file: 'works/06-fitness-preview.png', demo: 'demos/fitness.html', name: { ru: 'Фитнес', en: 'Fitness' }, type: 'case', brand: 'Bexance' },
];

const TYPES = {
  ui:   { ru: 'Интерфейс',       en: 'Interface' },
  card: { ru: 'Карточка товара', en: 'Product card' },
  ux:   { ru: 'UX-исследование', en: 'UX study' },
  case: { ru: 'Кейс',            en: 'Case study' },
};

const I18N = {
  ru: {
    name: 'Аделя Ахмадиева',
    skip: 'К содержимому', discuss: 'Обсудить проект ↗', write: 'Написать мне', factWorks: 'избранных работ', factDesign: 'дизайн интерфейсов', factCode: 'от макета до кода', visualTag: 'Дизайн с характером', heroCaption: 'Веб-дизайнер. Разработчик. Преподаватель.', scroll: 'Листайте, чтобы познакомиться', selected: 'Избранное', aboutKicker: 'За каждым проектом — человек', skillsIntro: 'Всё, чтобы пройти путь от первого наброска до работающего интерфейса.', contactTitle: 'Ваш следующий проект начинается с «привет».',
    navWorks: 'Работы', navAbout: 'Обо мне', navSkills: 'Навыки', navContact: 'Контакты',
    kicker: 'Дизайн и веб-разработка',
    hero1: 'От идеи', hero2: 'до сайта,', hero3: 'который цепляет.',
    intro: 'Я — Аделя. Создаю интерфейсы и карточки товаров, в которых визуальный характер встречается с удобством.',
    cta: 'Смотреть работы',
    worksTitle: 'Избранные работы',
    worksHint: 'От карточки товара до интерфейса. Откройте любой проект и попробуйте его в действии.',
    worksHintTouch: 'Нажмите на любой проект, чтобы открыть и попробовать сайт.',
    aboutTitle: 'Привет, я Аделя.',
    aboutLead: 'Рисую макеты в Figma и верстаю их на HTML и CSS. Работаю в штате и на фрилансе, а ещё учу детей основам веб-разработки.',
    p1Title: 'В найме', p1Text: 'Интерфейсы и сайты в роли штатного специалиста.',
    p2Title: 'Фриланс', p2Text: 'Проекты для блогеров и экспертов.',
    p3Title: 'Преподаю', p3Text: 'Основы веб-разработки для детей.',
    skillsTitle: 'Мои инструменты',
    contactKicker: 'Давайте создадим что-то классное.',
    toTop: 'Наверх ↑',
    title: 'Аделя Ахмадиева — веб-дизайн и разработка',
  },
  en: {
    name: 'Adelya Akhmadieva',
    skip: 'Skip to content', discuss: 'Let’s talk ↗', write: 'Get in touch', factWorks: 'selected projects', factDesign: 'interface design', factCode: 'from design to code', visualTag: 'Design with character', heroCaption: 'Web designer. Developer. Teacher.', scroll: 'Scroll to get to know me', selected: 'Selected', aboutKicker: 'A person behind every project', skillsIntro: 'Everything needed to turn an early sketch into a working interface.', contactTitle: 'Your next project starts with hello.',
    navWorks: 'Works', navAbout: 'About', navSkills: 'Skills', navContact: 'Contact',
    kicker: 'Design & web development',
    hero1: 'From an idea', hero2: 'to a website', hero3: 'that connects.',
    intro: 'I’m Adelya. I create interfaces and product cards that bring visual character and usability together.',
    cta: 'Explore my work',
    worksTitle: 'Selected work',
    worksHint: 'From product cards to interfaces. Open any project and try it in action.',
    worksHintTouch: 'Tap any project to open and try the website.',
    aboutTitle: 'Hi, I’m Adelya.',
    aboutLead: 'I draw layouts in Figma and code them in HTML and CSS. I work both in-house and freelance, and I teach kids the basics of web development.',
    p1Title: 'In-house', p1Text: 'Interfaces and websites as a staff specialist.',
    p2Title: 'Freelance', p2Text: 'Projects for bloggers and experts.',
    p3Title: 'Teaching', p3Text: 'Web development basics for kids.',
    skillsTitle: 'My toolbox',
    contactKicker: 'Let’s create something great.',
    toTop: 'Back to top ↑',
    title: 'Adelya Akhmadieva — web design & development',
  },
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad = (n) => String(n).padStart(2, '0');
const $ = (s) => document.querySelector(s);

let lang = 'ru';
try { lang = localStorage.getItem('lang') === 'en' ? 'en' : 'ru'; } catch (e) {}

/* ---------- smooth scroll ---------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});

/* ---------- marquee ---------- */
function renderMarquee() {
  const words = ['Figma', 'HTML & CSS', 'UI/UX Design', 'JavaScript', 'Photoshop', 'Illustrator'];
  const row = words.concat(words).map((w) => `<span>${w} ·</span>`).join('');
  $('#marquee').innerHTML = row + row;
}

/* ---------- exhibits ---------- */
const track = $('#track');

function metaText(w) {
  return [TYPES[w.type][lang], w.brand].filter(Boolean).join(' · ');
}


function noPreviewHTML(w) {
  return `<span class="source-preview"><strong>${w.name[lang]}</strong><span>${lang === 'ru' ? 'Открыть интерактивный макет →' : 'Open interactive design →'}</span></span>`;
}
function renderWorks() {
  track.innerHTML = WORKS.map((w, i) => `
    <article class="exhibit reveal" role="group" aria-label="${i + 1} / ${WORKS.length}">
      <button class="exhibit__frame" type="button" data-index="${i}" aria-label="${w.name[lang]}">
        <span class="exhibit__topline"><span>${w.brand.toUpperCase()}</span><span>↗</span></span>
        <span class="exhibit__view">
          ${w.file ? `<img src="${w.file}" alt="${w.name[lang]} — ${TYPES[w.type][lang]}" loading="lazy">` : noPreviewHTML(w)}
        </span>
      </button>
      <div class="exhibit__label">
        <span class="exhibit__num">№ ${pad(i + 1)}</span>
        <h3 class="exhibit__name">${w.name[lang]}</h3>
        <p class="exhibit__meta">${metaText(w)}</p>
        <button class="exhibit__open" type="button" data-index="${i}">${lang === 'ru' ? 'Открыть сайт ↗' : 'Open website ↗'}</button>
      </div>
    </article>`).join('');
  track.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      const i = +img.closest('button').dataset.index;
      WORKS[i].missing = true;
      img.replaceWith(document.createRange().createContextualFragment(noPreviewHTML(WORKS[i])));
    });
  });
  track.querySelectorAll('.exhibit__frame, .exhibit__open').forEach((btn) => {
    btn.addEventListener('click', () => openLightbox(+btn.dataset.index));
  });
  observeReveals(track);
}

/* ---------- header ---------- */
const header = $('.header');
let lastY = 0;
function updateHeader() {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 10);
  header.classList.toggle('is-hidden', y > 200 && y > lastY && !lightboxOpen && !header.classList.contains('menu-open') && !header.contains(document.activeElement));
  lastY = y;
}

/* ---------- reveal ---------- */
const io = 'IntersectionObserver' in window && !reduceMotion
  ? new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' })
  : null;

if (io) document.documentElement.classList.add('js-motion');

function observeReveals(root = document) {
  root.querySelectorAll('.reveal:not(.is-in)').forEach((el) => {
    if (io) io.observe(el); else el.classList.add('is-in');
  });
}

/* ---------- lightbox ---------- */
const lb = $('#lightbox');
const lbBody = $('#lbBody');
let lbIndex = 0;
let lightboxOpen = false;
let lastFocus = null;

function fillLightbox() {
  const w = WORKS[lbIndex];
  $('#lbPrev').setAttribute('aria-label', lang === 'ru' ? 'Предыдущая работа' : 'Previous work');
  $('#lbNext').setAttribute('aria-label', lang === 'ru' ? 'Следующая работа' : 'Next work');
  $('#lbClose').setAttribute('aria-label', lang === 'ru' ? 'Закрыть' : 'Close');
  $('#lbNum').textContent = '№ ' + pad(lbIndex + 1);
  $('#lbTitle').textContent = w.name[lang];
  $('#lbMeta').textContent = metaText(w);
  lbBody.innerHTML = `<iframe class="project-preview" src="${w.demo}" title="${w.name[lang]} — ${lang === 'ru' ? 'интерактивный сайт' : 'interactive website'}"></iframe>`;
  lbBody.scrollTop = 0;
}

function openLightbox(i) {
  lbIndex = i;
  lastFocus = document.activeElement;
  fillLightbox();
  lb.hidden = false;
  lightboxOpen = true;
  document.body.style.overflow = 'hidden';
  document.querySelectorAll('.header, main, .footer').forEach((el) => el.inert = true);
  requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add('is-open')));
  $('#lbClose').focus();
}

function closeLightbox() {
  lb.classList.remove('is-open');
  lightboxOpen = false;
  document.body.style.overflow = '';
  document.querySelectorAll('.header, main, .footer').forEach((el) => el.inert = false);
  setTimeout(() => { if (!lightboxOpen) { lb.hidden = true; lbBody.innerHTML = ''; } }, reduceMotion ? 0 : 450);
  if (lastFocus) lastFocus.focus({ preventScroll: true });
}

function stepLightbox(d) {
  lbIndex = (lbIndex + d + WORKS.length) % WORKS.length;
  lb.classList.remove('is-open');
  fillLightbox();
  requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add('is-open')));
}

$('#lbClose').addEventListener('click', closeLightbox);
$('#lbPrev').addEventListener('click', () => stepLightbox(-1));
$('#lbNext').addEventListener('click', () => stepLightbox(1));
document.addEventListener('keydown', (e) => {
  if (!lightboxOpen) return;
  if (e.key === 'Tab') {
    const items = [...lb.querySelectorAll('button, a[href], iframe')];
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') stepLightbox(-1);
  if (e.key === 'ArrowRight') stepLightbox(1);
});

// Accept messages only from the currently displayed local project.
window.addEventListener('message', (event) => {
  const frame = lbBody.querySelector('iframe');
  if (!lightboxOpen || !frame || event.source !== frame.contentWindow) return;
  if (event.data?.type === 'adelya-demo-close') closeLightbox();
  if (event.data?.type === 'adelya-demo-controls') $(event.data.backwards ? '#lbClose' : '#lbPrev').focus();
});

/* ---------- language ---------- */
function applyLang(next) {
  lang = next;
  try { localStorage.setItem('lang', lang); } catch (e) {}
  document.documentElement.lang = lang;
  document.title = I18N[lang].title;
  document.querySelector('meta[name="description"]').content = lang === 'ru' ? 'Портфолио Адели Ахмадиевой: веб-дизайн, интерфейсы, карточки товаров и HTML/CSS-разработка.' : 'Adelya Akhmadieva’s portfolio: web design, interfaces, product cards and HTML/CSS development.';
  const toggle = $('.menu-toggle');
  toggle.setAttribute('aria-label', lang === 'ru' ? (toggle.getAttribute('aria-expanded') === 'true' ? 'Закрыть меню' : 'Открыть меню') : (toggle.getAttribute('aria-expanded') === 'true' ? 'Close menu' : 'Open menu'));
  $('.nav').setAttribute('aria-label', lang === 'ru' ? 'Основная навигация' : 'Main navigation');
  const touch = window.matchMedia('(hover: none)').matches;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = touch && el.dataset.i18n === 'worksHint' ? 'worksHintTouch' : el.dataset.i18n;
    const v = I18N[lang][key];
    if (v != null) el.textContent = v.replace('{n}', WORKS.length);
  });
  document.querySelectorAll('[data-lang]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });
  renderMarquee();
  renderWorks();

  if (lightboxOpen) fillLightbox();
}

document.querySelectorAll('[data-lang]').forEach((b) => {
  b.addEventListener('click', () => { if (b.dataset.lang !== lang) applyLang(b.dataset.lang); });
});

/* ---------- native scrolling ---------- */
window.addEventListener('scroll', updateHeader, { passive: true });

$('#year').textContent = new Date().getFullYear();
applyLang(lang);
observeReveals();
requestAnimationFrame(() => document.body.classList.add('is-loaded'));
updateHeader();
// Keep the current slide aligned after fonts load.


/* Mobile navigation stays available at every viewport size. */
const menuToggle = $('.menu-toggle');
function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', lang === 'ru' ? (open ? 'Закрыть меню' : 'Открыть меню') : (open ? 'Close menu' : 'Open menu'));
  header.classList.toggle('menu-open', open);
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
$('.nav').querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && header.classList.contains('menu-open')) { setMenu(false); menuToggle.focus(); } });
document.addEventListener('click', e => { if (!header.contains(e.target)) setMenu(false); });
document.querySelectorAll('.current-year').forEach(el => el.textContent = new Date().getFullYear());

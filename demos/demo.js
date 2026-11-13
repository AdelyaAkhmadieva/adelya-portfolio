'use strict';
const PROJECTS = {
  nike: { name: 'Nike Zoom', image: 'assets/nike-shoe-source.png', images: ['assets/nike-shoe-source.png', 'assets/nike-shoe-source.png'], about: 'Nike Zoom — технология амортизации, разработанная компанией Nike в конце 90-х годов. Упругие волокна внутри воздушной камеры сжимаются при нагрузке и возвращаются в исходное положение.', options: ['36', '37', '38', '39', '40', '41', '42', '43'], optionLabel: 'Размер EU' },
  vision: { name: 'Apple Vision Pro', image: 'assets/vision.png', images: ['assets/vision.png', 'assets/vision.png', 'assets/vision.png'], about: 'Apple Vision Pro объединяет виртуальную и дополненную реальность. Пространственный интерфейс позволяет работать, смотреть контент и общаться в иммерсивной среде.', options: ['Solo Knit Band', 'Dual Loop Band'], optionLabel: 'Крепление' },
  drone: { name: 'MDR ULTRA LIGHT', image: 'assets/drone.png', images: ['assets/drone.png', 'assets/drone-detail-1.jpg', 'assets/drone-detail-2.jpg'], about: 'MDR — концепция сайта о дронах. Лаконичная подача, тёмный фон и крупные изображения помогают сосредоточиться на конструкции. В каталоге можно переключать модели и рассматривать детали.', options: ['MDR HEAVY', 'MDR ULTRA LIGHT', 'MDR SUPERFAST'], optionLabel: 'Модель' },
  buds: { name: 'Samsung Headphones', image: 'assets/buds-case.png', images: ['assets/buds-case.png', 'assets/buds-gallery.png', 'assets/buds-single.png'], about: 'Беспроводные наушники Samsung в бронзовом корпусе. Компактный зарядный кейс, анатомичная форма и музыка, которая всегда с вами.', options: ['Наушники с кейсом', 'Подарочный комплект'], optionLabel: 'Комплект' },
  dryer: { name: 'Whoosh', image: 'assets/dryer.png', images: ['assets/dryer.png'], about: 'Лёгкий, мощный и минималистичный — Whoosh создан для тех, кто ценит форму и функциональность. Турбинная технология и продуманная эргономика помогают быстро сушить волосы.', options: ['Стандартный', 'С дорожным чехлом'], optionLabel: 'Комплект' },
  fitness: { name: 'X’Flow Gym', image: 'assets/fitness.png', images: ['assets/fitness.png'], about: 'Стильный фитнес-клуб, где традиция встречается с современностью.' }
};
const key = document.body.dataset.project;
const project = PROJECTS[key];
const $ = (selector) => document.querySelector(selector);
const dialog = $('#demoDialog');
const dialogBody = $('#dialogBody');
const DEMO_NOTE = 'Демонстрация интерфейса: оплата не производится, данные никуда не отправляются.';
let cart = [];
let favorite = false;
let slide = 0;
let model = 1;
let selectedOption = project.options?.[0] || '';
let selectedDirection = 'Персональная тренировка';
let galleryIndex = 0;
let toastTimer;
let opener = null;
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
try {
  const stored = JSON.parse(sessionStorage.getItem('adelya-demo-' + key) || '{}');
  if (Array.isArray(stored.cart)) cart = stored.cart.filter(item => project.options?.includes(item.option) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99);
  favorite = stored.favorite === true;
} catch (_) {}
function save() {
  try { sessionStorage.setItem('adelya-demo-' + key, JSON.stringify({cart, favorite})); } catch (_) {}
  document.querySelectorAll('.cart-count').forEach(el => { el.textContent = cart.reduce((n, item) => n + item.quantity, 0); });
  document.querySelectorAll('[data-action="favorite"]').forEach(el => {
    el.setAttribute('aria-pressed', String(favorite));
    el.setAttribute('aria-label', favorite ? 'Убрать из избранного' : 'Добавить в избранное');
    el.textContent = favorite ? '♥' : '♡';
  });
}
function toast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 3000);
}
function showDialog(title, body) {
  if (!dialog.open) opener = document.activeElement;
  $('#dialogTitle').textContent = title;
  dialogBody.innerHTML = body;
  if (!dialog.open) dialog.showModal();
  else $('.dialog-close').focus();
}
function closeDialog() { dialog.close(); }
dialog.addEventListener('close', () => { if (opener?.isConnected) opener.focus({preventScroll:true}); });
dialog.addEventListener('click', e => {
  if (e.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog();
});
function summaryHTML() {
  const title = key === 'drone' ? project.options[model] : project.name;
  return `<div class="product-summary"><img src="${project.image}" alt="${title}"><div><h3>${title}</h3><p class="dialog-copy">${key === 'drone' ? 'Предзаказ модели' : 'Выберите вариант'} · демонстрация</p></div></div>`;
}
function buy() {
  if (key === 'fitness') return booking();
  selectedOption = key === 'drone' ? project.options[model] : project.options[0];
  showDialog(key === 'drone' ? 'Оформить предзаказ' : 'Выбрать товар', summaryHTML() +
    `<span class="choice-label">${project.optionLabel}</span><div class="option-row" role="group" aria-label="${project.optionLabel}">${project.options.map(option => `<button class="option" data-action="option" data-option="${option}" aria-pressed="${option === selectedOption}">${option}</button>`).join('')}</div><div class="dialog-actions"><button class="dialog-action dialog-primary" data-action="add">Добавить в корзину</button><button class="dialog-action" data-action="close">Продолжить просмотр</button></div><p class="dialog-note">${DEMO_NOTE}</p>`);
}
function addToCart() {
  const item = cart.find(item => item.option === selectedOption);
  if (item) item.quantity = Math.min(99, item.quantity + 1);
  else cart.push({option:selectedOption, quantity:1});
  save();
  showDialog('Добавлено в корзину', `<p class="dialog-copy">${project.name} · ${escapeHTML(selectedOption)}</p><div class="dialog-actions"><button class="dialog-action dialog-primary" data-action="cart">Открыть корзину</button><button class="dialog-action" data-action="close">Продолжить просмотр</button></div>`);
  toast('Товар добавлен в корзину');
}
function showCart() {
  showDialog('Корзина', cart.length ? cart.map((item, i) => `<div class="cart-row"><img src="${project.image}" alt=""><div><h3>${project.name}</h3><p>${escapeHTML(item.option)}</p><div class="cart-controls"><button data-action="quantity" data-index="${i}" data-delta="-1" aria-label="Уменьшить количество">−</button><span>${item.quantity}</span><button data-action="quantity" data-index="${i}" data-delta="1" aria-label="Увеличить количество" ${item.quantity >= 99 ? 'disabled' : ''}>+</button><button class="remove" data-action="remove" data-index="${i}">Удалить</button></div></div></div>`).join('') + `<div class="dialog-actions"><button class="dialog-action dialog-primary" data-action="checkout">Оформить заказ</button><button class="dialog-action" data-action="catalog">К товарам</button></div><p class="dialog-note">${DEMO_NOTE}</p>` : `<p class="dialog-copy">Здесь пока пусто. Выберите товар и добавьте его в корзину.</p><div class="dialog-actions"><button class="dialog-action dialog-primary" data-action="buy">Выбрать товар</button></div>`);
}
function checkout() {
  if (!cart.length) return showCart();
  const quantity = cart.reduce((n, item) => n + item.quantity, 0);
  cart = []; save();
  showDialog('Заказ собран', `<div class="success-mark" aria-hidden="true">✓</div><p class="dialog-copy">В демонстрационном заказе: ${quantity} шт.</p><p class="dialog-note">${DEMO_NOTE}</p><div class="dialog-actions"><button class="dialog-action dialog-primary" data-action="close">Вернуться к макету</button></div>`);
}
function catalog() {
  const entries = key === 'drone' ? project.options : [project.name];
  showDialog(key === 'nike' ? 'Collections' : 'Каталог', `<div class="catalog-list">${entries.map((name, index) => `<button class="catalog-item" data-action="catalog-select" data-model="${index}"><img src="${project.image}" alt=""><div><strong>${name}</strong><span>Выбрать вариант →</span></div></button>`).join('')}</div>`);
}
function gallery() {
  galleryIndex = slide;
  showGallery();
}
function galleryStyle(index) {
  if (key === 'nike') return ['transform:scale(var(--nike-shot-scale,1.05));','transform:scale(var(--nike-shot-detail-scale,1.3));'][index];
  if (key === 'vision') return ['','transform:scale(1.25);object-position:left;','transform:scale(1.5);object-position:right;'][index];
  return '';
}
function showGallery() {
  const labels = key === 'nike' ? ['Общий вид', 'Приближение'] : key === 'vision' ? ['Общий вид', 'Оптика и корпус', 'Крепление'] : ['Общий вид', 'Детали', 'Крупный план'];
  showDialog(key === 'nike' ? 'Shots · Nike Zoom' : 'Галерея · ' + project.name, `<div class="gallery-stage" style="overflow:hidden;border-radius:16px"><img class="gallery-photo" src="${project.images[galleryIndex]}" alt="${project.name} — ${labels[galleryIndex]}" style="${galleryStyle(galleryIndex)}"></div><div class="gallery-controls"><button data-action="gallery-prev" aria-label="Предыдущее изображение">←</button><span>${labels[galleryIndex]} · ${galleryIndex + 1} / ${project.images.length}</span><button data-action="gallery-next" aria-label="Следующее изображение">→</button></div><div class="gallery-choices">${project.images.map((_, i) => `<button data-action="gallery-page" data-page="${i}" aria-label="Изображение ${i + 1}" aria-pressed="${i === galleryIndex}"></button>`).join('')}</div><div class="dialog-actions"><button class="dialog-action" data-action="buy">${key === 'drone' ? 'Предзаказ' : 'Выбрать товар'}</button></div>`);
}
function setModel(index) {
  model = (index + project.options.length) % project.options.length;
  const parts = [['MDR', 'HEAVY'], ['MDR ULTRA', 'LIGHT'], ['MDR', 'SUPERFAST']][model];
  $('[data-model-title]').innerHTML = `${parts[0]} <span>${parts[1]}</span>`;
  $('[data-model-copy]').textContent = ['Масштаб для больших идей', 'Быстрее, легче, эффективнее', 'Движение без границ'][model];
  document.querySelectorAll('[data-action="model"]').forEach(el => el.setAttribute('aria-pressed', String(+el.dataset.model === model)));
  $('.drone-hero').style.backgroundImage = `url('${project.images[model === 1 ? 0 : model === 0 ? 1 : 2]}')`;
}
function changeSlide(delta) {
  if (key === 'drone') return setModel(model + delta);
  slide = (slide + delta + project.images.length) % project.images.length;
  document.querySelectorAll('[data-slide-label]').forEach(el => el.textContent = `0${slide + 1} / 0${project.images.length}`);
  if (key === 'buds') {
    const img = $('.main-product'); img.src = project.images[slide];
    img.alt = ['Наушники Samsung в кейсе', 'Наушники Samsung с двух сторон', 'Наушник Samsung крупным планом'][slide];
  }
  if (key === 'vision') $('.vision-product').style.transform = ['none','translateX(-4%) scale(1.08)','translateX(4%) scale(.9)'][slide];
  if (key === 'nike') $('.nike-product').style.setProperty('--shoe-zoom', ['1', '1.16'][slide]);
}
function detail(name) {
  const details = {
    cushion: ['Амбушюра', 'Мягкая посадка вокруг глаз. Сменная накладка помогает адаптировать гарнитуру и сделать ношение комфортнее.'],
    speaker: ['Динамики', 'Встроенные динамики расположены рядом с ушами. Звук остаётся частью пространства, а гарнитура — частью вашего окружения.'],
    charge: ['Зарядка', 'Внешний аккумулятор подключается к гарнитуре отдельным кабелем. В галерее можно рассмотреть конструкцию устройства.'],
    motor: ['Турбинная технология', 'Компактная турбина создаёт направленный воздушный поток. Это центральный элемент концепции Whoosh.'],
    air: ['Направленный поток', 'Воздух проходит через корпус и выходит направленной струёй, помогая сушить и укладывать волосы.'],
    control: ['Управление под рукой', 'Контрастные переключатели находятся на ручке. Форма корпуса помогает удобно держать фен во время укладки.']
  };
  const content = details[name];
  if (!content) return;
  showDialog(content[0], `<p class="dialog-copy">${content[1]}</p><div class="dialog-actions"><button class="dialog-action dialog-primary" data-action="buy">Выбрать товар</button><button class="dialog-action" data-action="close">Понятно</button></div>`);
}
function about() {
  showDialog(key === 'drone' || key === 'dryer' ? 'О проекте' : 'About · ' + project.name, `<div class="product-summary"><img src="${project.image}" alt=""><p class="dialog-copy">${project.about}</p></div><div class="dialog-actions"><button class="dialog-action dialog-primary" data-action="${key === 'fitness' ? 'booking' : 'gallery'}">${key === 'fitness' ? 'Записаться' : 'Рассмотреть ближе'}</button></div>`);
}
function contact() {
  showDialog('Контакты', '<p class="dialog-copy">Дизайн и верстка: Аделя Ахмадиева.</p><div class="dialog-actions"><a class="dialog-action" href="mailto:adelya0803@list.ru">Написать на почту</a><a class="dialog-action" href="https://t.me/akh_ar" target="_blank" rel="noopener noreferrer">Telegram ↗</a></div>');
}
function favorites() {
  showDialog('Избранное', favorite ? `<div class="catalog-list"><button class="catalog-item" data-action="buy"><img src="${project.image}" alt=""><div><strong>${project.name}</strong><span>Выбрать комплект →</span></div></button></div><div class="dialog-actions"><button class="dialog-action" data-action="favorite">Убрать из избранного</button></div>` : '<p class="dialog-copy">Пока пусто. Нажмите на сердечко рядом с товаром, чтобы сохранить его.</p><div class="dialog-actions"><button class="dialog-action" data-action="close">К товару</button></div>');
}
const directions = {
  'Персональная тренировка': 'Индивидуальное занятие с тренером: знакомство, определение целей и подбор упражнений под ваш уровень подготовки.',
  'Силовые тренировки': 'Работа с собственным весом и оборудованием. Тренер поможет освоить технику и выбрать подходящую нагрузку.',
  'Йога и растяжка': 'Спокойная практика для развития гибкости, подвижности и внимания к своему телу.',
  'Функциональный тренинг': 'Разнообразные упражнения на силу, координацию и выносливость в небольших группах.'
};
function showDirections() {
  showDialog('Направления', `<div class="direction-list">${Object.entries(directions).map(([name, copy]) => `<button data-action="direction" data-direction="${name}">${name}<span>${copy}</span></button>`).join('')}</div>`);
}
function booking() {
  showDialog('Первая тренировка', `<p class="dialog-copy" style="margin-bottom:20px">Выберите направление и удобное время знакомства с клубом.</p><form class="booking-form" id="bookingForm"><label>Ваше имя<input name="name" autocomplete="given-name" required minlength="2" maxlength="60" placeholder="Как к вам обращаться?"></label><label>Телефон<input name="phone" type="tel" autocomplete="tel" inputmode="tel" required minlength="10" maxlength="24" placeholder="+7 (999) 123-45-67"></label><label>Направление<select name="direction">${Object.keys(directions).map(name => `<option ${name === selectedDirection ? 'selected' : ''}>${name}</option>`).join('')}</select></label><label>Удобное время<select name="time"><option>Утро · 08:00–12:00</option><option>День · 12:00–17:00</option><option>Вечер · 17:00–21:00</option></select></label><button class="dialog-action dialog-primary" type="submit">Записаться на тренировку →</button><p class="dialog-note">${DEMO_NOTE}</p></form>`);
}
function clubInfo(action) {
  if (action === 'reviews') showDialog('Комфорт в каждой тренировке', '<p class="dialog-copy">95% довольных клиентов — показатель из концепции макета. Попробуйте персональную тренировку, познакомьтесь с тренером и выберите свой ритм.</p><div class="dialog-actions"><button class="dialog-action dialog-primary" data-action="booking">Попробовать тренировку</button></div>');
  if (action === 'equipment') showDialog('Оборудование клуба', '<p class="dialog-copy">В концепции клуба — зоны силовых и функциональных тренировок, кардиозона и пространство для растяжки. Выберите направление, чтобы узнать больше.</p><div class="dialog-actions"><button class="dialog-action dialog-primary" data-action="directions">Выбрать направление</button></div>');
  if (action === 'tour') showDialog('Знакомство с X’Flow', `<img class="tour-image" src="assets/fitness.png" alt="Пространство X’Flow Gym"><p class="dialog-copy" style="margin-top:18px">Яркое пространство для движения, силы и восстановления. Посмотрите направления и запишитесь на первое занятие.</p><div class="dialog-actions"><button class="dialog-action dialog-primary" data-action="directions">Направления</button><button class="dialog-action" data-action="booking">Записаться</button></div>`);
}
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button || button.disabled) return;
  const action = button.dataset.action;
  switch (action) {
    case 'home': if (dialog.open) closeDialog(); window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}); toast('Главный экран · ' + project.name); break;
    case 'close': closeDialog(); break;
    case 'buy': buy(); break;
    case 'option': selectedOption = button.dataset.option; dialogBody.querySelectorAll('.option').forEach(el => el.setAttribute('aria-pressed', String(el === button))); break;
    case 'add': addToCart(); break;
    case 'cart': showCart(); break;
    case 'quantity': { const item = cart[+button.dataset.index]; if (!item) break; item.quantity = Math.min(99,item.quantity + +button.dataset.delta); cart = cart.filter(item => item.quantity > 0); save(); showCart(); break; }
    case 'remove': cart.splice(+button.dataset.index, 1); save(); showCart(); break;
    case 'checkout': checkout(); break;
    case 'catalog': catalog(); break;
    case 'catalog-select': if (key === 'drone') setModel(+button.dataset.model); buy(); break;
    case 'gallery': gallery(); break;
    case 'gallery-prev': galleryIndex = (galleryIndex + project.images.length - 1) % project.images.length; showGallery(); break;
    case 'gallery-next': galleryIndex = (galleryIndex + 1) % project.images.length; showGallery(); break;
    case 'gallery-page': galleryIndex = +button.dataset.page; showGallery(); break;
    case 'previous': changeSlide(-1); break;
    case 'next': changeSlide(1); break;
    case 'model': setModel(+button.dataset.model); break;
    case 'detail': detail(button.dataset.detail); break;
    case 'about': about(); break;
    case 'contact': contact(); break;
    case 'favorite': favorite = !favorite; save(); if (dialog.open) favorites(); else toast(favorite ? 'Добавлено в избранное' : 'Удалено из избранного'); break;
    case 'favorites': favorites(); break;
    case 'product': showDialog(button.dataset.product, `<p class="dialog-copy">Вы выбрали ${escapeHTML(button.dataset.product)}. В этой коллекции представлен макет Apple Vision Pro.</p><div class="dialog-actions"><button class="dialog-action dialog-primary" data-action="buy">Выбрать Vision Pro</button><button class="dialog-action" data-action="close">Вернуться</button></div>`); break;
    case 'directions': showDirections(); break;
    case 'direction': selectedDirection = button.dataset.direction; showDialog(selectedDirection, `<p class="dialog-copy">${directions[selectedDirection]}</p><div class="dialog-actions"><button class="dialog-action dialog-primary" data-action="booking">Записаться</button><button class="dialog-action" data-action="directions">Все направления</button></div>`); break;
    case 'booking': booking(); break;
    case 'reviews': case 'equipment': case 'tour': clubInfo(action); break;
  }
});
document.addEventListener('submit', (event) => {
  if (event.target.id !== 'bookingForm') return;
  event.preventDefault();
  const form = event.target;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  if (!/^[+\d\s()\-]+$/.test(String(data.get('phone'))) || String(data.get('phone')).replace(/\D/g,'').length < 10 || String(data.get('phone')).replace(/\D/g,'').length > 15) {
    form.elements.phone.setCustomValidity('Введите телефон: от 10 до 15 цифр, без букв.');
    form.elements.phone.reportValidity();
    form.elements.phone.addEventListener('input', () => form.elements.phone.setCustomValidity(''), {once:true});
    return;
  }
  const name = String(data.get('name')).trim();
  if (name.length < 2) { form.elements.name.setCustomValidity('Введите имя.'); form.elements.name.reportValidity(); form.elements.name.addEventListener('input', () => form.elements.name.setCustomValidity(''), {once:true}); return; }
  showDialog('Вы выбрали тренировку', `<div class="success-mark" aria-hidden="true">✓</div><p class="dialog-copy">${escapeHTML(name)}, ваше направление: <strong>${escapeHTML(data.get('direction'))}</strong>.</p><p class="dialog-copy">${escapeHTML(data.get('time'))}.</p><p class="dialog-note">${DEMO_NOTE}</p><div class="dialog-actions"><button class="dialog-action dialog-primary" data-action="close">Вернуться в клуб</button></div>`);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !dialog.open && window.parent !== window) window.parent.postMessage({type:'adelya-demo-close'}, '*');
  if (event.key === 'Tab' && !dialog.open && window.parent !== window) {
    const items = [...document.querySelectorAll('body > header button, main button')].filter(el => !el.disabled && el.getClientRects().length);
    if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); window.parent.postMessage({type:'adelya-demo-controls', backwards:true}, '*'); }
    else if (!event.shiftKey && document.activeElement === items[items.length-1]) { event.preventDefault(); window.parent.postMessage({type:'adelya-demo-controls', backwards:false}, '*'); }
  }
});
save();

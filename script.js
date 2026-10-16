const intro = document.querySelector('.intro');
const doors = document.querySelector('.doors');
const start = document.querySelector('.start');
const toggle = document.querySelector('.toggle');
const menu = document.querySelector('.menu');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');
const speed = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.2 : 1;
let running = false;
let lastButton = null;

function wait(time) {
  return new Promise(function (done) {
    setTimeout(done, time * speed);
  });
}

function addDust() {
  for (let i = 0; i < 16; i++) {
    const dust = document.createElement('span');
    const size = 2 + Math.random() * 3;
    dust.className = 'dust';
    dust.style.cssText = 'left:' + Math.random() * 100 + '%;bottom:' + Math.random() * 40 + '%;width:' + size + 'px;height:' + size + 'px;--t:' + (4 + Math.random() * 3) + 's;--d:' + Math.random() * 2 + 's';
    doors.appendChild(dust);
  }
}

async function play() {
  if (running) return;
  running = true;
  start.disabled = true;
  intro.classList.add('running');
  await wait(2100);
  intro.classList.add('turning');
  await wait(1400);
  intro.classList.add('open');
  await wait(2600);
  intro.classList.add('exit');
  await wait(1400);
  intro.remove();
  document.body.classList.remove('locked');
  document.body.classList.add('ready');
}

function setMenu(open) {
  menu.classList.toggle('show', open);
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

function openModal(card, button) {
  modal.querySelector('.art').innerHTML = card.querySelector('.art').innerHTML;
  modal.querySelector('h3').textContent = card.querySelector('h3').textContent;
  modal.querySelector('.short').textContent = card.querySelector('.text').textContent;
  modal.querySelector('.more').textContent = card.dataset.more;
  lastButton = button;
  modal.classList.add('show');
  close.focus();
}

function closeModal() {
  modal.classList.remove('show');
  if (lastButton) lastButton.focus();
}

addDust();
start.addEventListener('click', play);
toggle.addEventListener('click', function () {
  setMenu(!menu.classList.contains('show'));
});
menu.addEventListener('click', function (event) {
  if (event.target.closest('a')) setMenu(false);
});

document.querySelectorAll('.card .button').forEach(function (button) {
  button.addEventListener('click', function () {
    openModal(button.closest('.card'), button);
  });
});

close.addEventListener('click', closeModal);
modal.addEventListener('click', function (event) {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeModal();
    setMenu(false);
  }
});

const watcher = new IntersectionObserver(function (items) {
  items.forEach(function (item) {
    if (item.isIntersecting) {
      item.target.style.transitionDelay = ([...item.target.parentNode.children].indexOf(item.target) % 4) * 0.12 + 's';
      item.target.classList.add('show');
      watcher.unobserve(item.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(function (item) {
  watcher.observe(item);
});

const progress = document.querySelector('.progress');
const banner = document.querySelector('.banner');

function onScroll() {
  const height = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = 'scaleX(' + scrollY / height + ')';
  if (speed === 1) banner.style.setProperty('--shift', Math.min(scrollY * 0.15, 120) + 'px');
}

addEventListener('scroll', onScroll, { passive: true });
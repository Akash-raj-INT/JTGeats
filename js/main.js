// Modal
const modal = document.getElementById('modal');
const dishInput = document.getElementById('dishInput');
const modalTitle = document.getElementById('modalTitle');

document.querySelectorAll('.request-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    dishInput.value = btn.dataset.name;
    modalTitle.textContent = "Request: " + btn.dataset.name;
  });
});

function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
}
document.querySelectorAll('[data-close], .modal-close').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

// Slider
var slider = tns({
  container: '.my-slider',
  items: 3,
  slideBy: 1,
  autoplay: false,
  controls: true,
  nav: false,
  gutter: 16,
  responsive: {
    640:{ items:1 },
    900:{ items:2 },
    1200:{ items:3 }
  }
});

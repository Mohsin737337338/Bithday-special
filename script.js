/* navigation between 3 screens + confetti */
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');
const viewBtn = document.getElementById('viewBtn');

viewBtn.addEventListener('click', () => {
  goToLoading();
});

function goToLoading(){
  page1.classList.remove('active');
  page2.classList.add('active');

  // after short delay, show final message
  setTimeout(() => {
    page2.classList.remove('active');
    page3.classList.add('active');
    startConfetti();
    // ensure the message card is scrolled to the top of the viewport
    const finalWrap = document.querySelector('.final-wrap');
    if(finalWrap){
      finalWrap.scrollIntoView({behavior:'smooth', block:'start'});
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, 2600);
}

/* Simple Canvas Confetti */
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let W, H, confettiPieces = [];

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight - 46; // account for topbar
}
window.addEventListener('resize', resize);
resize();

function random(min, max){ return Math.random()*(max-min)+min }

function createConfetti(){
  confettiPieces = [];
  const colors = ['#FFB3E6','#E6B8FF','#CDA0FF','#F6D9FF','#C8A1FF','#B785FF'];
  for(let i=0;i<120;i++){
    confettiPieces.push({
      x: random(0,W),
      y: random(-H,0),
      r: random(6,14),
      d: random(10,40),
      color: colors[Math.floor(random(0,colors.length))],
      tilt: random(-10,10),
      tiltSpeed: random(0.05,0.15),
      speed: random(1,3)
    })
  }
}

function drawConfetti(){
  ctx.clearRect(0,0,W,H);
  confettiPieces.forEach(p => {
    ctx.beginPath();
    ctx.moveTo(p.x + p.tilt, p.y);
    ctx.lineTo(p.x + p.tilt + p.r/2, p.y + p.r/1.8);
    ctx.lineTo(p.x + p.tilt - p.r/2, p.y + p.r/1.8);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.fill();

    // update
    p.tilt += p.tiltSpeed;
    p.y += p.speed;
    if(p.y > H + 20){
      p.x = random(0,W);
      p.y = -10;
    }
  })
}

let confettiAnim;
function animate(){
  drawConfetti();
  confettiAnim = requestAnimationFrame(animate);
}

function startConfetti(){
  cancelAnimationFrame(confettiAnim);
  createConfetti();
  animate();
  // stop after some time
  setTimeout(()=> cancelAnimationFrame(confettiAnim), 12000);
}

// Allow replay on clicking the final title
const finalTitle = document.querySelector('.final-title');
finalTitle && finalTitle.addEventListener('click', () => {
  startConfetti();
});

// small accessibility: press Enter to view when button focused
viewBtn.addEventListener('keydown', e=>{ if(e.key === 'Enter') viewBtn.click() });

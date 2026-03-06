// ── NAV SCROLL ──
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
});

// ── PARALLAX ──
const parallaxPairs = [
  {
    wrap: document.getElementById("parallax1"),
    bg: document.getElementById("pbg1"),
  },
  {
    wrap: document.getElementById("parallax2"),
    bg: document.getElementById("pbg2"),
  },
];

function updateParallax() {
  parallaxPairs.forEach(({ wrap, bg }) => {
    const rect = wrap.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!visible) return;
    const progress =
      (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const offset = (progress - 0.5) * 120;
    bg.style.transform = `translateY(${offset}px)`;
  });
}

window.addEventListener("scroll", updateParallax, { passive: true });
updateParallax();

// ── REVEAL ON SCROLL ──
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
reveals.forEach((el) => observer.observe(el));

// ── LIGHTBOX ──
const allItems = document.querySelectorAll(".gallery-item, .featured-item");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbTitle = document.getElementById("lbTitle");
const lbMeta = document.getElementById("lbMeta");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

let currentIndex = 0;

function openLightbox(index) {
  const el = allItems[index];
  const img = el.querySelector("img");
  currentIndex = index;
  lbImg.src = img.src.replace(/w=\d+/, "w=1400");
  lbImg.alt = img.alt;
  lbTitle.textContent = el.dataset.title || img.alt;
  lbMeta.textContent = el.dataset.meta || "";
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

function navigate(dir) {
  const next = (currentIndex + dir + allItems.length) % allItems.length;
  openLightbox(next);
}

allItems.forEach((item, i) => {
  item.addEventListener("click", () => openLightbox(i));
});

lbClose.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", () => navigate(-1));
lbNext.addEventListener("click", () => navigate(1));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") navigate(-1);
  if (e.key === "ArrowRight") navigate(1);
});



// ── CONTACT FORM ──
const form = document.getElementById("minicrm-form");
const successMsg = document.getElementById("successMsg");
const errorMsg = document.getElementById("errorMsg");
const submitBtn = document.getElementById("submitBtn");

function onRecaptchaSuccess() {
  submitBtn.disabled = false;
  submitBtn.classList.add("enabled");
}

function onRecaptchaExpired() {
  submitBtn.disabled = true;
  submitBtn.classList.remove("enabled");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  successMsg.style.display = "none";
  errorMsg.style.display = "none";

  const formData = new FormData(form);

  try {
    const response = await fetch("https://r3.minicrm.hu/Api/Signup", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      successMsg.style.display = "block";
      form.reset();
      grecaptcha.reset();
      onRecaptchaExpired();
    } else {
      errorMsg.style.display = "block";
    }
  } catch (error) {
    console.error("Hiba:", error);
    errorMsg.style.display = "block";
  }
});
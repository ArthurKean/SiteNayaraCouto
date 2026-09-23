"use strict";

/* PERSONALIZAÇÃO: use apenas dados reais confirmados pelo escritório. */
const CONFIG = {
  whatsapp: "", // Apenas números: país + DDD + número.
  oab: "", // Exemplo de formato: OAB/UF 00000.
  depoimentos: [] // Adicione objetos { texto: "Relato real", autor: "Nome autorizado" }.
};

document.documentElement.classList.add("js");
document.getElementById("year").textContent = new Date().getFullYear();

// Menu do celular: fecha ao navegar, clicar fora ou pressionar Escape.
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("menu");
function setMenu(open) {
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.querySelector("span").textContent = open ? "−" : "＋";
}
toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("click", event => {
  if (!event.target.closest(".header")) setMenu(false);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    toggle.focus();
  }
});
window.matchMedia("(min-width: 761px)").addEventListener("change", () => setMenu(false));

// As áreas também funcionam sem JavaScript, graças ao elemento details.
const areas = [...document.querySelectorAll(".practice-list details")];
areas.forEach(area => area.addEventListener("toggle", () => {
  if (area.open) areas.forEach(other => { if (other !== area) other.open = false; });
}));

// Entrada suave; todo o conteúdo permanece acessível sem esse recurso.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window) {
  if (!reduceMotion.matches) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll("[data-reveal]").forEach(element => {
      element.classList.add("reveal-ready");
      reveal.observe(element);
    });
    // Ao navegar por teclado, o elemento focado não pode ficar invisível.
    document.addEventListener("focusin", event => {
      event.target.closest("[data-reveal]")?.classList.add("is-visible");
    });
  }
  const sections = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      nav.querySelectorAll("a").forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-15% 0px -55% 0px" });
  document.querySelectorAll("main section[id]").forEach(section => sections.observe(section));
}

// O Instagram funciona como contato até que um WhatsApp seja informado.
const phone = CONFIG.whatsapp.replace(/\D/g, "");
if (/^\d{10,15}$/.test(phone)) {
  document.getElementById("contact-button").href = `https://wa.me/${phone}`;
  document.getElementById("contact-label").textContent = "Fale conosco pelo WhatsApp";
}
if (CONFIG.oab.trim()) {
  const oab = document.getElementById("oab");
  oab.hidden = false;
  oab.textContent = `${CONFIG.oab} · `;
}

// Depoimentos sem avaliações inventadas e sem reprodução automática.
const reviews = CONFIG.depoimentos.filter(item => item.texto?.trim() && item.autor?.trim());
if (reviews.length) {
  document.getElementById("depoimentos").hidden = false;
  let current = 0;
  function showReview() {
    document.getElementById("quote-text").textContent = `“${reviews[current].texto}”`;
    document.getElementById("quote-author").textContent = reviews[current].autor;
    document.getElementById("quote-count").textContent = `${current + 1} / ${reviews.length}`;
  }
  document.querySelector(".quote-controls").hidden = reviews.length < 2;
  document.getElementById("quote-prev").addEventListener("click", () => {
    current = (current - 1 + reviews.length) % reviews.length;
    showReview();
  });
  document.getElementById("quote-next").addEventListener("click", () => {
    current = (current + 1) % reviews.length;
    showReview();
  });
  showReview();
}

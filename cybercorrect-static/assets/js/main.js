
// FAQ accordion
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-faq-toggle]");
  if (!btn) return;
  const item = btn.closest(".faq-item");
  const open = item.getAttribute("data-open") === "true";
  item.setAttribute("data-open", String(!open));
});

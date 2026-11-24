// Builds the shared header (Home button + page title) on every function page.
(() => {
  const header = document.createElement("header");
  header.className = "bar";

  const back = document.createElement("a");
  back.className = "back";
  back.href = "index.html";
  back.innerHTML = '<i class="bi bi-chevron-left" aria-hidden="true"></i>Home';

  const title = document.createElement("h1");
  title.textContent = document.body.dataset.title || "";

  header.append(back, title);
  document.body.prepend(header);
})();

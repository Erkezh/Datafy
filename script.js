let allCards = []; // Сохраняем элементы карточек для фильтрации

fetch("./companies.json")
  .then((res) => res.json())
  .then((data) => {
    const crdCnt = document.getElementById("card-container");
    crdCnt.innerHTML = "";
    data.forEach((company) => {
      const card = document.createElement("div");
      card.classList = "card";
      card.innerHTML = `
        <h2>${company.name}</h2>
        <div class="tags">
            <p>${company.type}</p>
            <p>${company.status}</p>
        </div>
        <p class="card-desc">
            <span>БИН:</span> ${company.bin} <br>
            <span>Адрес:</span> ${company.address} <br>
            <span>Вид деятельности:</span> ${company.activity} <br>
            <span>Руководитель:</span> ${company.director.toUpperCase()} <br>
        </p>
      `;
      card.addEventListener("click", () => {
        window.location.href = `details.html?bin=${company.bin}`;
      });

      crdCnt.appendChild(card);
      allCards.push({ el: card, company });
    });

    updateCounter();
  });

// Поиск
function handleSearch() {
  const input = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();

  allCards.forEach(({ el, company }) => {
    const match =
      company.name.toLowerCase().includes(input) ||
      company.bin.includes(input) ||
      company.director.toLowerCase().includes(input);
    el.classList.toggle("hidden", !match);
  });

  updateCounter();
}

// Фильтр
const filter = document.getElementById("filter");

function openFilter() {
  filter.style.display = "block";
}

function closeFilter() {
  filter.style.display = "none";

  const city = document.getElementById("city-select").value.toLowerCase();
  const type = document.getElementById("type-select").value;
  const status = document.getElementById("status-select").value;

  allCards.forEach(({ el, company }) => {
    const cityMatch =
      city === "0" || company.address.toLowerCase().includes(city);
    const typeMatch = type === "0" || company.type === type;
    const statusMatch = status === "0" || company.status === status;

    el.classList.toggle("hidden", !(cityMatch && typeMatch && statusMatch));
  });

  updateCounter();
}

function resetFilters() {
  document.getElementById("city-select").selectedIndex = 0;
  document.getElementById("type-select").selectedIndex = 0;
  document.getElementById("status-select").selectedIndex = 0;

  document.querySelectorAll(".select-selected").forEach((s, i) => {
    const select = document.querySelectorAll("select")[i];
    s.textContent = select.options[0].text;
  });

  allCards.forEach(({ el }) => {
    el.classList.remove("hidden");
  });

  updateCounter();
}

// Счётчик результатов
function updateCounter() {
  const visible = allCards.filter(({ el }) => !el.classList.contains("hidden"));
  document.querySelector(
    ".counter span"
  ).textContent = `${visible.length} найденных компаний`;
}

const crdCnt = document.getElementById("card-container");

document.querySelectorAll(".custom-select").forEach((wrapper) => {
  const select = wrapper.querySelector("select");
  const selected = document.createElement("div");
  selected.className = "select-selected";
  selected.textContent = select.options[select.selectedIndex].text;
  wrapper.appendChild(selected);

  const items = document.createElement("div");
  items.className = "select-items select-hide";

  [...select.options].forEach((opt, i) => {
    if (i === 0) return;
    const div = document.createElement("div");
    div.textContent = opt.text;
    div.addEventListener("click", () => {
      select.selectedIndex = i;
      selected.textContent = opt.text;
      closeAllSelect();
    });
    items.appendChild(div);
  });

  wrapper.appendChild(items);

  selected.addEventListener("click", (e) => {
    e.stopPropagation();
    closeAllSelect();
    items.classList.toggle("select-hide");
    selected.classList.toggle("select-arrow-active");
  });
});

function closeAllSelect() {
  document
    .querySelectorAll(".select-items")
    .forEach((i) => i.classList.add("select-hide"));
  document
    .querySelectorAll(".select-selected")
    .forEach((s) => s.classList.remove("select-arrow-active"));
}

document.addEventListener("click", closeAllSelect);

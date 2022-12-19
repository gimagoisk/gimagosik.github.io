const STORAGE_KEY = "gimagosik:notes";
const QUICK_NOTES_LIMIT = 5;
const NOTES_PER_PAGE = 3;

/**
 * @typedef {Object} Note
 * @property {number} id
 * @property {Date} created_date
 * @property {string} content
 */

/**
 * @return {Note[]}
 */
function getNotes() {
  try {
    return (JSON.parse(localStorage.getItem(STORAGE_KEY)) || []).map(
      (item) => ({
        ...item,
        created_date: new Date(item.created_date),
      })
    );
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * @param {Note[]} notes
 * @return {void}
 */
function writeNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function loadQuickNotes() {
  const container = document.querySelector(".last-notes-list");
  if (!container) return;

  const notes = getNotes()
    .sort((a, b) => b.created_date - a.created_date)
    .slice(0, QUICK_NOTES_LIMIT);

  container.innerHTML = "";
  for (const note of notes) {
    const div = document.createElement("div");
    div.classList.add("last-notes-item");
    div.innerHTML = `${note.id}: ${note.content}`;
    div.title = note.content;

    container.appendChild(div);
  }
}

function loadQuickNotesForm() {
  const form = document.querySelector("#notes-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const input = e.target.querySelector("#txt");
    if (!input.value) return;

    const notes = getNotes();
    const greatest = notes.sort((a, b) => b.id - a.id)[0];
    const id = greatest ? greatest.id + 1 : 1;

    writeNotes([
      ...notes,
      {
        id,
        content: input.value.trim(),
        created_date: new Date(),
      },
    ]);

    loadQuickNotes();
    loadNotes();

    input.value = "";
  });
}

function loadNotes(currentPage = 1, query = "") {
  const container = document.querySelector(".notes-container");
  const paginationContainer = document.querySelector(".pagination-container");

  if (!container || !paginationContainer) return;
  container.innerHTML = "";
  paginationContainer.innerHTML = "";

  const notes = getNotes();
  const filteredNotes = notes
    .filter((note) => {
      if (query) {
        return note.content.includes(query);
      }
      return true;
    })
    .sort((a, b) => b.created_date - a.created_date);
  const slicedNotes = filteredNotes.slice(
    (currentPage - 1) * NOTES_PER_PAGE,
    currentPage * NOTES_PER_PAGE
  );

  for (const note of slicedNotes) {
    const dt = document.createElement("dt");
    dt.innerHTML = `${note.id}: ${note.created_date.toLocaleString()}`;

    const dd = document.createElement("dd");
    dd.innerHTML = note.content;

    container.appendChild(dt);
    container.appendChild(dd);
  }

  const pages = Array.from(
    { length: filteredNotes.length / NOTES_PER_PAGE },
    (_, i) => i + 1
  );

  for (const page of pages) {
    const div = document.createElement("div");
    div.innerText = page;

    div.classList.add("pagination-item");
    if (page === currentPage) {
      div.classList.add("current");
    } else {
      div.addEventListener("click", () => {
        loadNotes(page, query);
      });
    }

    paginationContainer.appendChild(div);
  }
}

function loadSearchInput() {
  const searchInput = document.querySelector(".search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    loadNotes(1, e.target.value.trim());
  });
}

loadQuickNotesForm();
loadQuickNotes();
loadNotes();
loadSearchInput();

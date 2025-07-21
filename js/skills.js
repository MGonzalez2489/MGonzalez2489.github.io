// icons = await fetchIcons();

let allIcons = []; // Almacenará todos los iconos para evitar recargar y re-filtrar el array original
let currentIcons = []; // Almacenará los iconos filtrados actualmente
const types = new Map();

/**
 * Carga y filtra los iconos de habilidades.
 * @param {string} [filterTag] - Etiqueta por la que filtrar los iconos. Si es nulo, se muestran todos.
 * @param {string} [filterName] - Nombre del icono por el que filtrar. Si es nulo, no se filtra por nombre.
 */
async function loadSkillsIcons(filterTag = null) {
  const skillsSection = document.querySelector(".skills");
  const skillsWrap = skillsSection.querySelector(".skills-results");
  const typesWrap = skillsSection.querySelector(".skills-menu");

  // Si es la primera vez que se carga, obtener todos los iconos
  if (allIcons.length === 0) {
    const data = await fetchIcons();
    allIcons = data.icons;
    populateTypes(allIcons); // Solo calculamos los tipos una vez
  }

  // Limpiar el contenedor de iconos antes de añadir nuevos
  skillsWrap.innerHTML = "";

  // Filtrar iconos
  currentIcons = allIcons;

  if (filterTag) {
    currentIcons = currentIcons.filter((icon) =>
      icon.tags.some((tag) => tag.toLowerCase() === filterTag.toLowerCase()),
    );
  }

  // Renderizar iconos
  currentIcons.forEach((icon) => {
    const imgContent = createIconElement(icon);
    skillsWrap.appendChild(imgContent);
  });

  // Solo mapear los tipos si no se ha hecho ya o si se necesita actualizar (e.g., al cambiar el conteo)
  // En este caso, como los conteos no cambian por el filtro, solo se mapea una vez.
  mapTypes(typesWrap, filterTag);
}

/**
 * Crea el elemento HTML para un icono.
 * @param {object} icon - Objeto con los datos del icono (title, path).
 * @returns {HTMLElement} El elemento div que contiene la imagen del icono.
 */
function createIconElement(icon) {
  const img = document.createElement("img");
  img.setAttribute("width", "80%");
  img.setAttribute("height", "80%");
  img.setAttribute("src", icon.path);
  img.setAttribute("alt", icon.title); // Añadir alt para accesibilidad
  img.classList.add("skills-content-image"); // Renombrar la clase para mayor claridad

  const imgContent = document.createElement("div");
  imgContent.classList.add("skills-content");
  imgContent.classList.add("tooltip");
  imgContent.appendChild(img);

  const spn = document.createElement("span");
  spn.classList.add("tooltiptext");
  spn.textContent = icon.title;
  imgContent.appendChild(spn);

  return imgContent;
}

/**
 * Popula el Map de tipos y sus conteos. Se ejecuta solo una vez al cargar todos los iconos.
 * @param {Array<object>} iconsData - Array de todos los iconos disponibles.
 */
function populateTypes(iconsData) {
  types.clear(); // Limpiar por si se llama más de una vez (aunque idealmente solo se llama al inicio)
  iconsData.forEach((icon) => {
    icon.tags.forEach((tag) => {
      const normalizedTag = tag.toLowerCase();
      const capitalizedTag = tag.toString()[0].toUpperCase() + tag.slice(1);
      types.set(normalizedTag, {
        name: capitalizedTag,
        count: (types.get(normalizedTag)?.count || 0) + 1,
      });
    });
  });

  // Añadir "All" al principio y convertir a Array para ordenar
  const sortedTypes = Array.from(types.values()).sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  );
  types.clear(); // Limpiar el Map para rellenarlo en el orden deseado
  types.set("all", { name: "All", count: -1 }); // El conteo -1 indica "todos"
  sortedTypes.forEach((type) => types.set(type.name.toLowerCase(), type));
}

/**
 * Mapea los tipos de habilidades a la lista de navegación.
 * @param {HTMLElement} element - El elemento DOM donde se añadirán los tipos.
 * @param {string} [activeFilter] - La etiqueta activa actualmente para resaltar el elemento.
 */
function mapTypes(element, activeFilter = null) {
  element.innerHTML = ""; // Limpiar el contenedor de tipos
  types.forEach((t) => {
    const li = document.createElement("li");
    const normalizedName = t.name.toLowerCase().trim();
    li.setAttribute("id", `skill_${normalizedName}`);
    li.classList.add("skills-item");
    li.textContent = t.name.toString();

    if (
      normalizedName === (activeFilter ? activeFilter.toLowerCase() : "all")
    ) {
      li.classList.add("skills-item-active");
    }

    li.addEventListener("click", () => {
      // Remover la clase activa del elemento anterior
      const oldElement = document.querySelector(".skills-item-active");
      if (oldElement) {
        oldElement.classList.remove("skills-item-active");
      }
      // Añadir la clase activa al nuevo elemento
      li.classList.add("skills-item-active");

      const nameToFilter = normalizedName === "all" ? null : normalizedName;
      loadSkillsIcons(nameToFilter); // Mantener el filtro de búsqueda
    });

    element.appendChild(li);
  });
}
function search(tag) {
  if (tag.toLowerCase() === "all") {
    tag = null;
  }

  loadSkillsIcons(activeFilterTag, searchTerm);
}

// Función para inicializar la búsqueda
function setupSearch() {
  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "text");
  searchInput.setAttribute(
    "placeholder",
    "Buscar iconos por nombre o etiqueta...",
  );
  searchInput.setAttribute("id", "search-input");
  searchInput.classList.add("skills-search-input"); // Añadir una clase para estilos

  const skillsMenu = document.querySelector(".skills-menu");
  skillsMenu.parentNode.insertBefore(searchInput, skillsMenu); // Inserta el input antes del menú

  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value;
    const activeFilterElement = document.querySelector(".skills-item-active");
    let activeFilterTag = null;
    if (activeFilterElement && activeFilterElement.id !== "skill_all") {
      activeFilterTag = activeFilterElement.id.replace("skill_", "");
    }
    loadSkillsIcons(activeFilterTag, searchTerm);
  });
}

async function populateTitle() {
  const data = await (await fetch("./../data/skills.json")).json();

  const section = document.querySelector(".skills-header");

  const titleElement = section.querySelector(".skills-title");
  titleElement.textContent = data.title;
  const summaryElement = section.querySelector(".section-paragraph");
  summaryElement.textContent = data.summary;
}

// Carga inicial al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  populateTitle();
  loadSkillsIcons(); // Carga todos los iconos inicialmente
});

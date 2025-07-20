async function mapData() {
  const response = await fetch("./../data/hero.json");
  const data = await response.json();

  const content = document.querySelector(".hero__content");

  if (!content) return;

  const sectionTitle = content.querySelector(".hero__title");
  if (sectionTitle) {
    sectionTitle.textContent = data.name;
  }

  const sectionSummary = content.querySelector(".hero__summary");
  if (sectionSummary) {
    sectionSummary.textContent = data.summary;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mapData();
});

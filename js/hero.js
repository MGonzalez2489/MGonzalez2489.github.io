// async function loadData() {
//   const response = await fetch("./../data/hero.json");
//   const json = await response.json();
//   console.log("json", json);
// }

// loadData();
//
const data = {
  name: "Manuel Alfredo Gonzalez Hernandez",
  summary:
    "I'm a Software Engineer committed to continuous growth and leveraging the power of code for good. What truly excites me is developing intuitive tools, impactful applications, and practical resources that simplify and improve daily experiences.",
};

function mapData() {
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

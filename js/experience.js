let openedJobId = null; // Renamed for clarity and consistency

/**
 * Initializes the experience section by populating content and setting up event listeners.
 */
async function initializeExperienceSection() {
  const contentSection = document.querySelector(".experience-inner");
  if (!contentSection) {
    console.warn("Experience section container not found.");
    return;
  }

  const response = await fetch("./../data/experience.json");
  const experienceData = await response.json();

  // Populate static content
  setTextContent(contentSection, ".experience-title", experienceData.title);
  setTextContent(contentSection, ".section-paragraph", experienceData.summary);

  renderJobCards(experienceData);
  setupJobCardEventListeners();
}

/**
 * Sets the text content of an element selected within a parent.
 * @param {HTMLElement} parentElement - The parent element to search within.
 * @param {string} selector - The CSS selector for the target element.
 * @param {string} text - The text content to set.
 */
function setTextContent(parentElement, selector, text) {
  const element = parentElement.querySelector(selector);
  if (element) {
    element.textContent = text;
  }
}

/**
 * Renders the job cards based on the experienceData.
 */
function renderJobCards(experienceData) {
  const template = document.getElementById("experience-card-template");
  const container = document.querySelector(".experience-tables-wrap");

  if (!template || !container) {
    console.error("Template or container for job cards not found.");
    return;
  }

  // Use a DocumentFragment for better performance when appending multiple elements
  const fragment = document.createDocumentFragment();
  experienceData.jobs = experienceData.jobs.sort((a, b) => b.id - a.id);

  experienceData.jobs.forEach((job) => {
    const cardContent = template.content.cloneNode(true);

    setTextContent(cardContent, ".company", job.company);
    setTextContent(cardContent, ".experience-table-features-title", job.title);
    setTextContent(cardContent, ".dates", job.dates);

    const highlightsList = cardContent.querySelector(
      ".experience-table-features",
    );
    if (highlightsList) {
      job.highlights.forEach((highlight) => {
        const li = document.createElement("li");
        li.innerHTML = `<p><b>${highlight.title}</b>: <span>${highlight.description}</span></p>`;
        highlightsList.appendChild(li);
      });
    }

    const button = cardContent.querySelector(".button");
    if (button) {
      button.dataset.jobId = job.id; // Use data-attributes for better practice
    }

    const article = document.createElement("article");
    article.id = `job_card_${job.id}`;
    article.appendChild(cardContent);
    fragment.appendChild(article);
  });

  container.appendChild(fragment);
}

/**
 * Sets up a single event listener on the parent container using event delegation.
 */
function setupJobCardEventListeners() {
  const container = document.querySelector(".experience-tables-wrap");
  if (!container) return;

  container.addEventListener("click", (event) => {
    const button = event.target.closest(".button");
    if (button && button.dataset.jobId) {
      handleJobCardToggle(button.dataset.jobId);
    }
  });
}

/**
 * Toggles the visibility of a job card's feature list.
 * @param {string} jobId - The ID of the job whose card needs to be toggled.
 */
function handleJobCardToggle(jobId) {
  const targetCard = document.getElementById(`job_card_${jobId}`);
  if (!targetCard) return;

  const featureList = targetCard.querySelector(".list-reset");
  if (!featureList) return;

  if (openedJobId === jobId) {
    // If the clicked job is already open, close it
    closeJobCard(jobId);
  } else {
    // Close the currently opened job if any
    if (openedJobId) {
      closeJobCard(openedJobId);
    }
    // Open the new job
    openJobCard(jobId);
  }
}

/**
 * Opens a specific job card.
 * @param {string} jobId - The ID of the job card to open.
 */
function openJobCard(jobId) {
  const card = document.getElementById(`job_card_${jobId}`);
  if (!card) return;

  const featureList = card.querySelector(".list-reset");
  if (featureList) {
    featureList.classList.remove("is-hidden");
    featureList.classList.add("is-show");
    openedJobId = jobId;

    anime({
      targets: featureList,
      maxHeight: featureList.scrollHeight + "px", // Animate to its full scroll height
      opacity: [0, 1], // Fade in
      duration: 500,
      easing: "easeInOutQuad",
      complete: function () {
        featureList.style.maxHeight = "none"; // Remove maxHeight after animation for flexible content
        featureList.classList.add("is-show"); // Add show class after animation
        openedJobId = jobId;
      },
    });
  }
}

/**
 * Closes a specific job card.
 * @param {string} jobId - The ID of the job card to close.
 */
function closeJobCard(jobId) {
  const card = document.getElementById(`job_card_${jobId}`);
  if (!card) return;

  const featureList = card.querySelector(".list-reset");
  if (featureList) {
    // Ensure the maxHeight is set to its current actual height before animating down
    featureList.style.maxHeight = featureList.scrollHeight + "px";

    anime({
      targets: featureList,
      maxHeight: "0", // Animate to 0 height
      opacity: [1, 0], // Fade out
      duration: 400,
      easing: "easeInOutQuad",
      complete: function () {
        featureList.classList.remove("is-show");
        featureList.classList.add("is-hidden"); // Add hidden class after animation
        if (openedJobId === jobId) {
          openedJobId = null;
        }
      },
    });
  }
}

document.addEventListener("DOMContentLoaded", initializeExperienceSection);

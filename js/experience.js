const experienceData = {
  title: "Experience",
  summary:
    "Throughout my professional journey, I've had the invaluable opportunity to collaborate with multidisciplinary and international teams across various companies. This global exposure has been instrumental in my continuous growth and professional development, significantly broadening my perspective and skill set.",
  jobs: [
    {
      id: "0",
      // company: "Servicios de Programacion de Chihuahua",
      company: "SPC",
      dates: "Mar 2013 - Dec 2016",
      title: "Jr/Mid Developer",
      highlights: [
        {
          title: "Web Application Support & Development",
          description:
            "Provided essential support for a web application built with ASP.NET, C# (LINQ), and Code First, ensuring its stability and functionality.",
        },
        {
          title: "Full-Stack Contribution & Design",
          description:
            "Actively contributed to the design and implementation of complete web applications using ASP.NET and Silverlight.",
        },
        {
          title: "Diverse Application Development",
          description:
            "Expanded expertise beyond web to include desktop application development with WPF, showcasing versatility across different platforms.",
        },
        {
          title: "Rapid Career Progression",
          description:
            "Quickly advanced from Junior to Intermediate Programmer, demonstrating a strong aptitude for learning and taking on increased responsibility.",
        },
      ],
    },
    {
      id: "1",
      company: "PK Global",
      dates: "Jan 2017 - Aug 2021",
      title: "Software Engineer",
      highlights: [
        {
          title: "Full-Cycle Project Delivery",
          description:
            "Successfully delivered over four medium-sized projects as an Intermediate Angular/.NET Developer, focusing on new feature development and critical bug resolution within SCRUM methodologies.",
        },
        {
          title: "Rapid Professional Advancement",
          description:
            "Progressed from an Intermediate Developer to Lead Software Engineer on a complex, cross-platform project, demonstrating accelerated growth and increasing responsibility.",
        },
        {
          title: "Cross-Platform Expertise",
          description:
            "Mastered and applied diverse technologies including Angular, Node.js (with Sails.js), and PostgreSQL to lead and develop sophisticated multi-platform solutions.",
        },
        {
          title: "Agile Methodologies & Problem-Solving",
          description:
            "Actively collaborated in an agile environment (SCRUM) to identify, analyze, and implement solutions for complex technical challenges.",
        },
      ],
    },
    {
      id: "2",
      company: "Unosquare",
      dates: "Aug 2021 - Now",
      title: "Tech Lead / Software Engineer",
      highlights: [
        {
          title: "Team Leadership & Project Management",
          description:
            "Leading and coordinating development teams, overseeing resource allocation, and streamlining the code delivery process for large-scale projects.",
        },
        {
          title: "Full-Stack Development",
          description:
            "Driving the creation of robust web solutions, encompassing both front-end development in Angular and back-end services with C# and .NET Core.",
        },
        {
          title: "Technical Analysis & Design",
          description:
            "Translating business needs into technical specifications through requirements analysis, feature design, and implementation planning.",
        },
        {
          title: "Quality Assurance & Collaboration",
          description:
            "Ensuring code quality and fostering team growth through comprehensive code reviews, peer programming, and efficient bug resolution.",
        },
      ],
    },
  ],
};
let openedJobId = null; // Renamed for clarity and consistency

/**
 * Initializes the experience section by populating content and setting up event listeners.
 */
function initializeExperienceSection() {
  const contentSection = document.querySelector(".experience-inner");
  if (!contentSection) {
    console.warn("Experience section container not found.");
    return;
  }

  // Populate static content
  setTextContent(contentSection, ".experience-title", experienceData.title);
  setTextContent(contentSection, ".section-paragraph", experienceData.summary);

  renderJobCards();
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
function renderJobCards() {
  const template = document.getElementById("experience-card-template");
  const container = document.querySelector(".experience-tables-wrap");

  if (!template || !container) {
    console.error("Template or container for job cards not found.");
    return;
  }

  // Use a DocumentFragment for better performance when appending multiple elements
  const fragment = document.createDocumentFragment();

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

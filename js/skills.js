async function loadSkillsIcons() {
  const icons = await fetchIcons();

  const skillsSection = document.querySelector(".skills");

  const skillsWrap = skillsSection.querySelector(".skills-content-wrap");

  icons.icons.forEach((icon) => {
    const img = document.createElement("img");

    img.setAttribute("width", "100%");
    img.setAttribute("height", "100%");
    img.setAttribute("src", icon.path);
    img.classList.add("skills-content");

    const imgContent = document.createElement("div");
    imgContent.classList.add("skills-content");
    imgContent.appendChild(img);

    skillsWrap.appendChild(imgContent);
  });
}

loadSkillsIcons();

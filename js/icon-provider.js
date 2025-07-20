async function fetchIcons() {
  const response = await fetch("./../data/icon-base.json");
  const json = await response.json();

  return json;
}

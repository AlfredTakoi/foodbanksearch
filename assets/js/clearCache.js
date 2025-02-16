const timestamp = new Date().getTime();
const images = document.querySelectorAll("img");
images.forEach((img) => {
  const originalSrc = img.getAttribute("src");
  img.src = `${originalSrc}?v=${timestamp}`;
});

document.write('<link rel="stylesheet" href="./assets/css/style.css?v=' + timestamp + '">');
// document.write('<script src="./assets/js/script.js?v=' + timestamp + '"><\/script>');

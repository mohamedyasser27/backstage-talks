const body = document.querySelector("body");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const clr = entry.target.getAttribute("clr");
        body.style.backgroundColor = clr;
      }
    });
  },
  {
    rootMargin: "-50px",
  }
);

Array.from(document.querySelectorAll(".book-container")).forEach((ele) => {
  observer.observe(ele);
});
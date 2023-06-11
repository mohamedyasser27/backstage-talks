const booksModule = (function () {
  async function fetchBooksData() {
    const response = await fetch("./booksData.json");
    return response.json();
  }

  function createBookElement(issueName, bookColor, bookImgSrc) {
    const article = document.createElement("article");
    article.setAttribute("clr", bookColor);
    article.setAttribute("class", "book");
    article.setAttribute("role", "region");
    article.setAttribute("aria-label", issueName);

    const div = document.createElement("div");
    div.setAttribute("class", "book__details");

    const img = document.createElement("img");
    img.setAttribute("src", bookImgSrc);
    img.setAttribute("alt", "Book image");
    img.setAttribute("class", "book__img");

    const p = document.createElement("p");
    p.setAttribute("class", "book__number");
    p.textContent = issueName;

    div.appendChild(img);
    div.appendChild(p);

    article.appendChild(div);
    return article;
  }

  async function fillBooksContainer() {
    const booksData = await fetchBooksData();
    const container = document.querySelector(".books-container");

    for (const bookEntry of booksData.books) {
      const bookElement = createBookElement(
        bookEntry.name,
        bookEntry.color,
        bookEntry.src
      );
      container.appendChild(bookElement);
    }
  }

  return { fillBooksContainer };
})();

const behaviorModule = (function () {
  const issuesList = Array.from(
    document.querySelector(".issues-nav__list").children
  );
  const container = document.querySelector(".books-container");

  let cache = issuesList[0];

  function changeBackgroundColor(currentBook) {
    const clr = currentBook.getAttribute("clr");
    container.style.backgroundColor = clr;
  }

  function changeActiveIssue(newActiveElement) {
    cache.style.fontWeight = "400";
    newActiveElement.style.fontWeight = "800";
  }

  function createIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(container.children).indexOf(entry.target);
            changeActiveIssue(issuesList[index]);
            changeBackgroundColor(entry.target);
            cache = issuesList[index];
          }
        });
      },
      {
        rootMargin: "-50px",
      }
    );

    Array.from(document.querySelectorAll(".book")).forEach((ele) => {
      observer.observe(ele);
    });
  }

  return { createIntersectionObserver };
})();

async function main() {
  await booksModule.fillBooksContainer();
  behaviorModule.createIntersectionObserver();
}

main().catch((err) => {
  console.log(err);
});

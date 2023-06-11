const booksModule = (function () {
  async function fetchBooksData() {
    const response = await fetch("./booksData.json");
    return response.json();
  }

  function createBookElement(issueName, bookColor, bookImgSrc) {
    const booksContainer = document.querySelector(".books-container");
    const article = document.createElement("article");
    article.setAttribute("clr", bookColor);
    article.setAttribute("class", "book");
    article.setAttribute("id", `${issueName}`);

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
    booksContainer.appendChild(article);
  }

  function createIssueNavItem(issueName) {
    const listItem = document.createElement("li");
    listItem.classList.add("issues-nav__item");
    const link = document.createElement("a");
    link.href = `#${issueName}`;
    link.classList.add("issues-nav__link");
    link.textContent = issueName;

    listItem.appendChild(link);

    const issuesNavList = document.querySelector(".issues-nav__list");
    issuesNavList.appendChild(listItem);
  }

  async function fillBooksContainer() {
    const booksData = await fetchBooksData();

    for (const bookEntry of booksData.books) {
      createBookElement(bookEntry.name, bookEntry.color, bookEntry.src);
      createIssueNavItem(bookEntry.name);
    }
  }

  return { fillBooksContainer };
})();

const behaviorModule = (function () {
  let issuesList = null;
  let container = null;
  let cache = null;

  function initializeDomElements() {
    issuesList = Array.from(
      document.querySelector(".issues-nav__list").children
    );
    container = document.querySelector(".books-container");
    cache = issuesList[0];
  }

  function changeBackgroundColor(currentBook) {
    const clr = currentBook.getAttribute("clr");
    container.style.backgroundColor = clr;
  }

  function changeActiveIssue(newActiveElement) {
    cache.style.fontWeight = "400";
    newActiveElement.style.fontWeight = "800";
  }

  function createIntersectionObserver() {
    initializeDomElements();
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

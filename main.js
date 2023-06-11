const booksModule = (function () {
  async function fetchBooksData() {
    const response = await fetch("./booksData.json");
    return response.json();
  }
  function createBookElement(issueNumber, bookColor, bookImgSrc) {
    const booksContainer = document.querySelector(".books-container");
    const bookArticleElement = document.createElement("article");
    bookArticleElement.setAttribute("clr", bookColor);
    bookArticleElement.setAttribute("class", "book");
    bookArticleElement.setAttribute("id", `issue ${issueNumber}`);

    bookArticleElement.setAttribute("role", "region");
    bookArticleElement.setAttribute(
      "aria-label",
      `issue number ${issueNumber}`
    );

    const bookDetailsElement = document.createElement("div");
    bookDetailsElement.setAttribute("class", "book__details");

    const bookImgElement = document.createElement("img");
    // bookImgElement.setAttribute("src", bookImgSrc);
    bookImgElement.setAttribute("data-src", bookImgSrc);
    bookImgElement.setAttribute("alt", "Book image");
    bookImgElement.setAttribute("class", "book__img");

    const bookNameElement = document.createElement("p");
    bookNameElement.setAttribute("class", "book__name");
    bookNameElement.textContent = `issue #${issueNumber}`;

    const bookBuyLinkElement = document.createElement("a");
    bookBuyLinkElement.setAttribute("class", "book__buy-link");
    bookBuyLinkElement.setAttribute(
      "href",
      `https://brot.sk/products/backstage-talks-issue-${issueNumber}`
    );

    bookBuyLinkElement.textContent = "pre order here";

    bookDetailsElement.appendChild(bookImgElement);
    bookDetailsElement.appendChild(bookNameElement);
    bookDetailsElement.appendChild(bookBuyLinkElement);

    bookArticleElement.appendChild(bookDetailsElement);
    booksContainer.appendChild(bookArticleElement);
  }

  function createIssueNavItem(issueNumber) {
    const listItemElement = document.createElement("li");
    listItemElement.classList.add("issues-nav__item");
    const linkElement = document.createElement("a");
    linkElement.href = `#issue ${issueNumber}`;
    linkElement.classList.add("issues-nav__link");
    linkElement.textContent = `Issue #${issueNumber}`;

    listItemElement.appendChild(linkElement);

    const issuesNavList = document.querySelector(".issues-nav__list");
    issuesNavList.appendChild(listItemElement);
  }

  async function fillBooksContainer() {
    const booksData = await fetchBooksData();

    for (const bookEntry of booksData.books) {
      createBookElement(bookEntry.issueNumber, bookEntry.color, bookEntry.src);
      createIssueNavItem(bookEntry.issueNumber);
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
            const img = entry.target.children[0].children[0];
            const src = img.getAttribute("data-src");
            const index = Array.from(container.children).indexOf(entry.target);
            changeActiveIssue(issuesList[index]);
            changeBackgroundColor(entry.target);
            cache = issuesList[index];
            img.setAttribute("src", src);
          }
        });
      },
      {
        rootMargin: "-100px",
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

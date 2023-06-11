const booksModule = (function () {
  async function fetchBooksData() {
    const response = await fetch("./booksData.json");
    return response.json();
  }

  function createBookElement(issueNumber, bookColor, bookImgSrc) {
    const booksContainer = document.querySelector(".books-container");

    const bookElement = `
    <article clr="${bookColor}" class="book" id="issue ${issueNumber}" role="region" aria-label="issue number ${issueNumber}">
      <div class="book__details">
        <img data-src="${bookImgSrc}" alt="Book image" class="book__img">
        <p class="book__name">issue #${issueNumber}</p>
        <a class="book__buy-link" href="https://brot.sk/products/backstage-talks-issue-${issueNumber}">pre order here</a>
      </div>
    </article>
  `;

    booksContainer.innerHTML += bookElement;
  }
  function createIssueNavItem(issueNumber) {
    const listItemElement = document.createElement("li");
    listItemElement.classList.add("issues-nav__item");

    listItemElement.innerHTML = `
    <a href="#issue ${issueNumber}" class="issues-nav__link">
      Issue #${issueNumber}
    </a>
  `;

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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(container.children).indexOf(entry.target);
            changeActiveIssue(issuesList[index]);
            changeBackgroundColor(entry.target);
            cache = issuesList[index];
            const bookImg = entry.target.children[0].children[0];
            if (!bookImg.getAttribute("src")) {
              const src = bookImg.getAttribute("data-src");
              bookImg.setAttribute("src", src);
            }
          }
        });
      },
      {
        threshold:0.5,
      }
    );

    Array.from(document.querySelectorAll(".book")).forEach((ele) => {
      observer.observe(ele);
    });
  }

  return { createIntersectionObserver, initializeDomElements };
})();

async function main() {
  await booksModule.fillBooksContainer();
  behaviorModule.initializeDomElements();
  behaviorModule.createIntersectionObserver();
}

main().catch((err) => {
  console.log(err);
});

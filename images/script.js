console.log("JavaScript connected");


const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");


menuToggle.addEventListener("click", () => {

    siteNav.classList.toggle("active");

    const isOpen = siteNav.classList.contains("active");

    menuToggle.setAttribute("aria-expanded", isOpen);

});


const navLinks = document.querySelectorAll(".site-nav a");


navLinks.forEach(link => {

    link.addEventListener("click", () => {

        siteNav.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

    });

});


const searchToggle = document.getElementById("search-toggle");
const searchBox = document.getElementById("search-box");
const searchInput = document.getElementById("search-input");
const searchSubmit = document.getElementById("search-submit");
const searchMessage = document.getElementById("search-results-message");


searchToggle.addEventListener("click", () => {

    searchBox.classList.toggle("active");

    const isOpen = searchBox.classList.contains("active");

    searchToggle.setAttribute("aria-expanded", isOpen);

    if (isOpen) {
        searchInput.focus();
    }

});


const pages = [
    "index.html",
    "Privacy-Polict.html",
    "Contact-Us.html",

];


function scrollToResult(searchTerm) {

    const elements = document.querySelectorAll(
        "h1, h2, h3, h4"
    );

    for (const element of elements) {

        if (
            element.innerText
                .toLowerCase()
                .includes(searchTerm)
        ) {

            element.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            return true;
        }
    }

    return false;
}


async function performSearch() {

    const searchTerm = searchInput.value.trim().toLowerCase();

    searchMessage.classList.remove("active");


    if (!searchTerm) {
        return;
    }


    const currentPage =
        window.location.pathname.split("/").pop() ||
        "index.html";


    // First search the actual current page
    if (scrollToResult(searchTerm)) {
        return;
    }


    // Search every other page
    for (const page of pages) {

        if (page === currentPage) {
            continue;
        }


        try {

            const response = await fetch(page);

            if (!response.ok) {
                continue;
            }


            const html = await response.text();

            const parser = new DOMParser();

            const doc = parser.parseFromString(
                html,
                "text/html"
            );


            const pageText =
                doc.body.innerText.toLowerCase();


            if (pageText.includes(searchTerm)) {

                // Send the search term to the new page
                window.location.href =
                    page +
                    "?search=" +
                    encodeURIComponent(searchTerm);

                return;
            }


        } catch (error) {

            console.error(
                `Could not search ${page}:`,
                error
            );

        }

    }


    // No results found
    searchMessage.textContent =
        `No results found for "${searchTerm}".`;

    searchMessage.classList.add("active");


    // Remove message after 3 seconds
    setTimeout(() => {

        searchMessage.classList.remove("active");

    }, 3000);

}


searchSubmit.addEventListener(
    "click",
    performSearch
);


searchInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            performSearch();

        }

    }
);


// Check whether this page was opened from a search
const urlParams = new URLSearchParams(
    window.location.search
);

const searchFromPreviousPage =
    urlParams.get("search");


if (searchFromPreviousPage) {

    // Put the search term back into the search box
    searchInput.value = searchFromPreviousPage;

    // Wait for the page to finish loading
    window.addEventListener("load", () => {

        setTimeout(() => {

            scrollToResult(
                searchFromPreviousPage.toLowerCase()
            );

        }, 100);

    });

}


const menuItems = document.querySelectorAll(".student-menu-item");
const sections = document.querySelectorAll(".student-section");

if (menuItems.length > 0) {

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            const sectionId = item.dataset.section;

            menuItems.forEach(button => {
                button.classList.remove("active");
            });

            sections.forEach(section => {
                section.classList.remove("active");
            });

            item.classList.add("active");

            document.getElementById(sectionId).classList.add("active");
        });

    });

}
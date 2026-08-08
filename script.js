console.log("JavaScript connected");

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
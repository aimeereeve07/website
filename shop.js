const products = [

    {
        id: 1,
        name: "ITF Degree Matrix Jacket",
        category: "doboks",
        price: 37.00,
        image: "images/shop/dobok1.jpg",
        description: "thorough description",

        options: {
            size: ["140cm", "150cm", "160cm", "170cm", "180cm", "190cm", "200cm", "210cm"],
            type:{
                "1-3 Degree" : 37.00,
                "4th + Degree" : 42.00
            }
        }
    },

    {
        id: 2,
        name: "ITF Degree Matrix Trousers",
        category: "doboks",
        price: 37.00,
        image: "images/shop/dobok2.jpg",
        description: "thorough description",

        options: {
            size: ["140cm", "150cm", "160cm", "170cm", "180cm", "190cm", "200cm", "210cm"],
            type:{
                "1-3 Degree" : 32.00,
                "4th + Degree" : 34.00
            }
        }
    },

    {
        id: 3,
        name: "ITF Black Belt Degree Matrix",
        category: "doboks",
        price: 56.00,
        image: "images/shop/dobok3.jpg",
        description: "thorough description",

        options: {
            size: ["140cm", "150cm", "160cm", "170cm", "180cm", "190cm", "200cm", "210cm"],
            type:{
                "1-3 Degree" : 56.00,
                "4th + Degree" : 60.00
            }
        }
    },

    {
        id: 4,
        name: "SWTKD T'shirts",
        category: "clothing",
        price: 15.00,
        image: "images/shop/shirt.jpg",
        description: "thorough",

        options: {
            size:["5-6 yrs","7-8 yrs", "9-11 yrs", "12-13 yrs", "Small", "Medium", "Large"],
            type:["Dryfit", "Cotton"],
            club:["Lyde Green", "Thornbury"]
        }
    },
    {
        id: 5,
        name: "Sparring Gloves",
        category: "sparring",
        price: 31.00,
        image: "images/shop/gloves.jpg",
        description: "ITF-approved sparring gloves.",

        options: {
            size: ["XX-S","X-S","S", "M", "L","X-L"],
            colour: ["Blue", "Red"]
        }
    },

    {
        id: 6,
        name: "Gum Shield",
        category: "sparring",
        price: 4.00,
        image: "images/shop/gums.jpg",
        description: "how much can you actually say about a gum shield..",

        options: {
            Type:["Adult","Child"]
        }
    }

];

const productsContainer = document.getElementById("shop-products");

function displayProducts() {

    productsContainer.innerHTML = "";

    const filteredProducts =
        currentCategory === "all"
            ? products
            : products.filter(
                product => product.category === currentCategory
            );

    filteredProducts.forEach(product => {

        const productCard = document.createElement("div");

        productCard.className = "shop-product-card";

        productCard.innerHTML = `

            <button class="product-summary" type="button">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="shop-product-image"
                >

                <div class="product-summary-info">

                    <h2>${product.name}</h2>

                    <p class="shop-product-price"
                    data-base-price="${product.price}">
                        £${product.price.toFixed(2)}
                    </p>

                </div>

            </button>

            <div class="product-details">

                <p class="shop-product-description">
                    ${product.description}
                </p>

                <div class="product-options">
                    ${createOptions(product)}
                </div>

                <div class="product-quantity">

                    <label for="quantity-${product.id}">
                        Quantity
                    </label>

                    <input
                        id="quantity-${product.id}"
                        type="number"
                        min="1"
                        value="1"
                    >

                </div>

                <button
                    class="shop-add-button"
                    data-product-id="${product.id}">
                    Add to Basket
                </button>

            </div>

        `;

        productsContainer.appendChild(productCard);

    });

}



document.addEventListener("click", function(event) {

    const summary = event.target.closest(".product-summary");

    if (!summary) return;

    const card = summary.closest(".shop-product-card");

    // Close all other expanded cards
    document
        .querySelectorAll(".shop-product-card.expanded")
        .forEach(otherCard => {

            if (otherCard !== card) {
                otherCard.classList.remove("expanded");
            }

        });

    // Toggle the clicked card
    card.classList.toggle("expanded");

});

function createOptions(product) {

    let html = "";

    for (const option in product.options) {

        const values = product.options[option];

        const optionName =
            formatOptionName(option);


        html += `
            <label class="product-option">

                <span>${optionName}</span>

                <select
                    name="${option}"
                    data-option="${option}"
                >

                    <option value="">
                        Select ${optionName}
                    </option>
        `;


        /*
         * Price-changing option
         */

        if (
            typeof values === "object" &&
            !Array.isArray(values)
        ) {

            for (const value in values) {

                html += `
                    <option
                        value="${value}"
                        data-price="${values[value]}"
                    >
                        ${value} — £${values[value].toFixed(2)}
                    </option>
                `;

            }

        }


        /*
         * Normal option
         */

        else {

            values.forEach(value => {

                html += `
                    <option value="${value}">
                        ${value}
                    </option>
                `;

            });

        }


        html += `

                </select>

            </label>
        `;

    }

    return html;

}

function formatOptionName(option) {

    return option.charAt(0).toUpperCase() + option.slice(1);

}


document.addEventListener("click", function(event) {

    const categoryButton =
        event.target.closest(".shop-category");

    if (!categoryButton) return;

    currentCategory =
        categoryButton.dataset.category;

    document
        .querySelectorAll(".shop-category")
        .forEach(button => {
            button.classList.remove("active");
        });

    categoryButton.classList.add("active");

    displayProducts();

});

function updateProductPrice(card, product) {

    let price = product.price;

    const selects =
        card.querySelectorAll("[data-option]");


    selects.forEach(select => {

        const selectedOption =
            select.options[select.selectedIndex];


        if (
            selectedOption &&
            selectedOption.dataset.price
        ) {

            price =
                Number(selectedOption.dataset.price);

        }

    });


    const priceElement =
        card.querySelector(".shop-product-price");


    priceElement.textContent =
        `£${price.toFixed(2)}`;

}
document.addEventListener("change", function(event) {

    if (!event.target.matches("[data-option]")) {
        return;
    }


    const card =
        event.target.closest(".shop-product-card");


    const productId =
        Number(
            card.querySelector(".shop-add-button")
                .dataset.productId
        );


    const product =
        products.find(
            product => product.id === productId
        );


    if (!product) return;


    updateProductPrice(card, product);

});
let currentCategory = "all";
displayProducts();
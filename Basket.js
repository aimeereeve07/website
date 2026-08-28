let basket = JSON.parse(localStorage.getItem("basket")) || [];

function saveBasket() {

    localStorage.setItem(
        "basket",
        JSON.stringify(basket)
    );

}

document.addEventListener("click", function(event) {

    const button =
        event.target.closest(".shop-add-button");

    if (!button) return;


    const productId =
        Number(button.dataset.productId);


    const product =
        products.find(
            product => product.id === productId
        );


    if (!product) return;


    const card =
        button.closest(".shop-product-card");


    const options = {};

    let price = product.price;

    let valid = true;


    card
        .querySelectorAll("[data-option]")
        .forEach(select => {

            if (!select.value) {

                const optionName =
                    formatOptionName(
                        select.dataset.option
                    );

                alert(
                    `Please select a ${optionName}.`
                );

                valid = false;

                return;

            }


            options[select.dataset.option] =
                select.value;


            const selectedOption =
                select.options[
                    select.selectedIndex
                ];


            if (selectedOption.dataset.price) {

                price =
                    Number(
                        selectedOption.dataset.price
                    );

            }

        });


    if (!valid) return;


    const quantityInput =
        card.querySelector(
            ".product-quantity input"
        );


    const quantity =
        Number(quantityInput.value);


    if (quantity < 1) return;


    addToBasket(
        productId,
        options,
        quantity,
        price
    );

});


function addToBasket(
    productId,
    options,
    quantity,
    price
) {

    const existingItem = basket.find(item => {

        if (item.productId !== productId) {
            return false;
        }

        return JSON.stringify(item.options)
            === JSON.stringify(options);

    });


    if (existingItem) {

        existingItem.quantity += quantity;

    }

    else {

        basket.push({

            productId: productId,

            options: options,

            price: price,

            quantity: quantity

        });

    }


    saveBasket();

    updateBasketCount();

}

function updateBasketCount() {

    const countElement =
        document.getElementById("basket-count");

    if (!countElement) return;


    const count = basket.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );


    countElement.textContent = count;

}
updateBasketCount();

function displayBasket() {

    const container =
        document.getElementById("basket-items");

    if (!container) return;


    container.innerHTML = "";


    if (basket.length === 0) {

        container.innerHTML = `
            <p class="basket-empty">
                Your basket is empty.
            </p>
        `;

        displayBasketSummary();

        return;

    }


    basket.forEach((item, index) => {

        const product =
            products.find(
                product =>
                    product.id === item.productId
            );

        if (!product) return;


        const itemElement =
            document.createElement("div");

        itemElement.className =
            "basket-item";


        itemElement.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
                class="basket-item-image"
            >

            <div class="basket-item-info">

                <h2>
                    ${product.name}
                </h2>

                ${displayOptions(item.options)}

                <p>
                    £${item.price.toFixed(2)}
                </p>

            </div>


            <div class="basket-item-controls">

                <div class="quantity-control">

                    <button
                        type="button"
                        class="quantity-button quantity-minus"
                        data-index="${index}"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>

                    <span class="basket-quantity">
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        class="quantity-button quantity-plus"
                        data-index="${index}"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>

                <button
                    type="button"
                    class="basket-remove"
                    data-index="${index}"
                >
                    Remove
                </button>

            </div>

        `;


        container.appendChild(itemElement);

    });


    displayBasketSummary();

}

function displayOptions(options) {

    let html = "";


    for (const option in options) {

        if (!options[option]) continue;


        const name =
            option.charAt(0).toUpperCase()
            + option.slice(1);


        html += `
            <p>
                ${name}: ${options[option]}
            </p>
        `;

    }


    return html;

}

function displayBasketSummary() {

    const summary =
        document.getElementById("basket-summary");

    if (!summary) return;


    const total = basket.reduce(
        (sum, item) => {

            const product =
                products.find(
                    product =>
                        product.id === item.productId
                );

            if (!product) return sum;


            return sum +
                item.price * item.quantity;

        },
        0
    );


    summary.innerHTML = `

        <div class="basket-total">

            <span>Total</span>

            <strong>
                £${total.toFixed(2)}
            </strong>

        </div>

        <button class="checkout-button">
            Continue to Checkout
        </button>

    `;

}

document.addEventListener("change", function(event) {

    if (!event.target.classList.contains(
        "basket-quantity"
    )) {
        return;
    }


    const index =
        Number(event.target.dataset.index);

    const quantity =
        Number(event.target.value);


    if (quantity < 1) {

        event.target.value = 1;

        return;

    }


    basket[index].quantity = quantity;

    saveBasket();

    updateBasketCount();

    displayBasket();

});

document.addEventListener("click", function(event) {

    if (!event.target.classList.contains(
        "basket-remove"
    )) {
        return;
    }


    const index =
        Number(event.target.dataset.index);


    basket.splice(index, 1);

    saveBasket();

    updateBasketCount();

    displayBasket();

});

document.addEventListener("click", function(event) {

    const button =
        event.target.closest(".quantity-button");

    if (!button) return;


    const index =
        Number(button.dataset.index);


    if (button.classList.contains("quantity-minus")) {

        if (basket[index].quantity > 1) {
            basket[index].quantity--;
        }

    }


    if (button.classList.contains("quantity-plus")) {

        basket[index].quantity++;

    }


    saveBasket();

    updateBasketCount();

    displayBasket();

});

displayBasket();
updateBasketCount();
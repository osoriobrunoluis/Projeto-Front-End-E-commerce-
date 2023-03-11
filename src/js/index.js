function renderProducts(products) {
  const list = document.querySelector(".list__container");

  products.forEach((product) => {
    const card = createCard(product);

    list.appendChild(card);
  });
}

function createCard(product) {
  const container = document.createElement("li");
  const image = document.createElement("img");
  const category = document.createElement("span");
  const name = document.createElement("h2");
  const description = document.createElement("p");
  const price = document.createElement("span");
  const button = document.createElement("button");

  container.classList.add("list__item");

  image.src = product.img;
  image.alt = product.nameItem;

  category.classList.add("list__item--category");
  category.innerText = product.tag;

  name.innerText = product.nameItem;

  description.innerText = product.description;

  price.classList.add("list__item--price");
  price.innerText = `R$ ${product.value},00`;

  button.classList.add("list__item--button");
  button.innerText = product.addCart;
  button.dataset.id = product.id;

  container.append(image, category, name, description, price, button);

  return container;
}

function renderFilterProducts(array) {
  const buttons = document.querySelectorAll(".filter__container > li");
  const list = document.querySelector(".list__container");

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      list.innerHTML = "";

      if (event.target.innerText === "Todos") {
        renderProducts(array);
      }

      const filteredProducts = filterProducts(array, event.target.innerText);

      renderProducts(filteredProducts);
    });
  });
}

function filterProducts(array, filterWord) {
  return array.filter((product) => product.tag === filterWord);
}

function renderSearch() {
  const input = document.querySelector(".search__container > input");
  const searchBtn = document.querySelector(".search__button");
  const list = document.querySelector(".list__container");

  searchBtn.addEventListener("click", () => {
    list.innerHTML = "";

    const foundProduct = searchProductFind(input.value);

    renderProducts([foundProduct]);
  });

  input.addEventListener("change", () => {
    list.innerHTML = "";

    const searchArray = searchProductFilter(input.value);
    console.log(input.value);

    renderProducts(searchArray);
  });

  input.addEventListener("keyup", () => {
    list.innerHTML = "";

    const searchArray = searchProductFilter(input.value);

    renderProducts(searchArray);
  });
}

function searchProductFind(searchWord) {
  const foundProduct = data.find((product) => {
    if (
      product.nameItem.toLowerCase().includes(searchWord.toLowerCase()) ||
      product.description.toLowerCase().includes(searchWord.toLowerCase())
    ) {
      return product;
    }
  });

  return foundProduct;
}

function searchProductFilter(searchWord) {
  const foundProduct = data.filter((product) => {
    if (
      product.nameItem.toLowerCase().includes(searchWord.toLowerCase()) ||
      product.description.toLowerCase().includes(searchWord.toLowerCase())
    ) {
      return product;
    }
  });

  return foundProduct;
}

function renderCart(array) {
  const cartContainer = document.querySelector(".cart__container");
  const cartList = document.querySelector(".cart__list");
  const cartFooterContainer = document.querySelector(".cart__footer");

  cartList.innerHTML = "";

  if (cart.length <= 0) {
    const emptyCart = createEmptyCart();

    cartList.appendChild(emptyCart);

    if (cartFooterContainer) {
      cartFooterContainer.remove();
    }
  } else {
    array.forEach((product) => {
      const card = createCartProduct(product);

      cartList.appendChild(card);
    });

    if (cartFooterContainer) {
      cartFooterContainer.remove();
    }

    const cartFooter = createCartFooter(array);

    cartContainer.appendChild(cartFooter);

    removeCart(array);
  }
}

function createEmptyCart() {
  const container = document.createElement("li");
  const title = document.createElement("h2");
  const message = document.createElement("p");

  container.classList.add("cart__item--empty");

  title.innerText = "Lista de cursos vazia";
  message.innerText = "Adicione seus cursos";

  container.append(title, message);

  return container;
}

function createCartProduct(product) {
  const container = document.createElement("li");
  const image = document.createElement("img");
  const cartItem = document.createElement("div");
  const title = document.createElement("h2");
  const price = document.createElement("span");
  const button = document.createElement("button");

  container.classList.add("cart__item");

  image.src = product.img;
  image.alt = product.nameItem;

  cartItem.classList.add("cart__item--product");
  title.innerText = product.nameItem;
  price.innerText = `R$ ${product.value},00`;
  button.classList.add("cart__button--remove");
  button.dataset.cartId = product.cartId;
  button.innerText = "Remover Produto";

  cartItem.append(title, price, button);
  container.append(image, cartItem);

  return container;
}

function createCartFooter(array) {
  const totalValue = array.reduce((acumulador, itemAtual) => {
    return acumulador + itemAtual.value;
  }, 0);

  const footerContainer = document.createElement("footer");
  const footerQuantity = document.createElement("div");
  const footerQuantityP = document.createElement("p");
  const footerQuantitySpan = document.createElement("span");
  const footerTotal = document.createElement("div");
  const footerTotalP = document.createElement("p");
  const footerTotalSpan = document.createElement("span");

  footerContainer.classList.add("cart__footer");

  footerQuantity.classList.add("footer__quantity--container");
  footerQuantityP.innerText = "Quantidade";
  footerQuantitySpan.innerText = array.length;

  footerTotal.classList.add("footer__total--container");
  footerTotalP.innerText = "Total";
  footerTotalSpan.innerText = `R$ ${totalValue},00`;

  footerQuantity.append(footerQuantityP, footerQuantitySpan);

  footerTotal.append(footerTotalP, footerTotalSpan);

  footerContainer.append(footerQuantity, footerTotal);

  return footerContainer;
}

function addToCart() {
  const buttons = document.querySelectorAll(".list__item--button");

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productFound = data.find((product) => {
        return product.id === Number(event.target.dataset.id);
      });

      const productToCart = {
        ...productFound,
        cartId: cart.length + 1,
      };

      cart.push(productToCart);

      renderCart(cart);
    });
  });
}

function removeCart(array) {
  const removeBtns = document.querySelectorAll(".cart__button--remove");
  const container = document.querySelector(".toast__container");

  removeBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productInCart = array.find((product) => {
        return product.cartId === Number(event.target.dataset.cartId);
      });

      const productIndex = array.indexOf(productInCart);

      array.splice(productIndex, 1);

      renderCart(array);

      handleModal("Produto removido com sucesso", "#1C542D");

      setTimeout(() => {
        container.classList.add("toast__out");
      }, 2000);

      setTimeout(() => {
        container.close();
        container.classList.remove("toast__out");
      }, 2800);
    });
  });
}

function handleModal(message, color) {
  const container = document.querySelector(".toast__container");
  const msg = document.createElement("p");

  container.innerHTML = "";

  container.style.backgroundColor = color;

  msg.innerText = message;

  container.appendChild(msg);

  container.show();
}

renderProducts(data);

renderFilterProducts(data);

renderSearch();

renderCart(cart);

addToCart();

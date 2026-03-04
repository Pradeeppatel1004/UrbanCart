// // fetch("https://dummyjson.com/products?limit=20&skip=0")
// // .then(res=>res.json())
// // .then(allProducts=>{



// //     data=allProducts.products;
// //   const categories=[]


// //   data.forEach(product => {
// //       createItemCard(product);

// //       if(categories.findIndex(item => item===product.category)===-1)
// //       categories.push(product.category)
// //     });

// //     console.log(categories)

// // });
// // const productsContainer= document.getElementById("product");
// // var filtersDiv=document.querySelector(".filters"); //filter 
// // function createItemCard(product) {

// //   const productItem = document.createElement("div");
// //   productItem.className = "productItems";
// // filtersDiv.innerHTML='';  //filter
// // filtersDiv.innerHTML=`<button class="filterButton">All Products</button>`

// //   productItem.innerHTML = `

// //     <div class="productimg">
// //       <img class="product-card__image" 
// //       src="${product.images[0]}" 
// //       alt="${product.title.toUpperCase()}
// //       loading="lazy">
// //     </div>

// //     <div class="Product-cardCategories">
// //         <h3 class="ProductCategories">${product.category.toUpperCase()}</h3>
// //     </div>

// //     <div class="Product-card_Name">
// //         <p class="ProductName">${product.title}</p>
// //     </div>

// //     <div class="Product-card_Rating">
// //         <span>★★★★⯪ ${product.rating}</span>
// //     </div>

// //     <div class="Product-card_Cost">
// //         <span class="Cost2">$${product.price}</span>
// //     </div>

// //     <div class="Product-cardButton">
// //         <button>
// //            <b> Add to Cart </b>
// //         </button>
// //     </div>
// //   `;

// //   productsContainer.appendChild(productItem);
// // }

let data = [];
let filteredData = [];
let limit = 20;
let skip = 0;
let selectedCategory = "all";
let totalProducts = 0;
let cart = [];

const productsContainer = document.getElementById("product");
const filtersDiv = document.querySelector(".filters");
const loadMoreBtn = document.querySelector(".LoadButton");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const showCount = document.getElementById("showCount");
const cartCount = document.getElementById("cart-count");


// ===============================
// FETCH PRODUCTS
// ===============================
function fetchProducts() {

  let url = selectedCategory === "all"
    ? `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
    : `https://dummyjson.com/products/category/${selectedCategory}?limit=${limit}&skip=${skip}`;

  fetch(url)
    .then(res => res.json())
    .then(result => {

      totalProducts = result.total;
      const products = result.products;

      data = [...data, ...products];
      filteredData = [...data];

      renderProducts(filteredData);

      skip += limit;

      updateShowingCount();
    });
}


// ===============================
// RENDER PRODUCTS
// ===============================
function renderProducts(products) {

  productsContainer.innerHTML = "";

  products.forEach(product => {
    createItemCard(product);
  });

  updateShowingCount();
}


// ===============================
// CREATE PRODUCT CARD
// ===============================
function createItemCard(product) {

  const productItem = document.createElement("div");
  productItem.className = "productItems";

  productItem.innerHTML = `
    <div class="productimg">
      <img class="product-card__image"
        src="${product.images[0]}"
        alt="${product.title}">
    </div>

    <h3 class="ProductCategories">${product.category.toUpperCase()}</h3>
    <p class="ProductName">${product.title}</p>
    <div class="Product-card_Rating">
        <span>★★★★⯪ ${product.rating}</span>
    </div>
    <div class="Product-card_Cost">
        <span class="Cost2">$${product.price}</span>
    </div>
    <div class="Product-cardButton">
        <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">
           Add to Cart
        </button>
    </div>
  `;

  productsContainer.appendChild(productItem);
}


// ===============================
// ADD TO CART
// ===============================
function addToCart(id, title, price) {

  cart.push({ id, title, price });

  cartCount.textContent = cart.length;
}


// ===============================
// SEARCH FUNCTION
// ===============================
searchInput.addEventListener("keyup", () => {

  const value = searchInput.value.toLowerCase();

  filteredData = data.filter(product =>
    product.title.toLowerCase().includes(value)
  );

  renderProducts(filteredData);
});


// ===============================
// SORT FUNCTION
// ===============================
sortSelect.addEventListener("change", () => {

  let value = sortSelect.value;

  if (value === "low") {
    filteredData.sort((a, b) => a.price - b.price);
  }

  else if (value === "high") {
    filteredData.sort((a, b) => b.price - a.price);
  }

  else if (value === "rating") {
    filteredData.sort((a, b) => b.rating - a.rating);
  }

  else if (value === "name") {
    filteredData.sort((a, b) => a.title.localeCompare(b.title));
  }

  else {
    filteredData = [...data]; // Default
  }

  renderProducts(filteredData);
});


// ===============================
// UPDATE SHOWING COUNT
// ===============================
function updateShowingCount() {
  showCount.textContent =
    `Showing ${filteredData.length} of ${totalProducts} products`;
}


// ===============================
// CATEGORY BUTTONS
// ===============================
function fetchCategories() {

  fetch("https://dummyjson.com/products/category-list")
    .then(res => res.json())
    .then(categories => {

      filtersDiv.innerHTML = "";

      const allBtn = document.createElement("button");
      allBtn.textContent = "All Products";
      allBtn.className = "filterButton active";

      allBtn.addEventListener("click", () => {
        selectedCategory = "all";
        resetProducts();
      });

      filtersDiv.appendChild(allBtn);

      categories.forEach(category => {

        const btn = document.createElement("button");
        btn.textContent = category.toUpperCase();
        btn.className = "filterButton";

        btn.addEventListener("click", () => {
          selectedCategory = category;
          resetProducts();
        });

        filtersDiv.appendChild(btn);
      });
    });
}


// ===============================
// RESET PRODUCTS
// ===============================
function resetProducts() {
  productsContainer.innerHTML = "";
  data = [];
  filteredData = [];
  skip = 0;
  fetchProducts();
}


// ===============================
// LOAD MOREc
// ===============================
loadMoreBtn.addEventListener("click", () => {
  fetchProducts();
});


// ===============================
// INITIAL LOAD
// ===============================
fetchCategories();
fetchProducts();

function addToCart(id, title, price) {

    // Check if product already exists in cart
    let existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {
        // If already exists → increase quantity
        existingProduct.quantity += 1;
    } else {
        // If not exists → add new product
        cart.push({
            id: id,
            title: title,
            price: price,
            quantity: 1
        });
    }
    console.log("Cart Items:", cart);
    alert(title + " added to cart!");
}
updateCartCount();


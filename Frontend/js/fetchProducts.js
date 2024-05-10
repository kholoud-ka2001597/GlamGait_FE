function appendProducts(products, productContainer) {
  products.forEach((product, index) => {
    // Check if index is divisible by 3 (indicating a new row)
    if (index % 3 === 0) {
      // Create a new row element
      const row = document.createElement("div");
      row.classList.add("row");
      productContainer.appendChild(row); // Append the new row to the container
    }

    // Create product container
    const productDiv = document.createElement("div");
    productDiv.classList.add("col-4");

    // Create image element
    const link = document.createElement("a")
    const image = document.createElement("img");
    image.src = product.image;
    link.appendChild(image)
    link.href = `ProductDetails.html?q=${product.id}`;
    if (!localStorage.getItem("user")) {
      link.href = `Login.html`;
    }

    // Create heading
    const heading = document.createElement("h4");
    heading.textContent = product.name;

    // Create rating
    const ratingDiv = document.createElement("div");
    ratingDiv.classList.add("rating");
    for (let i = 0; i < 5; i++) {
      const star = document.createElement("i");
      if (i < product.rating) {
        star.classList.add("fa", "fa-star");
      } else {
        star.classList.add("fa", "fa-star-o");
      }
      ratingDiv.appendChild(star);
    }

    // Create price
    const price = document.createElement("p");
    price.textContent = product.price;

    // Append elements to product container
    productDiv.appendChild(link);
    productDiv.appendChild(heading);
    productDiv.appendChild(ratingDiv);
    productDiv.appendChild(price);

    // Append product container to current row
    const currentRow = productContainer.lastElementChild; // Get the last row created
    currentRow.appendChild(productDiv);
     // Append product to current row
     loader.style.display= 'none'
  });
}
function loadProducts(IsSearched,currenttab) {
  loader.style.display= 'block'
  let type = currenttab == 'all'  ? '' : currenttab ;
  let requestBody = {
    productName :  IsSearched ? searchInput.value.toLowerCase()  : '',
    type :type
  }
  fetch("http://localhost:3000/api/products/getProducts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  })
    .then((response) => response.json())
    .then((products) => {
      const productContainer = document.getElementById("productContainer");
      productContainer.innerHTML = ''
      productContainer.innerHTML += ` <div class="tab">
      <button class="tablinks ${currenttab == 'all' ? 'current' : ""}" onclick="loadProducts(false, 'all')">All</button>
      <button class="tablinks ${currenttab == 'men' ? 'current' : ""}" onclick="loadProducts(false, 'men')">Men</button>
      <button class="tablinks ${currenttab == 'woman' ? 'current' : ""}" onclick="loadProducts(false, 'woman')">Woman</button>
    </div>`;
      appendProducts(products, productContainer);
    })
    .catch((error) => console.error("Error loading products:", error));
    // 
}

const BuyerItems = [
  { text: "Products", link: "SearchProducts.html" },
  {text : "Purchase History",link:"PurchaseHistory.html"}
];

const SellerItems = [
  { text: "Add Product", link: "UploadItem.html" },
  { text: "Products", link: "SellingItems.html" },
];
function generateNavbar() {
  const navbar = document.getElementById("MenuItems");

  // Clear existing items
  navbar.innerHTML = "";
  if (localStorage.getItem("user")) {
    let userDetails = JSON.parse(localStorage.getItem("user"));
    console.log("userDetails", userDetails);
    let navItems = userDetails.type == "seller" ? SellerItems : BuyerItems;
    console.log("navItems", navItems);
    navItems.forEach((item) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = item.text;
      a.href = item.link;
      li.appendChild(a);
      navbar.appendChild(li);
    });
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.classList.add("btn-outline-danger");
    btn.textContent = "LOGOUT";
    btn.onclick = (event) => handlelogout(event)
    li.appendChild(btn);
    navbar.appendChild(li);
  }
  else{
    const li = document.createElement("li");
    const btn = document.createElement("a");
    btn.classList.add("btn-outline-danger");
    btn.textContent = "LOGIN";
    btn.style.fontSize= "16px"
    btn.href="Login.html";
    li.appendChild(btn);
    navbar.appendChild(li);
  }
}
function handlelogout(e){
  e.preventDefault()
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  window.location="Login.html";
}


function handleSubmit(e){
  e.preventDefault()
  loadProducts(true)
}
const loader = document.getElementById("loader");
// // Call the function to load products when the page loads
window.onload = () => {
  const searchInput = document.getElementById("searchInput");

  let cartItems =  JSON.parse(localStorage.getItem("cart")) || []
  if (cartItems.length > 0 && document.querySelector('.cart-badge')) document.querySelector('.cart-badge').textContent = cartItems.length
  generateNavbar();
  loadProducts(false,'all');
};

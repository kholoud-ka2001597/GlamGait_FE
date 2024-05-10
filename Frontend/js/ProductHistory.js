function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("q");
  let userDetails = JSON.parse(localStorage.getItem("user"));
  let allTx = [];
  let buyerDetails = {};
  let buyers = [];
  if (productId) {
    let requestBody = {
      productID: productId,
      sellerId: userDetails.id,
    };
    fetch("http://localhost:3000/api/products/getProductHistory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        const parentDiv = document.querySelector(
          ".small-container.single-product .row"
        );
        let allTx = data.allTx;
        // Create and append image div
        const imgDiv = document.createElement("div");
        imgDiv.classList.add("col-2");
        const img = document.createElement("img");
        img.src = data.product.image;
        img.style.width = "100%";
        imgDiv.appendChild(img);
        parentDiv.appendChild(imgDiv);

        // Create and append details div
        const detailsDiv = document.createElement("div");
        detailsDiv.classList.add("col-2");
        const p1 = document.createElement("p");
        p1.textContent = `Product History / ${data.product.name}`;
        const h1 = document.createElement("h1");
        h1.textContent = `${data.product.name} by HRX`;
        const h4 = document.createElement("h4");
        h4.textContent = data.product.price;

        const h3 = document.createElement("h3");
        h3.textContent = "Transaction Details";

        const transactionDetails = document.createElement("div");
        allTx.map((trans) => {
          const perTransaction = document.createElement("div");
          perTransaction.classList.add("transaction");
          const p2 = document.createElement("p");
          p2.textContent = `Order ID : ${trans.id}`;
          perTransaction.appendChild(p2);
          const p3 = document.createElement("p");
          p3.textContent = `Transaction Date : ${handleDate(
            trans.transactionTime
          )}`;
          perTransaction.appendChild(p3);
          const p4 = document.createElement("p");
          p4.textContent = `Customer : ${
            trans.buyer.firstName + " " + trans.buyer.lastName
          }`;
          perTransaction.appendChild(p4);
          transactionDetails.appendChild(perTransaction);
        });

        detailsDiv.appendChild(p1);
        detailsDiv.appendChild(h1);
        detailsDiv.appendChild(h4);
        detailsDiv.appendChild(h3);
        detailsDiv.appendChild(transactionDetails);
        parentDiv.appendChild(detailsDiv);
      })

      .catch((error) => console.error("Error loading products:", error));
  }
}
function handleDate(dateString) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add 1 to get the correct month (months are zero-based)
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  const formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
}
const BuyerItems = [
  { text: "Products", link: "SearchProducts.html" },
  { text: "Purchase History", link: "PurchaseHistory.html" },
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
    btn.onclick = (event) => handlelogout(event);
    li.appendChild(btn);
    navbar.appendChild(li);
  }
}
function handlelogout(e) {
  e.preventDefault();
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  window.location = "Login.html";
}

window.onload = () => {
  generateNavbar();
  loadProduct();
};

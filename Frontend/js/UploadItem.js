function handleFileChange(event) {
  console.log("event", event);
  const selectedFile = event.target.files[0];

  const fileNameSpan = document.querySelector(".file-name");
  fileNameSpan.textContent = selectedFile
    ? selectedFile.name
    : "No file chosen";
}

window.onload = function () {
  const fileInput = document.getElementById("file-input");
  fileInput.addEventListener("change", handleFileChange);
  generateNavbar();
};
async function uploadItem(e) {
  e.preventDefault();

  // Validate form fields
  const productName = document.getElementById("productName").value.trim();
  const quantity = document.getElementById("quantity").value.trim();
  const description = document.getElementById("description").value.trim();
  const productPrice = document.getElementById("productPrice").value.trim();
  const productType = document.getElementById("type").value.trim();
  const fileInput = document.getElementById("file-input");
  const selectedFile = fileInput.files[0];

  // Check if any field is empty
  if (
    !productName ||
    !quantity ||
    !description ||
    !productPrice ||
    !selectedFile
  ) {
    alert("All fields are required!");
    return;
  }


  // Check if price is valid
  if (productPrice < 5) {
    alert("Product price must be at least $5");
    return;
  }

  // Prepare form data
  let userDetails = JSON.parse(localStorage.getItem("user"));
  const formData = new FormData();
  formData.append("name", productName);
  formData.append("sellerId", userDetails.id);
  formData.append("quantity", quantity);
  formData.append("description", description);
  formData.append("price", `$${productPrice}`);
  formData.append("image", selectedFile);
  formData.append("type", productType);

  // Send POST request to Node.js server

    let resp = await fetch("http://localhost:3000/api/products/uploadProduct", {
      method: "POST",
      body: formData,
    });
    let data = await resp.json();
    console.log("Response from server:", data);
    alert("Product added successfully!");
  // document.getElementById('uploadItem').reset();
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

var MenuItems = document.getElementById("MenuItems");
MenuItems.style.maxHeight = "0px";
function menutoggle() {
  if (MenuItems.style.maxHeight == "0px") {
    MenuItems.style.maxHeight = "200px";
  } else {
    MenuItems.style.maxHeight = "0px";
  }
}
var LoginForm = document.getElementById("LoginForm");
var Indicator = document.getElementById("Indicator");
function login() {
  RegForm.style.transform = "translatex(300px)";
  LoginForm.style.transform = "translatex(300px)";
  Indicator.style.transform = "translate(0px)";
}

function authUser(e) {
  e.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  if (username && password) {
    // Prepare request body
    const requestBody = {
      username: username,
      password: password
    };

    // Send POST request to login API endpoint
    fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Authentication failed");
        }
      })
      .then((data) => {
        let loggedInUser = data;
        console.log("loggedIn", loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        let firstPage = loggedInUser.type === 'buyer' ? 'SearchProducts.html' : 'SellingItems.html';
        window.location.href = firstPage;
      })
      .catch((error) => console.error("Error authenticating user:", error));
  }
}


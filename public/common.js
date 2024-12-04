const authButton = document.getElementById("authButton");
const onlyAdminButton = document.getElementById("onlyAdminButton");
const userId = localStorage.getItem("user_id");
const authToken = localStorage.getItem("authToken");

updateAuthButton();

function updateAuthButton() {
  // Ensure authToken exists before decoding
  let userType = null;
  if (authToken) {
    try {
      const decodedToken = jwt_decode(authToken);
      userType = decodedToken.user_type;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  // Toggle admin-specific button visibility
  if(onlyAdminButton){
  if (userType === "admin") {
    onlyAdminButton.style.display = "block"; // Show the button
  } else {
    onlyAdminButton.style.display = "none"; // Hide the button
  }
}

  // Update the authentication button
  if (userId && authToken) {
    authButton.textContent = "SIGN OUT";
    authButton.href = "#";
    authButton.onclick = handleSignOut; // Attach click handler
  } else {
    authButton.textContent = "SIGN IN";
    authButton.href = "login.html";
    authButton.onclick = null; // Remove click handler
  }
}

function handleSignOut(event) {
  event.preventDefault();
  localStorage.clear();
  alert("You have signed out successfully.");
  updateAuthButton(); // Update button state
  window.location.href = "index.html"; // Redirect to home
}

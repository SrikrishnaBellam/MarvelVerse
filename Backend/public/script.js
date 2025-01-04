// Animations using GSAP
gsap.to("#nav", {
  backgroundColor: "#000",
  duration: 0.5,
  height: "90px",
  scrollTrigger: {
    trigger: "#nav",
    scroller: "body",
    start: "top -10%",
    end: "top -11%",
    scrub: 1,
  },
});

gsap.to("#main", {
  backgroundColor: "#000",
  scrollTrigger: {
    trigger: "#main",
    scroller: "body",
    start: "top -25%",
    end: "top -70%",
    scrub: 2,
  },
});

gsap.from("#nav a, #content a", {
  y: -100,
  duration: 1,
  delay: 1,
  opacity: 0,
  stagger: 0.2,
});

// Function to show popup notifications
function showPopup(message, isError = false) {
  const popup = document.getElementById("popup");
  popup.textContent = message;

  if (isError) {
    popup.classList.add("error");
  } else {
    popup.classList.remove("error");
  }

  popup.classList.add("visible");
  setTimeout(() => {
    popup.classList.remove("visible");
  }, 1000);
}

// Function to handle user login
async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch('https://marvelverse.onrender.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
});

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token); // Save token

      // Show success popup
      showPopup("Login successful!");

      // Redirect to dashboard.html after 2 seconds
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      // Show error popup for invalid credentials
      showPopup(data.message || "Invalid credentials. Please try again.", true);
    }
  } catch (error) {
    console.error("Login error:", error);
    showPopup("Something went wrong. Please try again.", true);
  }
}

// Function to handle user signup
async function signupUser() {
  const email = document.getElementById("email1").value;
  const password = document.getElementById("password1").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  console.log("Signup Data:", { email, password, confirmPassword });

  if (password !== confirmPassword) {
    showPopup("Passwords do not match.", true);
    return;
  }

  try {
    const response = await fetch('https://marvelverse.onrender.com/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
});

    const data = await response.json();
    if (response.ok) {
      showPopup("Signup successful! Please log in.");
      window.location.href = "index.html"; // Redirect to login
    } else {
      showPopup(data.message, true); // Show backend error message
    }
  } catch (error) {
    console.error("Signup error:", error);
    showPopup("Something went wrong. Please try again.", true);
  }
}

// Function to handle user logout
function logoutUser() {
  localStorage.removeItem("token"); // Remove JWT token
  showPopup("Logged out successfully!");
  window.location.href = "Backend/public/index.html"; // Redirect to login page
}

// Redirect if user is not authenticated
function checkAuthentication() {
  const token = localStorage.getItem("token");
  if (!token) {
    const currentPage = window.location.href;
    window.location.href = `index.html?redirect=${encodeURIComponent(currentPage)}`;
  }
}

// Automatically redirect after login
const urlParams = new URLSearchParams(window.location.search);
const redirectUrl = urlParams.get("redirect") || "dashboard.html";

// Apply checkAuthentication on protected pages
if (["dashboard.html", "merch.html", "community.html", "characters.html"].some(page => window.location.pathname.includes(page))) {
  checkAuthentication();
}

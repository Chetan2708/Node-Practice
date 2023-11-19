const createAccountForm = document.getElementById("create-account-form");

createAccountForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const pic = document.getElementById("pic").files[0];
  const confirmPassword = document.getElementById("confirm-password").value;
  const passwordMismatchError = document.getElementById("password-mismatch-error");

  if (password !== confirmPassword) {
    passwordMismatchError.style.display = "block";
    return;
  } else {
    passwordMismatchError.style.display = "none";
  }

  const formData = new FormData(); // Create a new FormData object

  // Append regular form fields to the formData
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);




  // Append the profile picture file to the formData
  formData.append("pic", pic);  

  console.log(formData); // This will show all the form data including the file
  fetch("/User-details", {
    method: "POST",
    body: formData, // Use the formData object as the body of the request
  })
    .then(function (response) {
      if (response.status === 200) {
        // Account created successfully, do something (e.g., show success message, redirect to login)
        window.location.href = "/login";
      } else if (response.status === 409) {
        alert("An account with this email or username already exists.");
      }  else {
        // Handle errors, e.g., display an error message to the user
        alert("Failed to create account. Please try again.");
      }
    })
    .catch(function (error) {
      console.error("Error submitting the form:", error);
      // Optionally, you can display an error message to the user here.
    });
});
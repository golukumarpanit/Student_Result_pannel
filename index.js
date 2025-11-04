function searchRoll() {
    let course = document.getElementById("course").value;
    let session = document.getElementById("Session").value;
    let roll = document.getElementById("rollNo").value.trim();

    if (course === "") {
      alert("⚠️ Please select a course!");
      return;
    }
    if (session === "") {
      alert("⚠️ Please select a session year!");
      return;
    }
    if (roll === "") {
      alert("⚠️ Please enter Roll Number!");
      return;
    }

    let url = "";

    // Condition check
    if (course === "adca" && session === "2024") {
      url = "ADCA2024.html?roll=" + encodeURIComponent(roll);
    } 
    else if (course === "adca" && session === "2025") {
      url = "ADCA2025.html?roll=" + encodeURIComponent(roll);
    } 
    else if (course === "typing2024" && session === "2024") {
      url = "Typing24.html?roll=" + encodeURIComponent(roll);
    } 
    else if (course === "typing2024" && session === "2025") {
      url = "Typing25.html?roll=" + encodeURIComponent(roll);
    }
    else {
      alert("⚠️ No page set for this combination!");
      return;
    }

    // Open in new tab
    window.open(url, "_blank");
  }
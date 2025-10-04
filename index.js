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
      url = "log.html?roll=" + encodeURIComponent(roll);
    } 
    else if (course === "typing2024" && session === "2024") {
      url = "typing.html?roll=" + encodeURIComponent(roll);
    } 
    else {
      alert("⚠️ No page set for this combination!");
      return;
    }

    // Open in new tab
    window.open(url, "_blank");
  }
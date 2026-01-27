// ADCA के लिए
function searchADCA() {
    const course = document.getElementById("adca-course").value;
    const session = document.getElementById("adca-session").value;
    const roll = document.getElementById("adca-rollNo").value.trim();
    
    validateAndOpen(course, session, roll);
}

// Typing के लिए  
function searchTyping() {
    const course = document.getElementById("typing-course").value;
    const session = document.getElementById("typing-session").value;
    const roll = document.getElementById("typing-rollNo").value.trim();
    
    validateAndOpen(course, session, roll);
}

// Marksheet के लिए
function searchMarksheet() {
    const course = document.getElementById("marksheet-course").value;
    const session = document.getElementById("marksheet-session").value;
    const roll = document.getElementById("marksheet-rollNo").value.trim();
    
    validateAndOpen(course, session, roll);
}

// Common validation + URL generation
function validateAndOpen(course, session, roll) {
    if (!course) { alert("⚠️ Course select करें!"); return; }
    if (!session) { alert("⚠️ Batch select करें!"); return; }
    if (!roll) { alert("⚠️ Roll Number डालें!"); return; }
    
    let url = "";
    if (course === "adca") {
        url = `ADCA${session}.html?roll=${encodeURIComponent(roll)}`;
    } else if (course === "typing2024") {
        url = `Typing${session.slice(2)}5.html?roll=${encodeURIComponent(roll)}`;
    } else if (course === "Marksheets") {
        url = session === "2025" ? 
            "https://marksheets2024.netlify.app/mark2025?roll=" + encodeURIComponent(roll) :
            "marksheets.html?roll=" + encodeURIComponent(roll);
    }
    
    window.open(url, "_blank");
}

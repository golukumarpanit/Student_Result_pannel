// ADCA के लिए
function searchADCA() {
    const course = document.getElementById("ADCA-COURSES").value;
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

        // Ye Url Kam nhi kr rha hai
    } else if (course === "typing2024") {
        url = `typing${session.slice(2)}.html?roll=${encodeURIComponent(roll)}`;
        // Yaha se Upar me update krna hai
        
    } else if (course === "Marksheets") {
        url = session === "2025" ? 
            "https://marksheets2024.netlify.app/mark2025?roll=" + encodeURIComponent(roll) :
            "marksheets.html?roll=" + encodeURIComponent(roll);
    }
    
    window.open(url, "_blank");
}

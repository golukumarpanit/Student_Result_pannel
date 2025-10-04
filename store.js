// ==========================
// Airtable Certificate Fetch + QR Code Script
// ==========================

// Airtable API Keys and Table Config
const API_KEY = 'patxNsgkdADYDxhX3.76bd2e1372398f07b3367fa55ed280c2d015a0f307d0427325073855fd9ff655'; // Airtable API Key
const BASE_ID = 'appQgYPqyGnNdrtlL';
const TABLE_NAME = 'GCSM2024';

let qr; // QR Code object

// ----------------------------
// Page Load Event - Initialize QR Code
// ----------------------------
window.onload = function () {
    qr = new QRCode(document.getElementById("qrcode"), {
        text: "QR will update after data load", // Placeholder text
        width: 200,
        height: 200
    });
};

// ----------------------------
// Fetch data for a specific roll number (Direct Filter)
// ----------------------------
async function fetchDataByRoll(roll) {
    // Airtable filterByFormula - direct search for ROLL_NUB
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula={ROLL_NUB}='${roll}'`;
    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();
    return data.records[0] || null; // Return first match or null
}

// ----------------------------
// Date Formatting Function (DD-MM-YYYY)
// ----------------------------
function formatDate(dobRaw) {
    if (!dobRaw) return '[DOB]';
    const date = new Date(dobRaw);
    if (isNaN(date.getTime())) return '[DOB]';
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
}

// ----------------------------
// Convert Google Drive Link to Direct Link
// ----------------------------
function getDirectDriveLink(driveLink) {
    let fileId = "";
    if (driveLink.includes("id=")) {
        fileId = driveLink.split("id=")[1];
    } else if (driveLink.includes("/d/")) {
        fileId = driveLink.split("/d/")[1].split("/")[0];
    }
    return fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : null;
}

// ----------------------------
// Update QR Code from Record Data
// ----------------------------
function updateQRfromRecord(record) {
    const name = record.fields.NAME || '[Student Name]';
    const father = record.fields.FATHERS_NAME || '[Father Name]';
    const course = record.fields.SELECT_COURSE || '[Course]';
    const roll = record.fields.ROLL_NUB || '[Roll No]';
    const ms = record.fields.Ms_Nub || '[Ms No]';
    const dobFormatted = formatDate(record.fields.DOB);

    const data = `Certificate Nub: ${ms}
    Roll No: ${roll}
    Name: ${name}
    Father's Name: ${father}
    Course: ${course}
    DOB: ${dobFormatted}`;

    qr.clear();
    qr.makeCode(data);
}

// ----------------------------
// Display Certificate Data in HTML
// ----------------------------
function displayCertificate(record) {
    const get = id => document.getElementById(id);
    const f = record.fields;

    // Fetching values with fallback
    const name = f.NAME || '[Student Name]';
    const father = f.FATHERS_NAME || '[Father Name]';
    const course = f.SELECT_COURSE || '[Course Name]';
    const roll = f.ROLL_NUB || '[Roll No]';
    const ms = f.Ms_Nub || '[Ms No]';
    const dobFormatted = formatDate(f.DOB);

    // Updating HTML elements
    get('studentName').innerText = name;
    get('nameInput').innerText = name;
    get('fatherName').innerText = father;
    get('fatherNameInput').innerText = father;
    get('courseName').innerText = course;
    get('courseName1').innerText = course;
    get('RollNubid').innerText = roll;
    get('roll2').innerText = roll;
    get('qrc').innerText = ms;
    get('qhrc').innerText = ms;
    get('dob2').innerText = dobFormatted;
    get('DOBfatch').innerText = dobFormatted;

    // Course duration mapping
    const durationMap = {
        'Advance Diploma in Computer Application': 'Twelve',
        'Diploma in Computer Application': 'Six',
        'English And Hindi Typing': 'Three'
    };
    const duration = durationMap[course] || '[Duration]';
    get('durationSelect').innerText = duration;
    get('selectedDuration').innerText = duration;

    // Photo handling
    const preview = document.getElementById('previewImage');
    const cropped = document.getElementById('croppedImage');
    if (f.photo && f.photo[0] && f.photo[0].url) {
        const photoURL = getDirectDriveLink(f.photo[0].url) || f.photo[0].url;
        preview.src = photoURL;
        cropped.src = photoURL;
        preview.style.display = "block";
        cropped.style.display = "block";
    } else {
        preview.style.display = "none";
        cropped.style.display = "none";
    }

    // Update QR Code
    updateQRfromRecord(record);
}

// ----------------------------
// Search Certificate Function
// ----------------------------
async function searchCertificate() {
    const inputId = document.getElementById('idInput').value.trim();
    const messageDiv = document.getElementById('message');

    if (!inputId) {
        messageDiv.innerText = 'Please enter an ID.';
        messageDiv.className = 'error';
        return;
    }

    messageDiv.innerText = 'Please wait... fetching data...';
    messageDiv.className = 'loading';

    try {
        const record = await fetchDataByRoll(inputId);
        if (record) {
            displayCertificate(record);
            messageDiv.innerText = 'Certificate Loaded Successfully!';
            messageDiv.className = 'success';
        } else {
            messageDiv.innerText = 'No record found for the given ID.';
            messageDiv.className = 'error';
        }
    } catch (error) {
        messageDiv.innerText = 'Error fetching data. Check API Key or Base ID.';
        messageDiv.className = 'error';
        console.error(error);
    }

    // Update page title with roll number
    document.title = inputId;  
}

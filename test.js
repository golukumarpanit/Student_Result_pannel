/* --------------------------
   Airtable API credentials
-----------------------------*/
const API_KEY = 'patxNsgkdADYDxhX3.76bd2e1372398f07b3367fa55ed280c2d015a0f307d0427325073855fd9ff655';  // अपना सही API की डालें  
const BASE_ID = 'appQgYPqyGnNdrtlL'; 
const TABLE_NAMES = ['GCSM2024', 'GCSM2025'];  // यहां दो टेबल्स fallback के लिए

/* --------------------------
   URL से roll number निकालना
-----------------------------*/
const urlParams = new URLSearchParams(window.location.search);
const rollNumber = urlParams.get("roll"); 

console.log("Roll Number:", rollNumber);

/* ---------------------------------------
   एक टेबल में record fetch करने वाला function
-----------------------------------------*/
async function fetchFromTable(tableName, roll) {
    const formula = `FIND("${roll}", {ROLL_NUB})`;
    const url = `https://api.airtable.com/v0/${BASE_ID}/${tableName}?filterByFormula=${encodeURIComponent(formula)}`;
    console.log('Fetching from:', url);

    try {
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${API_KEY}` }
        });
        if (!res.ok) {
            console.log('Fetch error:', res.status, res.statusText);
            return null;
        }

        const data = await res.json();
        if (data.records && data.records.length > 0) {
            return data.records[0].fields;
        }
        return null;
    } catch (err) {
        console.error('Fetch failed:', err);
        return null;
    }
}

/* ---------------------------------------
   दो टेबल्स में fallback के साथ record fetch करने वाला function
-----------------------------------------*/
async function fetchRecordByRollWithFallback(roll) {
    document.getElementById("errorMsg").innerText = "कृपया प्रतीक्षा करें, डेटा लोड हो रहा है..."; // please wait दिखाएं
    let fields = null;
    
    for (const tableName of TABLE_NAMES) {
        fields = await fetchFromTable(tableName, roll);
        if (fields) break; // मिला तो बाहर निकलो
    }

    if (fields) {
        displayCertificatell(fields);
        displayCertificate(fields);
        AkashpandeyLearn(fields);
        document.getElementById("errorMsg").innerText = ""; // error message हटाएं
    } else {
        document.getElementById("errorMsg").innerText = "❌ कोई रिकॉर्ड नहीं मिला!";
    }
}

/* ---------------------------------
   Data को HTML में दिखाने का function
-----------------------------------*/
function displayCertificate(fields) {
    document.getElementById("qrc").innerText = fields.Ms_Nub || "N/A";

    document.getElementById("RollNubid").innerText = fields.ROLL_NUB || "N/A";
    document.title = fields.ROLL_NUB ? `Certificate - ${fields.ROLL_NUB}` : "Certificate";

    document.getElementById("DOBfatch").innerText = fields.DOB || "N/A";
    document.getElementById("studentName").innerText = fields.NAME || "N/A";
    document.getElementById("fatherName").innerText = fields.FATHERS_NAME || "N/A";

    let adcacourse = fields.SELECT_COURSE || "CHELA";
    let duration = "Duration";

    switch (adcacourse.toLowerCase()) {
        case "english and hindi typing":
            duration = "six";
            break;
        case "diploma in computer application":
            duration = "six";
            break;
        default:
            duration = "please visit";
    }

    document.getElementById("courseName").innerText = adcacourse;
    document.getElementById("selectedDuration").innerText = duration;    
    document.getElementById("englishspeed").innerText = fields.English_SPD || "N/A";
    document.getElementById("hindispeed").innerText = fields.Hindi_SPD || "N/A";
}

/* ---------------------------------
   QR Code Initialization & Update
-----------------------------------*/
let qr;

window.onload = function () {
    qr = new QRCode(document.getElementById("qrcode"), {
        text: "Loading QR...",
        width: 200,
        height: 200
    });

    if (rollNumber) {
        fetchRecordByRollWithFallback(rollNumber);
    } else {
        document.getElementById("errorMsg").innerText = "⚠️ कृपया रोल नंबर प्रदान करें!";
        document.title = "No Roll Number"; 
    }
};

/* ---------------------------------
   QR Code में डेटा डालने वाला function
-----------------------------------*/
function AkashpandeyLearn(fields) {    
    const qrData = `Certificate Nub: ${fields.Ms_Nub || "N/A"}
Roll No: ${fields.ROLL_NUB || "N/A"}
Name: ${fields.NAME || "N/A"}
Father's Name: ${fields.FATHERS_NAME || "N/A"}
Course: ${fields.SELECT_COURSE || "N/A"}
Hindi Speed : ${fields.Hindi_SPD || "N/A"}   
English Speed : ${fields.English_SPD || "N/A"}`;

    qr.clear();
    qr.makeCode(qrData);
}

/* ---------------------------------
   Title अपडेट करने वाला function
-----------------------------------*/
function displayCertificatell(fields) {
    const roll = fields.ROLL_NUB || "N/A";
    document.getElementById("RollNubid").innerText = roll;
    document.title = `${roll}`;
}

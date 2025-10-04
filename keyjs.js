/* --------------------------
   Airtable API credentials
-----------------------------*/
const API_KEY = 'patxNsgkdADYDxhX3.76bd2e1372398f07b3367fa55ed280c2d015a0f307d0427325073855fd9ff655';       
const BASE_ID = 'appQgYPqyGnNdrtlL'; 
const TABLE_NAME = 'GCSM2024';        

/* --------------------------
   URL से roll number निकालना
-----------------------------*/
const urlParams = new URLSearchParams(window.location.search);
const rollNumber = urlParams.get("roll"); 

console.log("Roll Number:", rollNumber);

/* ---------------------------------------
   Airtable से उस roll का record लाना
-----------------------------------------*/
async function fetchRecordByRoll(roll) {

        const spinner = document.getElementById("spinner");
        const message = document.getElementById("message");
    try {
        const formula = `FIND("${roll}", {ROLL_NUB})`;
        const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(formula)}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${API_KEY}` }
        });

        const data = await res.json();

            if (data.records && data.records.length > 0) {
                displayCertificatell(data.records[0].fields); 
                displayCertificate(data.records[0].fields); 

        } else {
            document.getElementById("errorMsg").innerText = "❌ No record found!";
        }
        
        
    } catch (err) {
        document.getElementById("errorMsg").innerText = "⚠️ Error loading record.";
        console.error(err);
    }
}
//yaha se jo equation liye hai o yaha fetch ho rha hai
if (rollNumber) {
    fetchRecordByRoll(rollNumber);
} else {
    document.getElementById("errorMsg").innerText = "⚠️ No roll number provided!";
}
/* ---------------------------------
   Data को HTML में दिखाने का function
-----------------------------------*/
function displayCertificate(fields) {
    // Text fields set करना
    document.getElementById("qrc").innerText = fields.Ms_Nub || "N/A";
    document.getElementById("RollNubid").innerText = fields.ROLL_NUB || "N/A";
    document.getElementById("DOBfatch").innerText = fields.DOB || "N/A";
    document.getElementById("studentName").innerText = fields.NAME || "N/A";
    document.getElementById("fatherName").innerText = fields.FATHERS_NAME || "N/A";

    // Course selection code
    let adcacourse = fields.SELECT_COURSE || "CHELA";
    let duration = "Duration";

    switch (adcacourse.toLowerCase()) {
        case "advance diploma in computer application":
            duration = "twelve";
            break;
        case "diploma in computer application":
            duration = "six";
            break;
        default:
            duration = "please visit";
    }

    document.getElementById("courseName").innerText = adcacourse;
    document.getElementById("selectedDuration").innerText = duration;
    document.getElementById("studentIssueDate").innerText = fields.ISSUE_DATE || "N/A";

    // PHOTO लोड करना
    const preview = document.getElementById('previewImage');
    const cropped = document.getElementById('croppedImage');

    if (fields.Photo && Array.isArray(fields.Photo) && fields.Photo.length > 0) {
        const photoURL = fields.Photo[0].url; // Airtable attachment का URL
        preview.src = photoURL;
        cropped.src = photoURL;
        preview.style.display = "block";
        cropped.style.display = "block";
    } else {
        preview.style.display = "none";
        cropped.style.display = "none";
    }
}
/* --------------------------
   Page load → fetch record
-----------------------------*/

// yaha hme qr update krna hai 
// QR code initialize (placeholder) → इसे page load में ही define कर दो
let qr;

window.onload = function () {
    qr = new QRCode(document.getElementById("qrcode"), {
        text: "Loading QR...", // yaha se text dikh rha hai        
           
        width: 200, //qr ka height and witdh set huua
        height: 200
    });
};
// Ye Fuction qr me data lane me help krega
function AkashpandeyLearn(fields) {    
    // Step 2: अब QR code में नया data डालो
    const qrData = `Certificate Nub: ${fields.Ms_Nub || "N/A"}
    Roll No: ${fields.ROLL_NUB || "N/A"}
    Name: ${fields.NAME || "N/A"}
    Father's Name: ${fields.FATHERS_NAME || "N/A"}
    Course: ${fields.SELECT_COURSE || "N/A"}`;

    qr.clear();        // पहले वाला QR code साफ कर दो
    qr.makeCode(qrData); // नया QR code बना दो
    
}
async function AkashpandeyLearne(roll) {
    try {
        const formula = `FIND("${roll}", {ROLL_NUB})`;
        const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(formula)}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${API_KEY}` }
        });

        const data = await res.json();

        if (data.records && data.records.length > 0) {
            AkashpandeyLearn(data.records[0].fields); 
        } else {
            document.getElementById("errorMsg").innerText = "❌ No record found!";
        }
        
        
    } catch (err) {
        document.getElementById("errorMsg").innerText = "⚠️ Error loading record.";
        console.error(err);
    }
}
//yaha se jo equation liye hai o yaha fetch ho rha hai
if (rollNumber) {
    AkashpandeyLearne(rollNumber);
} else {
    document.getElementById("errorMsg").innerText = "⚠️ No roll number provided!";
}

// -------------------------------
// Function: Airtable से आने वाले fields से Image लगाना
// -------------------------------


    fetchPhoto();
    async function fetchPhoto() {
      const message = document.getElementById("message");
      const photoElement = document.getElementById("croppedImage");

      try {
        // Airtable से data fetch करना
        const response = await fetch(
          `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula={ROLL_NUB}="${rollNumber}"`, 
          {
            headers: { Authorization: `Bearer ${API_KEY}` }
          }
        );

        const data = await response.json();
        console.log("Airtable Response:", data);

        if (data.records.length > 0) {
          const fields = data.records[0].fields;

          if (fields.photo && Array.isArray(fields.photo) && fields.photo.length > 0) {
            console.log("Photo URL Found:", fields.photo[0].url);
            photoElement.src = fields.photo[0].url;
            photoElement.style.display = "block";
            message.innerText = "Photo Loaded Successfully!";
          } else {
            console.log("No Photo Found, showing default image");
            photoElement.src = "default-photo.png";
            photoElement.style.display = "block";
            message.innerText = "No Photo Found (Showing Default)";
          }
        } else {
          console.log("No record found for this roll number");
          message.innerText = "No Record Found for Roll: " + rollNumber;
          photoElement.style.display = "none";
        }
      } catch (error) {
        console.error("Error fetching photo:", error);
        message.innerText = "Error fetching data!";
        photoElement.style.display = "none";
      }
    }

    fetchPhoto();

    // yha se title and roll number update krna hai
    function displayCertificatell(fields) {
        const roll = fields.ROLL_NUB || "N/A";
        document.getElementById("RollNubid").innerText = roll;

        // ✅ Title को यहाँ set कर रहे हैं
        document.title = roll;
    }

    // ✅ अब rollNumber check कर सकते हैं
    if (rollNumber) {
        fetchRecordByRoll(rollNumber);
    } else {
        document.getElementById("errorMsg").innerText = "⚠️ No roll number provided!";
        document.title = "No Roll Number"; 
    }





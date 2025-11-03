{/* <script> */}
const API_KEY = 'AIzaSyA2UyAU-6qR-nwwfauzdFG-CxhpVSSh8yw';
const SPREADSHEET_ID = '1SdqNmP_dzx3FWWICBsWipdNNxU6iFADySaKtWRE1yrM';
const SHEET_NAME = 'Sheet2';
let cropper, qr;

// ✅ Column convert helper
function columnToLetter(column) {
  let temp, letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

// 🔹 मुख्य function जो cache + data + photo + QR सब संभालेगा
async function fetchFullData() {
  const roll = document.getElementById("idInput").value.trim();
  const message = document.getElementById("message");
  const errorMsg = document.getElementById("errorMsg");
  const photoElement = document.getElementById("previewImage");
  const photopreview = document.getElementById("croppedImage");

  if (!roll) {
    message.innerText = "⚠️ कृपया रोल नंबर दर्ज करें!";
    return;
  }

  // ✅ पहले cache चेक करो
  const cached = sessionStorage.getItem(`roll_${roll}`);
  if (cached) {
    const fields = JSON.parse(cached);
    displayFields(fields);
    displayPhotoAndQR(fields);
    message.innerText = "✅ Cached Data लोड हुआ (कोई API खर्च नहीं)";
    console.log("🟢 Cached data loaded!");
    return;
  }

  // ❌ Cache नहीं मिला → API चलाओ
  message.innerText = "⏳ डेटा लोड हो रहा है...";
  errorMsg.innerText = "";

  try {
    // Sheet properties fetch
    const sheetPropsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets(properties(title,gridProperties))&key=${API_KEY}`;
    const propsRes = await fetch(sheetPropsUrl);
    const propsData = await propsRes.json();
    const sheet = propsData.sheets.find(s => s.properties.title === SHEET_NAME);
    const rowCount = sheet.properties.gridProperties.rowCount;
    const colCount = sheet.properties.gridProperties.columnCount;
    const lastColumnLetter = columnToLetter(colCount);
    const fullRange = `${SHEET_NAME}!A1:${lastColumnLetter}${rowCount}`;

    // सभी values लाओ
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${fullRange}?key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const rows = data.values;
    const headers = rows[0];
    const rollIndex = headers.indexOf("ROLL_NUB");
    const photoIndex = headers.indexOf("photourl");

    const record = rows.find((row, i) => i > 0 && (row[rollIndex] === roll || row[0] === roll));
    if (!record) {
      errorMsg.innerText = "❌ रिकॉर्ड नहीं मिला।";
      message.innerText = "";
      return;
    }

    // Field Mapping
    const fields = {};
    headers.forEach((h, i) => fields[h] = record[i] || "N/A");

    // ✅ Cache में सेव कर दो (ताकि reload पर दोबारा API न लगे)
    sessionStorage.setItem(`roll_${roll}`, JSON.stringify(fields));

    // ✅ Display data
    displayFields(fields);
    displayPhotoAndQR(fields);
    message.innerText = "✅ डेटा और फोटो सफलतापूर्वक लोड हो गए! (API used once)";
  } catch (err) {
    console.error("Error:", err);
    errorMsg.innerText = "⚠️ डेटा लाने में त्रुटि हुई।";
    message.innerText = "";
  }
}

// 🔹 Text fields show करने वाला function
function displayFields(fields) {
  document.getElementById("RollNubid").innerText = fields['ROLL_NUB'] || "N/A";
  document.getElementById("studentName").innerText = fields['NAME'] || "N/A";
  document.getElementById("fatherName").innerText = fields['FATHERS_NAME'] || "N/A";
  document.getElementById("DOBfatch").innerText = fields['DOB'] || "N/A";
  document.getElementById("courseName").innerText = fields['SELECT_COURSE'] || "N/A";
  document.getElementById("englishspeed").innerText = fields['English_Typ'] || "N/A";
  document.getElementById("hindispeed").innerText = fields['Hindi_Typ'] || "N/A";
  document.title = fields['ROLL_NUB'] || "Certificate Search";
}

// 🔹 QR और फोटो दिखाने वाला function
function displayPhotoAndQR(fields) {
  const qrData = `
    Certificate No: ${fields['Ms_Nub'] || "N/A"}
    Roll No: ${fields['ROLL_NUB'] || "N/A"}
    Name: ${fields['NAME'] || "N/A"}
    Father's Name: ${fields['FATHERS_NAME'] || "N/A"}
    DOB: ${fields['DOB'] || "N/A"}
    Course: ${fields['SELECT_COURSE'] || "N/A"}
  `;
  qr.clear();
  qr.makeCode(qrData);

  const photoElement = document.getElementById("previewImage");
  const photopreview = document.getElementById("croppedImage");
  const rawLink = fields['photourl'];
  if (!rawLink) return;

  let fileIdMatch = rawLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
  let fileId = fileIdMatch ? fileIdMatch[1] : null;
  if (!fileId) {
    const idMatch = rawLink.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) fileId = idMatch[1];
  }

  if (fileId) {
    const imageUrl = `https://lh3.googleusercontent.com/d/${fileId}=s800`;
    photoElement.src = imageUrl;
    photopreview.src = imageUrl;
    photoElement.style.display = "block";
    photopreview.style.display = "block";

    if (cropper) cropper.destroy();
    cropper = new Cropper(photoElement, {
      viewMode: 1,
      autoCropArea: 0.8,
      crop() {
        const canvas = cropper.getCroppedCanvas({ width: 200, height: 200 });
        photopreview.src = canvas.toDataURL();
      }
    });
  }
}

// 🔹 Page load पर QR init और auto-load
window.addEventListener("load", () => {
  // Loading शुरू
  const loadingScreen = document.getElementById("loadingScreen");
  const mainContent = document.getElementById("mainContent");
  const loadingText = document.getElementById("loadingText");

  // पहले "Please Wait..." दिखे
  loadingScreen.style.display = "flex";
  mainContent.style.display = "none";

  qr = new QRCode(document.getElementById("qrcode"), {
    text: "QR will update after data load",
    width: 200,
    height: 200
  });

  const urlParams = new URLSearchParams(window.location.search);
  const rollNumber = urlParams.get("roll");
  if (rollNumber) {
    document.getElementById("idInput").value = rollNumber;

    // डेटा लाने का async process
    fetchFullData().then(() => {
      // ✅ जब डेटा आ जाए तब loading हटाओ
      loadingScreen.style.display = "none";
      mainContent.style.display = "block";
    }).catch(() => {
      loadingText.innerText = "❌ Error fetching data! Please reload.";
    });
  } else {
    loadingText.innerText = "⚠️ Roll Number Missing in URL!";
  }
});
// </script>

const API_KEY = "AIzaSyA2UyAU-6qR-nwwfauzdFG-CxhpVSSh8yw";
const SPREADSHEET_ID = "1QYQfaKsb0W_6s18Bw4Dcj1iNr3xeaoMEmmKb1gT-ahU";
const RANGE = "Sheet1";

const ROLL_COLUMN_INDEX = 0;
const MS_COLUMN_INDEX = 1;
const NAME_COLUMN_INDEX = 2;
const FATHER_COLUMN_INDEX = 3;
const DOB_COLUMN_INDEX = 4;
const Third_COLUMN_INDEX = 5;
const Forth_COLUMN_INDEX = 6;
const Total_COLUMN_INDEX = 7;
const Percentage_COLUMN_INDEX = 8;

function getURLParam(name) {
  const u = new URL(window.location.href);
  return u.searchParams.get(name);
}

async function fetchSheetValues() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  const resp = await fetch(url);
  const data = await resp.json();
  return data.values || [];
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, m => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#039;'
  }[m]));
}

// 🔹 LocalStorage Save Function
function saveToLocal(roll, data) {
  localStorage.setItem("gcsm_roll", roll);
  localStorage.setItem("gcsm_data", JSON.stringify(data));
}

// 🔹 Display Function (data दिखाने के लिए)
function showData(found, roll) {
  document.getElementById('rollDisplay').textContent = escapeHtml(roll);
  document.getElementById('sessionupdate').textContent = "20-02-2024";

  document.getElementById('msDisplay').textContent = escapeHtml(found[MS_COLUMN_INDEX] || "-");
  document.getElementById('nameDisplay').textContent = escapeHtml(found[NAME_COLUMN_INDEX] || "-");
  document.getElementById('fatherDisplay').textContent = escapeHtml(found[FATHER_COLUMN_INDEX] || "-");        
  document.getElementById('Second_Term').textContent = escapeHtml(found[DOB_COLUMN_INDEX] || "-");
  document.getElementById('Third_Term').textContent = escapeHtml(found[Third_COLUMN_INDEX] || "-");
  document.getElementById('Forth_Term').textContent = escapeHtml(found[Forth_COLUMN_INDEX] || "-");
  document.getElementById('Total_Marks').textContent = escapeHtml(found[Total_COLUMN_INDEX] || "-");
  document.getElementById('Percentage_value').textContent = escapeHtml(found[Percentage_COLUMN_INDEX] || "-");

  document.getElementById("loader").style.display = "none";
  document.querySelector(".container").style.display = "block";
}

// 🔹 Main Function
async function searchByRoll(roll) {
  try {
    // 🔸 पहले localStorage चेक करो
    const savedRoll = localStorage.getItem("gcsm_roll");
    const savedData = localStorage.getItem("gcsm_data");

    if (savedRoll === roll && savedData) {
      const found = JSON.parse(savedData);
      showData(found, roll);
      return; // API दोबारा नहीं चलेगी
    }

    // 🔸 अगर localStorage में नहीं मिला तो API कॉल करो
    const rows = await fetchSheetValues();
    const dataRows = rows.slice(1);
    const found = dataRows.find(r => (r[ROLL_COLUMN_INDEX] || "").trim() === roll);

    if (!found) {
      document.getElementById("loader").innerHTML = `<div style="color:red; font-size:18px;">❌ Roll "${roll}" नहीं मिला।</div>`;
      return;
    }

    // 🔸 localStorage में सेव करो और डेटा दिखाओ
    saveToLocal(roll, found);
    showData(found, roll);

  } catch (err) {
    document.getElementById("loader").innerHTML = `<div style="color:red;">⚠️ Error loading data.<br>${escapeHtml(err.message)}</div>`;
  }
}

// 🔹 Page Load पर चलने वाला कोड
document.addEventListener("DOMContentLoaded", () => {
  const roll = getURLParam("roll");
  if (roll) {
    searchByRoll(roll);
  } else {
    document.getElementById("loader").innerHTML = `<div style="color:red; font-size:18px;">कृपया URL में ?roll=ROLLNUMBER डालें।</div>`;
  }
});

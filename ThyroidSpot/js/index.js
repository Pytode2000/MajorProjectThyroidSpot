// GET DOM
const patientBox = document.getElementById("patientBox");
const staffBox = document.getElementById("staffBox");
const togglePatientBtn = document.getElementById("togglePatientBtn");
const toggleStaffBtn = document.getElementById("toggleStaffBtn");

// SHOW PATIENT GUIDE, HIDE STAFF GUIDE. 
function togglePatient() {
    staffBox.classList.add("hide");
    patientBox.classList.remove("hide");

    togglePatientBtn.classList.add("active");
    toggleStaffBtn.classList.remove("active");
}

// SHOW STAFF GUIDE, HIDE PATIENT GUIDE. 
function toggleStaff() {
    patientBox.classList.add("hide");
    staffBox.classList.remove("hide");

    toggleStaffBtn.classList.add("active");
    togglePatientBtn.classList.remove("active");
}
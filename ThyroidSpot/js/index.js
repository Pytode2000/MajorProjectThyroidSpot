


// GET DOM

const patientBox = document.getElementById("patientBox");
const staffBox = document.getElementById("staffBox");
const togglePatientBtn = document.getElementById("togglePatientBtn");
const toggleStaffBtn = document.getElementById("toggleStaffBtn");

// SHOW Patient, HIDE STAFF
function togglePatient() {
    staffBox.classList.add("hide");
    patientBox.classList.remove("hide");

    togglePatientBtn.classList.add("active");
    toggleStaffBtn.classList.remove("active");
}

// SHOW LOGIN FORM, HIDE REGISTER FORM. 
function toggleStaff() {
    patientBox.classList.add("hide");
    staffBox.classList.remove("hide");

    toggleStaffBtn.classList.add("active");
    togglePatientBtn.classList.remove("active");
}
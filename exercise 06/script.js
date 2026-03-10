// Array to store form data
let students = JSON.parse(localStorage.getItem("students")) || [];

// Add form data
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("studentForm");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            let name = document.getElementById("name").value;
            let email = document.getElementById("email").value;
            let age = document.getElementById("age").value;

            let student = { name, email, age };
            students.push(student);

            localStorage.setItem("students", JSON.stringify(students));

            form.reset();
            alert("Data Added Successfully!");
        });
    }

    // If on output page, load table
    if (document.getElementById("dataTable")) {
        loadTable();
    }
});

// Load table data
function loadTable() {
    let tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";

    students.forEach(student => {
        let row = `<tr>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.age}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Option 1: Open new page
function openNewPage() {
    window.open("output.html", "_blank");
}

// Option 2: Copy Data
function copyData() {
    let text = JSON.stringify(students, null, 2);
    navigator.clipboard.writeText(text);
    alert("Data Copied Successfully!");
}

// Download CSV
function downloadCSV() {
    let csv = "Name,Email,Age\n";

    students.forEach(student => {
        csv += `${student.name},${student.email},${student.age}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let url = window.URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();

    window.URL.revokeObjectURL(url);
}
$(document).ready(function () {
    // Function to display messages
    function displayMessage(message, type = "info") {
        const messageElement = $("#message");
        messageElement.text(message);
        messageElement.css("color", type === "error" ? "red" : "green");
    }

    // Login form submission
    $("#loginForm").submit(function (e) {
        e.preventDefault();
        const username = $("#username").val().trim();
        const password = $("#password").val().trim();

        if (!username || !password) {
            displayMessage("Please enter both username and password.", "error");
            return;
        }

        $.ajax({
            url: "/cgi-bin/login.py",
            type: "POST",
            data: { username: username, password: password },
            success: function (response) {
                if (response.status === "success") {
                    console.log(response.message);
                    window.location.href = response.redirect;
                } else {
                    displayMessage(response.message || "Invalid username or password.", "error");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Request failed: ${textStatus} - ${errorThrown}`);
                displayMessage("An error occurred while logging in.", "error");
            },
        });
    });

    // Register form submission
    $("#registerForm").submit(function (e) {
        e.preventDefault();
        const username = $("#username").val().trim();
        const password = $("#password").val().trim();

        if (!username || !password) {
            displayMessage("Please fill out all required fields.", "error");
            return;
        }

        $.ajax({
            url: "../cgi-bin/register.py",
            type: "POST",
            data: { username: username, password: password },
            success: function (response) {
                if (response.status === "success") {
                    displayMessage("Registration successful. Redirecting to login...", "success");
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 2000);
                } else {
                    displayMessage(response.message || "Username already exists.", "error");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Request failed: ${textStatus} - ${errorThrown}`);
                displayMessage("An error occurred during registration.", "error");
            },
        });
    });

});


$(document).ready(function () {
    // Display messages
    function displayMessage(message, type = "info") {
        const messageElement = $("#message");
        messageElement.text(message);
        messageElement.css("color", type === "error" ? "red" : "green");
    }

    // Show modals
    const addSchoolModal = $("#addSchoolModal");
    const updateSchoolModal = $("#updateSchoolModal");

    $("#addSchoolButton").click(() => addSchoolModal.show());
    $("#addModalClose").click(() => addSchoolModal.hide());
    $("#updateModalClose").click(() => updateSchoolModal.hide());

    // Fetch schools
    function fetchSchools() {
        $.ajax({
            url: "../cgi-bin/manage_schools.py",
            type: "POST",
            data: { action: "list" },
            success: function (response) {
                if (response.status === "success") {
                    const schools = response.schools;
                    const schoolsList = $("#schoolsList");
                    schoolsList.empty();
                    schools.forEach(school => {
                        const listItem = $(`
                            <li class="schoolCard">
                                <div class="schoolDetails">
                                    <span><strong>ID:</strong> ${school.id}</span>
                                    <span><strong>Name:</strong> ${school.name}</span>
                                    <span><strong>Address:</strong> ${school.address}</span>
                                </div>
                                <div class="schoolListBtn">
                                    <button class="editSchoolButton" data-id="${school.id}" data-name="${school.name}" data-address="${school.address}">Edit</button>
                                    <button class="deleteSchoolButton" data-id="${school.id}">Delete</button>
                                </div>
                            </li>
                        `);
                        schoolsList.append(listItem);
                    });
                } else {
                    displayMessage(response.message || "Failed to fetch schools.", "error");
                }
            },
            error: function () {
                displayMessage("Error fetching schools.", "error");
            }
        });
    }

    fetchSchools();

    // Add school
    $("#addSchoolForm").submit(function (e) {
        e.preventDefault();
        const name = $("#addSchoolName").val().trim();
        const address = $("#addSchoolAddress").val().trim();

        $.ajax({
            url: "../cgi-bin/manage_schools.py",
            type: "POST",
            data: { action: "add", name: name, address: address },
            success: function (response) {
                if (response.status === "success") {
                    displayMessage("School added successfully.", "success");
                    fetchSchools();
                    addSchoolModal.hide();
                } else {
                    displayMessage(response.message || "Failed to add school.", "error");
                }
            },
            error: function () {
                displayMessage("Error adding school.", "error");
            }
        });
    });

    // Edit school
    $(document).on("click", ".editSchoolButton", function () {
        const schoolId = $(this).data("id");
        const schoolName = $(this).data("name");
        const schoolAddress = $(this).data("address");

        $("#updateSchoolId").val(schoolId);
        $("#updateSchoolName").val(schoolName);
        $("#updateSchoolAddress").val(schoolAddress);

        updateSchoolModal.show();
    });

    $("#updateSchoolForm").submit(function (e) {
        e.preventDefault();
        const id = $("#updateSchoolId").val().trim();
        const name = $("#updateSchoolName").val().trim();
        const address = $("#updateSchoolAddress").val().trim();

        $.ajax({
            url: "../cgi-bin/manage_schools.py",
            type: "POST",
            data: { action: "update", id: id, name: name, address: address },
            success: function (response) {
                if (response.status === "success") {
                    displayMessage("School updated successfully.", "success");
                    fetchSchools();
                    updateSchoolModal.hide();
                } else {
                    displayMessage(response.message || "Failed to update school.", "error");
                }
            },
            error: function () {
                displayMessage("Error updating school.", "error");
            }
        });
    });

    // Delete school
    $(document).on("click", ".deleteSchoolButton", function () {
        const schoolId = $(this).data("id");
    
        if (confirm("Are you sure you want to delete this school?")) {
            $.ajax({
                url: "../cgi-bin/manage_schools.py",
                type: "POST",
                data: { action: "delete", id: schoolId },
                success: function (response) {
                    if (response.status === "success") {
                        displayMessage("School deleted successfully.", "success");
                        fetchSchools(); // Refresh the schools list
                    } else {
                        displayMessage(response.message || "Failed to delete school.", "error");
                    }
                },
                error: function () {
                    displayMessage("Error deleting school.", "error");
                }
            });
        }
    });
    
});



// $(document).ready(function () {
//     $.ajax({
//         url: "../cgi-bin/api.py",
//         method: "GET",
//         data: { action: "progress" },
//         success: function (response) {
//             if (response.status === "success") {
//                 const data = response.data;
//                 const ctx = document.getElementById("progressChart").getContext("2d");
//                 new Chart(ctx, {
//                     type: "pie",
//                     data: {
//                         labels: ["Users", "Schools"],
//                         datasets: [{
//                             data: [data.users, data.schools],
//                             backgroundColor: ["#4CAF50", "#FF5722"],
//                             hoverBackgroundColor: ["#66BB6A", "#FF7043"]
//                         }]
//                     }
//                 });
//             } else {
//                 console.error("API Error:", response.message);
//             }
//         },
//         error: function (xhr, status, error) {
//             console.error("AJAX Error:", status, error);
//         }
//     });
// });

$(document).ready(function () {
    $.ajax({
        url: "../cgi-bin/api.py",
        method: "GET",
        data: { action: "progress" },
        success: function (response) {
            if (response.status === "success") {
                const data = response.data;

                // Render Pie Chart
                const pieCtx = document.getElementById("progressChart").getContext("2d");
                new Chart(pieCtx, {
                    type: "pie",
                    data: {
                        labels: ["Users", "Schools"],
                        datasets: [{
                            data: [data.users, data.schools],
                            backgroundColor: ["#4CAF50", "#FF5722"],
                            hoverBackgroundColor: ["#66BB6A", "#FF7043"]
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true, // Keeps the aspect ratio
                        aspectRatio: 2, // Reduces height relative to width
                    }
                });
                

                // Render Bar Chart
                const barCtx = document.getElementById("barChart").getContext("2d");
                new Chart(barCtx, {
                    type: "bar",
                    data: {
                        labels: ["Users", "Schools"],
                        datasets: [{
                            label: "Count",
                            data: [data.users, data.schools],
                            backgroundColor: ["#4CAF50", "#FF5722"]
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        aspectRatio: 2,
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: "User and School Counts"
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: "Count"
                                }
                            }
                        }
                    }
                });
            } else {
                console.error("API Error:", response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error:", status, error);
        }
    });
});


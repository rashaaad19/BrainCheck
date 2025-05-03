// Handle clicks on restricted links
document.addEventListener("DOMContentLoaded", () => {
    const restrictedLinks = document.querySelectorAll(".restricted");
    restrictedLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("authModal").checked = true;
        });
    });
});

// document.getElementById("authModal").checked = true;
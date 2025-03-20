async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    // ✅ Send DELETE request to the server
    const response = await fetch("/Admin/DeleteUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: userId })
    });

    if (response.ok) {
        // ✅ If success, turn row red, then fade out
        const row = document.getElementById(`row-${userId}`);
        if (!row) return;

        // 1) Turn row red
        row.classList.add("deleted-row");

        // 2) After 2s, start fading out
        setTimeout(() => {
            row.classList.add("fade-out-delete");
        }, 2000);

        // 3) Remove the row from the DOM
        setTimeout(() => {
            row.remove();
        }, 3000);
    } else {
        alert("Failed to delete user.");
    }
}

// card-menu.js

function toggleMenu(projectId) {
    const overlayId = 'overlay-' + projectId;
    const overlayMenu = document.getElementById(overlayId);
    if (!overlayMenu) return;

    // Hide any currently open overlay menus
    document.querySelectorAll('.overlay-menu').forEach(menu => {
        // if it's open, close it
        menu.style.display = 'none';
    });

    // Toggle the selected one
    if (overlayMenu.style.display === 'block') {
        overlayMenu.style.display = 'none';
    } else {
        overlayMenu.style.display = 'block';
    }
}


// Opens the modal and loads member checkboxes
async function openAddRemoveMemberModal(projectId) {
    console.log(`Opening modal for project ID: ${projectId}`);
    document.getElementById('modalProjectId').value = projectId;
    document.getElementById('addRemoveMemberModal').style.display = 'flex';

    // Clear the search input and results
    document.getElementById('modalSearchInput').value = '';
    document.getElementById('modalSearchResults').innerHTML = '';

    const modalMemberList = document.getElementById('modalMemberList');
    modalMemberList.innerHTML = '<p>Loading members...</p>';

    try {
        // Only fetch assigned members initially
        const urlAssigned = `${window.location.origin}/Member/GetMembers?projectId=${projectId}`;
        console.log(`Fetching assigned members from: ${urlAssigned}`);
        const respAssigned = await fetch(urlAssigned);
        if (!respAssigned.ok) throw new Error(`HTTP error! Status: ${respAssigned.status} URL: ${respAssigned.url}`);
        const currentMembers = await respAssigned.json();
        console.log("Current Members:", currentMembers);

        // Render only the current members
        renderCheckboxList(currentMembers);
    } catch (err) {
        console.error("Error loading members:", err);
        document.getElementById('modalMemberList').innerHTML = `<p>Failed to load members: ${err.message}</p>`;
    }
}

// Renders the checkboxes for members in the modal
function renderCheckboxList(members) {
    const modalMemberList = document.getElementById('modalMemberList');
    modalMemberList.innerHTML = ''; // Clear previous content

    if (!members || members.length === 0) {
        modalMemberList.innerHTML = '<p>No members assigned to this project.</p>';
        return;
    }

    // Generate HTML for each member
    const html = members.map(member => {
        const avatarUrl = member.imageData?.currentImage || '/images/membericon/default-avatar.png';
        return `
          <label class="member-label">
            <input type="checkbox" name="MemberIds" value="${member.id}" checked>
            <img src="${avatarUrl}" alt="${member.firstName} ${member.lastName}" 
                 style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
            ${member.firstName} ${member.lastName}
          </label>
        `;
    }).join('');

    modalMemberList.innerHTML = html;
    console.log("Members rendered in modal.");
}

// Closes the modal
function closeAddRemoveMemberModal() {
    document.getElementById('addRemoveMemberModal').style.display = 'none';
}

// Optional: Search functionality for the modal's search bar.
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('modalSearchInput');
    const searchResults = document.getElementById('modalSearchResults');
    if (!searchInput || !searchResults) return;

    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        try {
            const urlSearch = `${window.location.origin}/Member/Search?term=${encodeURIComponent(query)}`;
            console.log(`Searching members from: ${urlSearch}`);
            const resp = await fetch(urlSearch);
            if (!resp.ok) throw new Error(`HTTP error! Status: ${resp.status}`);
            const matches = await resp.json();
            // Render search results including email
            searchResults.innerHTML = '';
            matches.forEach(m => {
                console.log("Member data:", m);
                console.log("Image path:", m.imageData?.currentImage);
                const li = document.createElement('li');
                const img = document.createElement('img');
                img.src = m.imageData?.currentImage || '/images/membericon/default-avatar.png';
                console.log("Final image src:", img.src);
                img.alt = `${m.firstName} ${m.lastName}`;
                img.style.width = '30px';
                img.style.height = '30px';
                img.style.borderRadius = '50%';
                img.style.marginRight = '10px';
                li.appendChild(img);
                li.appendChild(document.createTextNode(`${m.firstName}`));
                const space = document.createTextNode(' ');
                li.appendChild(space);
                li.appendChild(document.createTextNode(`${m.lastName}`));
                li.style.display = 'flex';
                li.style.alignItems = 'center';
                li.style.padding = '5px';
                li.style.cursor = 'pointer';
                li.addEventListener('click', () => addMemberFromSearch(m));
                searchResults.appendChild(li);
            });
        } catch (err) {
            console.error("Search error:", err);
        }
    });
});

// When a search result is clicked, add that member to the checkbox list
function addMemberFromSearch(member) {
    console.log("Member object:", member);
    console.log("Member image data:", member.imageData);
    console.log("Member image path:", member.imageData?.currentImage);

    const modalMemberList = document.getElementById('modalMemberList');
    let checkbox = modalMemberList.querySelector(`input[name="MemberIds"][value="${member.id}"]`);
    if (checkbox) {
        checkbox.checked = true;
        checkbox.scrollIntoView({ behavior: "smooth", block: "center" });
        console.log(`Checkbox for member ${member.id} checked.`);
    } else {
        const avatarUrl = member.imageData?.currentImage || '/images/membericon/default-avatar.png';
        console.log("Using avatar URL:", avatarUrl);
        const label = document.createElement('label');
        label.classList.add("member-label");

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'MemberIds';
        input.value = member.id;
        input.checked = true;

        const img = document.createElement('img');
        img.src = avatarUrl;
        img.alt = `${member.firstName} ${member.lastName}`;
        img.style.width = '30px';
        img.style.height = '30px';
        img.style.borderRadius = '50%';
        img.style.marginRight = '10px';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = `${member.firstName} ${member.lastName}`;

        label.appendChild(input);
        label.appendChild(img);
        label.appendChild(nameSpan);

        modalMemberList.appendChild(label);
        console.log(`Checkbox for member ${member.id} created and checked.`);
    }

    document.getElementById('modalSearchInput').value = '';
    document.getElementById('modalSearchResults').innerHTML = '';
}

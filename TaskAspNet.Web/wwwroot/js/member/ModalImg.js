document.addEventListener("DOMContentLoaded", function () {
    // -- CHOOSE FILE & PREVIEW --
    const triggerFileInput = document.getElementById("triggerFileInput");
    const fileInput = document.getElementById("fileInput");
    const imagePreview = document.getElementById("imagePreview");
    const hiddenCurrentImage = document.getElementById("hiddenCurrentImage");
    const hiddenSelectedImage = document.getElementById("hiddenSelectedImage");
    const selectImage = document.getElementById("selectImage");
    const saveBtn = document.getElementById("saveImageSelection");

    // -- CHOOSE FILE & PREVIEW --
    if (triggerFileInput && fileInput) {
        triggerFileInput.addEventListener("click", function () {
            fileInput.click();
        });
    }

    if (fileInput && imagePreview) {
        fileInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // -- SELECT PREDEFINED IMAGE --
    if (selectImage && imagePreview) {
        selectImage.addEventListener("change", function () {
            const selectedValue = this.value;
            if (selectedValue) {
                imagePreview.src = "/images/membericon/" + selectedValue;
                imagePreview.style.display = "block";
            }
        });
    }

    // -- SAVE IMAGE SELECTION --
    if (saveBtn && imagePreview) {
        saveBtn.addEventListener("click", function () {
            const chosenSrc = imagePreview.src;
            const cameraPreview = document.getElementById("cameraPreview");

            if (cameraPreview) {
                cameraPreview.src = chosenSrc;
            }

            // Update hidden fields based on selection type
            if (hiddenCurrentImage) {
                if (chosenSrc.startsWith("data:")) {
                    // For uploaded files (data URLs)
                    hiddenCurrentImage.value = chosenSrc;
                    if (hiddenSelectedImage) {
                        hiddenSelectedImage.value = "";
                    }
                } else if (chosenSrc.includes("/membericon/")) {
                    // For predefined images
                    hiddenCurrentImage.value = chosenSrc;
                    if (hiddenSelectedImage) {
                        hiddenSelectedImage.value = chosenSrc.split("/membericon/")[1];
                    }
                }
            }

            // Close modal using site.js functionality
            const uploadModal = document.getElementById("uploadModal");
            if (uploadModal) {
                uploadModal.style.display = "none";
            }
        });
    }
}); 
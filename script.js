const BACKEND_URL = "https://aquapix-api.pahujanayan.tech/enhance"


function previewImage() {
    const fileInput = document.getElementById('imageUpload');
    const previewArea = document.getElementById('previewArea');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewArea.innerHTML = `<img src="${e.target.result}" alt="Selected Image">`;
        };
        reader.readAsDataURL(file);
    } else {
        previewArea.innerHTML = '<p>No image selected</p>';
    }
}

function uploadImage() {
    const fileInput = document.getElementById('imageUpload');
    const resultArea = document.getElementById('resultArea');
    const loader = document.getElementById('loader');
    const processingText = document.getElementById('processingText');
    
    // Show loader and processing message
    loader.classList.remove('hidden');
    processingText.classList.remove('hidden');

    const imageData = new FormData();
    imageData.append('file', fileInput.files[0]);

    fetch(BACKEND_URL, {
        method: 'POST',
        body: imageData
    })
    .then(response => response.blob())
    .then(blob => {
        // Hide loader and processing message
        loader.classList.add('hidden');
        processingText.classList.add('hidden');

        // Convert blob to an image and display
        const imageUrl = URL.createObjectURL(blob);
        resultArea.innerHTML = `<img src="${imageUrl}" alt="Enhanced Image">`;
    })
    .catch(error => {
        console.error('Error enhancing the image:', error);
        loader.classList.add('hidden');
        processingText.classList.add('hidden');
        resultArea.innerHTML = '<p>Error enhancing the image. Please try again.</p>';
    });
};

function resetImage() {
    const fileInput = document.getElementById('imageUpload');
    const previewArea = document.getElementById('previewArea');
    const resultArea = document.getElementById('resultArea');
    const loader = document.getElementById('loader');
    const processingText = document.getElementById('processingText');

    fileInput.value = '';  // Reset file input
    previewArea.innerHTML = '<p>No image selected</p>';  // Clear preview area
    resultArea.innerHTML = '<p>Enhanced image will be displayed here</p>';  // Clear result area
    
    loader.classList.add('hidden');
    processingText.classList.add('hidden');
}

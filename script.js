const BACKEND_URL = "https://aquapix-api.pahujanayan.tech/enhance";
const sampleImages = [
    '/sample-images/test1.jpg',
    '/sample-images/test2.jpg',
    '/sample-images/test3.jpg',
    '/sample-images/test4.jpg',
    '/sample-images/test5.jpg',
    '/sample-images/test6.jpg',
];

let selectedSampleImage = null;  // Track selected sample image

function previewImage() {
    const fileInput = document.getElementById('imageUpload');
    const previewArea = document.getElementById('previewArea');
    const file = fileInput.files[0];
    selectedSampleImage = null;  // Clear selected sample image if file is chosen

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

function useSampleImage() {
    const previewArea = document.getElementById('previewArea');
    const fileInput = document.getElementById('imageUpload');
    
    // Reset file input and randomly select a sample image
    fileInput.value = '';
    selectedSampleImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    
    // Display the selected sample image in preview
    previewArea.innerHTML = `<img src="${selectedSampleImage}" alt="Sample Image">`;
}

function uploadImage() {
    const fileInput = document.getElementById('imageUpload');
    const resultArea = document.getElementById('resultArea');
    const loader = document.getElementById('loader');
    const processingText = document.getElementById('processingText');
    const downloadBtn = document.getElementById('downloadBtn');
    
    loader.classList.remove('hidden');
    processingText.classList.remove('hidden');
    
    const imageData = new FormData();

    // If file is selected, use it; otherwise, use the selected sample image
    if (fileInput.files[0]) {
        imageData.append('file', fileInput.files[0]);
    } else if (selectedSampleImage) {
        fetch(selectedSampleImage)
            .then(res => res.blob())
            .then(blob => {
                imageData.append('file', blob, 'sample.jpg');
                sendImageToBackend(imageData);
            });
        return;
    } else {
        alert('Please select an image or use a sample image.');
        loader.classList.add('hidden');
        processingText.classList.add('hidden');
        return;
    }

    sendImageToBackend(imageData);
}

function sendImageToBackend(imageData) {
    const resultArea = document.getElementById('resultArea');
    const loader = document.getElementById('loader');
    const processingText = document.getElementById('processingText');
    const downloadBtn = document.getElementById('downloadBtn');
    
    fetch(BACKEND_URL, {
        method: 'POST',
        body: imageData
    })
    .then(response => response.blob())
    .then(blob => {
        loader.classList.add('hidden');
        processingText.classList.add('hidden');

        const imageUrl = URL.createObjectURL(blob);
        resultArea.innerHTML = `<img src="${imageUrl}" alt="Enhanced Image">`;

        downloadBtn.classList.remove('hidden');
        downloadBtn.onclick = () => downloadImage(imageUrl);
    })
    .catch(error => {
        console.error('Error enhancing the image:', error);
        loader.classList.add('hidden');
        processingText.classList.add('hidden');
        resultArea.innerHTML = '<p>Error enhancing the image. Please try again.</p>';
    });
}

function downloadImage(imageUrl) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'enhanced_image.jpg';
    link.click();
}

function resetImage() {
    const fileInput = document.getElementById('imageUpload');
    const previewArea = document.getElementById('previewArea');
    const resultArea = document.getElementById('resultArea');
    const loader = document.getElementById('loader');
    const processingText = document.getElementById('processingText');
    const downloadBtn = document.getElementById('downloadBtn');
    
    selectedSampleImage = null;  // Reset sample image selection
    fileInput.value = '';
    previewArea.innerHTML = '<p>No image selected</p>';
    resultArea.innerHTML = '<p>Enhanced image will be displayed here</p>';
    
    loader.classList.add('hidden');
    processingText.classList.add('hidden');
    downloadBtn.classList.add('hidden');
}

// Global variables
let stream = null;
let capturedImage = null;
let reportImages = [];
let currentStep = 'home';

// DOM elements
const homePage = document.getElementById('homePage');
const reportFlow = document.getElementById('reportFlow');
const downloadPage = document.getElementById('downloadPage');
const captureStep = document.getElementById('captureStep');
const annotateStep = document.getElementById('annotateStep');
const summaryStep = document.getElementById('summaryStep');
const finalizeStep = document.getElementById('finalizeStep');

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
    setupEventListeners();
    showPage('home');
});

// Event listeners setup
function setupEventListeners() {
    // Navigation
    document.getElementById('homeBtn').addEventListener('click', () => showPage('home'));
    document.getElementById('startReportBtn').addEventListener('click', startReport);

    // Camera controls
    document.getElementById('captureBtn').addEventListener('click', captureImage);
    document.getElementById('selectImageBtn').addEventListener('click', selectImage);
    document.getElementById('retakeBtn').addEventListener('click', retakeImage);
    document.getElementById('nextToAnnotateBtn').addEventListener('click', () => showStep('annotate'));

    // File input
    document.getElementById('imageFileInput').addEventListener('change', handleFileSelect);

    // Annotation controls
    document.getElementById('backToCaptureBtn').addEventListener('click', () => showStep('capture'));
    document.getElementById('addToReportBtn').addEventListener('click', addToReport);

    // Summary controls
    document.getElementById('addMoreBtn').addEventListener('click', () => showStep('capture'));
    document.getElementById('finalizeReportBtn').addEventListener('click', () => showStep('finalize'));

    // Finalize controls
    document.getElementById('generatePdfBtn').addEventListener('click', generatePDF);

    // Download controls
    document.getElementById('downloadPdfBtn').addEventListener('click', downloadPDF);
    document.getElementById('restartReportBtn').addEventListener('click', restartApp);
}

// Page navigation
function showPage(page) {
    currentStep = page;

    // Hide all pages
    homePage.classList.add('hidden');
    reportFlow.classList.add('hidden');
    downloadPage.classList.add('hidden');

    // Show selected page
    switch (page) {
        case 'home':
            homePage.classList.remove('hidden');
            break;
        case 'report':
            reportFlow.classList.remove('hidden');
            showStep('capture');
            break;
        case 'download':
            downloadPage.classList.remove('hidden');
            break;
    }
}

// Step navigation within report flow
function showStep(step) {
    // Hide all steps
    captureStep.classList.add('hidden');
    annotateStep.classList.add('hidden');
    summaryStep.classList.add('hidden');
    finalizeStep.classList.add('hidden');

    // Show selected step
    switch (step) {
        case 'capture':
            captureStep.classList.remove('hidden');
            startCamera();
            break;
        case 'annotate':
            annotateStep.classList.remove('hidden');
            displayCapturedImage();
            setTimestamp();
            break;
        case 'summary':
            summaryStep.classList.remove('hidden');
            displayImagesList();
            break;
        case 'finalize':
            finalizeStep.classList.remove('hidden');
            break;
    }
}

// Start the report process
function startReport() {
    showPage('report');
}

// Camera functionality
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });

        const video = document.getElementById('camera');
        video.srcObject = stream;

        // Reset capture state
        document.getElementById('captureBtn').classList.remove('hidden');
        document.getElementById('selectImageBtn').classList.remove('hidden');
        document.getElementById('retakeBtn').classList.add('hidden');
        document.getElementById('nextToAnnotateBtn').classList.add('hidden');
        document.getElementById('camera').classList.remove('hidden');
        document.getElementById('canvas').classList.add('hidden');

    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Não foi possível acessar a câmera. Certifique-se de ter concedido permissões de câmera.');
    }
}

// Capture image from camera
function captureImage() {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    capturedImage = canvas.toDataURL('image/jpeg', 0.8);

    // Update UI
    document.getElementById('captureBtn').classList.add('hidden');
    document.getElementById('selectImageBtn').classList.add('hidden');
    document.getElementById('retakeBtn').classList.remove('hidden');
    document.getElementById('nextToAnnotateBtn').classList.remove('hidden');
    document.getElementById('camera').classList.add('hidden');
    document.getElementById('canvas').classList.remove('hidden');

    // Stop camera stream
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}

// Select image from device
function selectImage() {
    document.getElementById('imageFileInput').click();
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            capturedImage = e.target.result;

            // Update UI to show selected image
            document.getElementById('captureBtn').classList.add('hidden');
            document.getElementById('selectImageBtn').classList.add('hidden');
            document.getElementById('retakeBtn').classList.remove('hidden');
            document.getElementById('nextToAnnotateBtn').classList.remove('hidden');
            document.getElementById('camera').classList.add('hidden');
            document.getElementById('canvas').classList.remove('hidden');

            // Display the selected image
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            img.src = capturedImage;
        };
        reader.readAsDataURL(file);
    }
}

// Retake image
function retakeImage() {
    capturedImage = null;
    // Clear file input
    document.getElementById('imageFileInput').value = '';
    showStep('capture');
}

// Display captured image in annotation step
function displayCapturedImage() {
    if (capturedImage) {
        document.getElementById('previewImage').src = capturedImage;
    }
}

// Set timestamp for current image
function setTimestamp() {
    const now = new Date();
    const timestamp = now.toLocaleString();
    document.getElementById('timestamp').textContent = timestamp;
}

// Add image to report
function addToReport() {
    const title = document.getElementById('imageTitle').value.trim();
    const description = document.getElementById('imageDescription').value.trim();

    if (!title) {
        alert('Por favor, digite um título para a imagem.');
        return;
    }

    if (!capturedImage) {
        alert('Nenhuma imagem capturada. Por favor, capture uma imagem primeiro.');
        return;
    }

    // Create image object
    const imageData = {
        id: Date.now(),
        image: capturedImage,
        title: title,
        description: description,
        timestamp: new Date().toLocaleString()
    };

    // Add to report
    reportImages.push(imageData);

    // Clear form
    document.getElementById('imageTitle').value = '';
    document.getElementById('imageDescription').value = '';

    // Show summary
    showStep('summary');
}

// Display images list in summary
function displayImagesList() {
    const imagesList = document.getElementById('imagesList');
    imagesList.innerHTML = '';

    reportImages.forEach((imageData, index) => {
        const imageCard = document.createElement('div');
        imageCard.className = 'bg-gray-50 rounded-lg p-4 border';
        imageCard.innerHTML = `
            <div class="relative">
                <img src="${imageData.image}" alt="${imageData.title}" class="w-full h-32 object-cover rounded mb-2">
                <button onclick="removeImage(${index})" class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <h3 class="font-semibold text-gray-900 text-sm mb-1">${imageData.title}</h3>
            <p class="text-gray-600 text-xs mb-1">${imageData.description || 'Sem descrição'}</p>
            <p class="text-gray-500 text-xs">${imageData.timestamp}</p>
        `;
        imagesList.appendChild(imageCard);
    });
}

// Remove image from report
function removeImage(index) {
    if (confirm('Tem certeza de que deseja remover esta imagem?')) {
        reportImages.splice(index, 1);
        displayImagesList();
    }
}

// Generate PDF
function generatePDF() {
    const reportTitle = document.getElementById('reportTitle').value.trim();
    const authorName = document.getElementById('authorName').value.trim();
    const clientInfo = document.getElementById('clientInfo').value.trim();

    if (!reportTitle || !authorName) {
        alert('Por favor, preencha todos os campos obrigatórios (Título do Relatório e Nome do Autor).');
        return;
    }

    if (reportImages.length === 0) {
        alert('Nenhuma imagem no relatório. Por favor, adicione pelo menos uma imagem.');
        return;
    }

    // Create PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title page
    doc.setFontSize(24);
    doc.text(reportTitle, 105, 40, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Autor: ${authorName}`, 105, 60, { align: 'center' });
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 105, 70, { align: 'center' });

    if (clientInfo) {
        doc.text(`Cliente: ${clientInfo}`, 105, 80, { align: 'center' });
    }

    // Add images
    let yPosition = 120;
    let pageNumber = 1;

    reportImages.forEach((imageData, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
            doc.addPage();
            pageNumber++;
            yPosition = 20;
        }

        // Add image title
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${imageData.title}`, 20, yPosition);

        // Add image
        try {
            const img = new Image();
            img.src = imageData.image;

            // Calculate image dimensions to fit on page
            const maxWidth = 170;
            const maxHeight = 100;
            let imgWidth = img.width;
            let imgHeight = img.height;

            // Scale down if necessary
            if (imgWidth > maxWidth) {
                const ratio = maxWidth / imgWidth;
                imgWidth = maxWidth;
                imgHeight = imgHeight * ratio;
            }

            if (imgHeight > maxHeight) {
                const ratio = maxHeight / imgHeight;
                imgHeight = maxHeight;
                imgWidth = imgWidth * ratio;
            }

            doc.addImage(imageData.image, 'JPEG', 20, yPosition + 5, imgWidth, imgHeight);

            // Add description
            if (imageData.description) {
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                doc.text(imageData.description, 20, yPosition + imgHeight + 15);
            }

            // Add timestamp
            doc.setFontSize(8);
            doc.text(`Data/Hora: ${imageData.timestamp}`, 20, yPosition + imgHeight + 25);

            yPosition += imgHeight + 40;

        } catch (error) {
            console.error('Error adding image to PDF:', error);
            doc.text('Erro ao carregar imagem', 20, yPosition + 10);
            yPosition += 30;
        }
    });

    // Save PDF to global variable for download
    window.generatedPDF = doc;

    // Show download page
    showPage('download');
}

// Download PDF
function downloadPDF() {
    if (window.generatedPDF) {
        const reportTitle = document.getElementById('reportTitle').value.trim();
        const filename = `${reportTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.pdf`;
        window.generatedPDF.save(filename);
    }
}

// Restart the app
function restartApp() {
    // Reset all data
    reportImages = [];
    capturedImage = null;
    window.generatedPDF = null;

    // Clear form fields
    document.getElementById('reportTitle').value = '';
    document.getElementById('authorName').value = '';
    document.getElementById('clientInfo').value = '';
    document.getElementById('imageTitle').value = '';
    document.getElementById('imageDescription').value = '';
    document.getElementById('imageFileInput').value = '';

    // Stop any active camera stream
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    // Show home page
    showPage('home');
}

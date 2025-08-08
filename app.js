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
    document.getElementById('retakeFromEditBtn').addEventListener('click', retakeFromEdit);
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

    // Calculate responsive dimensions for captured image
    let { width, height } = constrainImageSize(video.videoWidth, video.videoHeight);

    // Set canvas size to constrained dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw video frame to canvas with constrained size
    ctx.drawImage(video, 0, 0, width, height);

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

            // Display the selected image with responsive sizing
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = function () {
                // Calculate responsive dimensions
                let { width, height } = constrainImageSize(img.width, img.height);

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
            };
            img.src = capturedImage;
        };
        reader.readAsDataURL(file);
    }
}

// Constrain image size while maintaining aspect ratio based on screen dimensions
function constrainImageSize(originalWidth, originalHeight) {
    // Get screen dimensions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate responsive max dimensions (80% of screen width, 60% of screen height)
    const maxWidth = Math.min(screenWidth * 0.8, 800); // Cap at 800px for very large screens
    const maxHeight = Math.min(screenHeight * 0.6, 600); // Cap at 600px for very large screens

    let width = originalWidth;
    let height = originalHeight;

    // Calculate aspect ratio
    const aspectRatio = width / height;

    // Constrain by width
    if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
    }

    // Constrain by height
    if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
    }

    return { width, height };
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
        imageCard.className = 'bg-gray-50 rounded-lg p-4 border cursor-move hover:shadow-md transition-shadow duration-200';
        imageCard.draggable = true;
        imageCard.dataset.index = index;
        imageCard.innerHTML = `
            <div class="relative">
                <img src="${imageData.image}" alt="${imageData.title}" class="w-full h-32 object-cover rounded mb-2">
                <div class="absolute top-2 right-2 flex space-x-1">
                    <button onclick="editImage(${index})" class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-600">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="removeImage(${index})" class="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="absolute top-2 left-2 bg-gray-800 bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    <i class="fas fa-grip-vertical"></i>
                </div>
            </div>
            <h3 class="font-semibold text-gray-900 text-sm mb-1">${imageData.title}</h3>
            <p class="text-gray-600 text-xs mb-1">${imageData.description || 'Sem descrição'}</p>
            <p class="text-gray-500 text-xs">${imageData.timestamp}</p>
        `;

        // Add drag event listeners
        imageCard.addEventListener('dragstart', handleDragStart);
        imageCard.addEventListener('dragover', handleDragOver);
        imageCard.addEventListener('drop', handleDrop);
        imageCard.addEventListener('dragenter', handleDragEnter);
        imageCard.addEventListener('dragleave', handleDragLeave);
        imageCard.addEventListener('dragend', handleDragEnd);

        imagesList.appendChild(imageCard);
    });
}

// Drag and drop variables
let draggedElement = null;

// Drag and drop handlers
function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.6';
    this.style.transform = 'scale(1.05)';
    this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    this.classList.add('border-blue-500', 'border-2');
}

function handleDragLeave(e) {
    this.classList.remove('border-blue-500', 'border-2');
}

function handleDragEnd(e) {
    // Reset dragged element styles
    if (draggedElement) {
        draggedElement.style.opacity = '';
        draggedElement.style.transform = '';
        draggedElement.style.boxShadow = '';
    }
    draggedElement = null;
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('border-blue-500', 'border-2');

    // Reset dragged element styles
    if (draggedElement) {
        draggedElement.style.opacity = '';
        draggedElement.style.transform = '';
        draggedElement.style.boxShadow = '';
    }

    if (draggedElement !== this) {
        const draggedIndex = parseInt(draggedElement.dataset.index);
        const dropIndex = parseInt(this.dataset.index);

        // Reorder the array
        const [movedItem] = reportImages.splice(draggedIndex, 1);
        reportImages.splice(dropIndex, 0, movedItem);

        // Refresh the display
        displayImagesList();
    }
}

// Edit image metadata
function editImage(index) {
    const imageData = reportImages[index];

    // Store current image for editing
    capturedImage = imageData.image;

    // Fill the form with current data
    document.getElementById('imageTitle').value = imageData.title;
    document.getElementById('imageDescription').value = imageData.description || '';

    // Remove the image from the array (will be re-added with updated data)
    reportImages.splice(index, 1);

    // Go to annotation step
    showStep('annotate');
}

// Retake photo from edit screen
function retakeFromEdit() {
    // Clear the current image
    capturedImage = null;

    // Clear form fields
    document.getElementById('imageTitle').value = '';
    document.getElementById('imageDescription').value = '';

    // Go back to capture step
    showStep('capture');
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
        const downloadBtn = document.getElementById('downloadPdfBtn');
        const originalText = downloadBtn.innerHTML;

        // Update button to show downloading state
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Baixando...';
        downloadBtn.disabled = true;
        downloadBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        downloadBtn.classList.add('bg-gray-400');

        // Get filename
        const reportTitle = document.getElementById('reportTitle').value.trim();
        const filename = `${reportTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.pdf`;

        // Download the PDF
        window.generatedPDF.save(filename);

        // Reset button after a short delay
        setTimeout(() => {
            downloadBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Baixado com Sucesso!';
            downloadBtn.classList.remove('bg-gray-400');
            downloadBtn.classList.add('bg-green-600');

            // Reset to original state after 3 seconds
            setTimeout(() => {
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
                downloadBtn.classList.remove('bg-green-600');
                downloadBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
            }, 3000);
        }, 1000);
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

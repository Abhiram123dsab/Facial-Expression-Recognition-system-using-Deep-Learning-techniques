document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadResult = document.getElementById('uploadResult');
    const expressionResult = document.getElementById('expressionResult');
    const confidenceResult = document.getElementById('confidenceResult');
    const chartContainer = document.getElementById('chartContainer');

    // Webcam Elements
    const webcamElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('canvas');
    const startWebcamBtn = document.getElementById('startWebcam');
    const stopWebcamBtn = document.getElementById('stopWebcam');
    const captureBtn = document.getElementById('captureBtn');
    const webcamResult = document.getElementById('webcamResult');
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    // Chart variables
    let emotionChart = null;

    // Check if model is loaded
    fetch('/check_model')
        .then(response => response.json())
        .then(data => {
            if (data.status !== 'Model file exists') {
                showAlert('Model file not found. Please train the model first.', 'danger');
            }
        })
        .catch(error => {
            console.error('Error checking model:', error);
            showAlert('Error checking model status', 'danger');
        });

    // Upload Image Event
    uploadBtn.addEventListener('click', function() {
        if (!fileInput.files[0]) {
            showAlert('Please select an image file', 'warning');
            return;
        }

        const file = fileInput.files[0];
        if (!file.type.match('image.*')) {
            showAlert('Please select a valid image file', 'warning');
            return;
        }

        // Create FormData
        const formData = new FormData();
        formData.append('image', file);

        // Show loading
        uploadResult.innerHTML = '<div class="text-center"><div class="loading"></div><p>Analyzing image...</p></div>';
        expressionResult.innerHTML = '';
        confidenceResult.innerHTML = '';

        // Send request to server
        // Add loading state functions
        function setLoading(isLoading) {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.disabled = isLoading;
            });
        }

        setLoading(true);

        // Update in the fetch calls
        fetch('/predict', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    showAlert(data.error, 'danger');
                    return;
                }

                // Display results
                displayResults(data);

                // Display uploaded image
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadResult.innerHTML = `<img src="${e.target.result}" class="img-fluid rounded" alt="Uploaded Image">`;
                };
                reader.readAsDataURL(file);
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Error processing image: ' + error.message, 'danger');
            })
            .finally(() => {
                setLoading(false);
            });
    });

    // Webcam Functions
    let webcamStream = null;

    // Start Webcam
    startWebcamBtn.addEventListener('click', function() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(stream) {
                    webcamStream = stream;
                    webcamElement.srcObject = stream;
                    webcamElement.play();

                    // Enable/disable buttons
                    startWebcamBtn.disabled = true;
                    stopWebcamBtn.disabled = false;
                    captureBtn.disabled = false;

                    // Start drawing webcam to canvas
                    drawToCanvas();
                })
                .catch(function(error) {
                    console.error('Error accessing webcam:', error);
                    showAlert('Could not access webcam. Please ensure you have granted permission.', 'danger');
                });
        } else {
            showAlert('Your browser does not support webcam access', 'danger');
        }
    });
    // Stop Webcam
    stopWebcamBtn.addEventListener('click', function() {
        if (webcamStream) {
            webcamStream.getTracks().forEach(track => track.stop());
            webcamElement.srcObject = null;
            webcamStream = null;

            // Clear canvas
            const context = canvasElement.getContext('2d');
            context.clearRect(0, 0, canvasElement.width, canvasElement.height);

            // Enable/disable buttons
            startWebcamBtn.disabled = false;
            stopWebcamBtn.disabled = true;
            captureBtn.disabled = true;
        }
    });

    // Draw webcam to canvas
    function drawToCanvas() {
        if (!webcamStream) return;

        const context = canvasElement.getContext('2d');

        // Draw video frame to canvas
        if (webcamElement.readyState === webcamElement.HAVE_ENOUGH_DATA) {
            context.drawImage(webcamElement, 0, 0, canvasElement.width, canvasElement.height);
        }

        // Continue drawing
        requestAnimationFrame(drawToCanvas);
    }

    // Capture and analyze webcam image
    captureBtn.addEventListener('click', function() {
        if (!webcamStream) {
            showAlert('Webcam is not active', 'warning');
            return;
        }

        // Show loading
        webcamResult.innerHTML = '<div class="text-center"><div class="loading"></div><p>Analyzing face...</p></div>';
        expressionResult.innerHTML = '';
        confidenceResult.innerHTML = '';

        // Get canvas data
        const canvas = document.createElement('canvas');
        canvas.width = webcamElement.videoWidth;
        canvas.height = webcamElement.videoHeight;
        canvas.getContext('2d').drawImage(webcamElement, 0, 0);

        // Convert to base64
        const imageData = canvas.toDataURL('image/jpeg');

        // Send to server
        fetch('/webcam_predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: imageData })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showAlert(data.error, 'warning');
                    webcamResult.innerHTML = '';
                    return;
                }

                // Display results
                displayResults(data);

                // Draw face box if coordinates are provided
                if (data.face_coordinates) {
                    const ctx = canvasElement.getContext('2d');
                    const { x, y, width, height } = data.face_coordinates;

                    // Scale coordinates to match canvas size
                    const scaleX = canvasElement.width / webcamElement.videoWidth;
                    const scaleY = canvasElement.height / webcamElement.videoHeight;

                    const scaledX = x * scaleX;
                    const scaledY = y * scaleY;
                    const scaledWidth = width * scaleX;
                    const scaledHeight = height * scaleY;

                    // Draw rectangle
                    ctx.strokeStyle = '#4a6fdc';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

                    // Add emotion label
                    ctx.fillStyle = 'rgba(74, 111, 220, 0.7)';
                    ctx.fillRect(scaledX, scaledY - 25, 100, 25);
                    ctx.fillStyle = 'white';
                    ctx.font = '16px Arial';
                    ctx.fillText(data.expression, scaledX + 5, scaledY - 7);
                }

                webcamResult.innerHTML = '';
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Error processing webcam image', 'danger');
                webcamResult.innerHTML = '';
            });
    });

    // Display prediction results
    function displayResults(data) {
        // Display emotion and confidence
        expressionResult.innerHTML = `<span class="emotion-badge emotion-${data.expression.toLowerCase()}">${data.expression}</span>`;
        confidenceResult.innerHTML = `Confidence: ${(data.confidence * 100).toFixed(2)}%`;

        // Create or update chart if all_scores are available
        if (data.all_scores) {
            createOrUpdateChart(data.all_scores);
        }
    }

    // Create or update emotion chart
    function createOrUpdateChart(scores) {
        // Destroy existing chart if it exists
        if (emotionChart) {
            emotionChart.destroy();
        }

        // Prepare data
        const labels = Object.keys(scores);
        const data = Object.values(scores).map(score => score * 100);

        // Define colors for each emotion
        const backgroundColors = {
            'Angry': '#e74c3c',
            'Disgust': '#8e44ad',
            'Fear': '#9b59b6',
            'Happy': '#f1c40f',
            'Neutral': '#95a5a6',
            'Sad': '#3498db',
            'Surprise': '#e67e22'
        };

        // Create chart
        const ctx = document.createElement('canvas');
        chartContainer.innerHTML = '';
        chartContainer.appendChild(ctx);

        emotionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Confidence (%)',
                    data: data,
                    backgroundColor: labels.map(label => backgroundColors[label]),
                    borderColor: labels.map(label => backgroundColors[label]),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.raw.toFixed(2)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Confidence (%)'
                        }
                    }
                }
            }
        });
    }

    // Helper function to show alerts
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        // Add to both result areas
        uploadResult.innerHTML = '';
        uploadResult.appendChild(alertDiv.cloneNode(true));

        webcamResult.innerHTML = '';
        webcamResult.appendChild(alertDiv);

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            const alerts = document.querySelectorAll('.alert');
            alerts.forEach(alert => {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            });
        }, 5000);
    }
});

// Theme Toggle Functionality
let isDarkMode = false;

function toggleTheme() {
    const body = document.body;
    isDarkMode = !isDarkMode;
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
}

// Add event listener for theme toggle
themeToggleBtn.addEventListener('click', toggleTheme);

// Initialize theme based on user preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDarkMode = true;
    document.body.classList.add('dark-mode');
}
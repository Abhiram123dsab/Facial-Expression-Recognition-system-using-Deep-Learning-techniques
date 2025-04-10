document.addEventListener('DOMContentLoaded', function() {
            // Check if model is loaded
            fetch('/check_model')
                .then(response => response.json())
                .then(data => {
                    if (data.status !== 'Model file exists') {
                        showAlert('Model file not found. Using placeholder data for visualization.', 'warning');
                    }
                    // Initialize visualizations regardless of model status
                    initializeModelVisualizations();
                })
                .catch(error => {
                    console.error('Error checking model:', error);
                    showAlert('Error checking model status. Using placeholder data for visualization.', 'warning');
                    // Initialize with placeholder data anyway
                    initializeModelVisualizations();
                });

            function initializeModelVisualizations() {
                // Set model summary information
                document.getElementById('total-params').textContent = '7,186,903';

                // Render architecture visualization
                renderArchitectureVisualization();

                // Populate layer details table
                populateLayerDetails();

                // Create charts
                createTrainingHistoryChart();
                createConfusionMatrixChart();
                createDatasetDistributionChart();
            }

            function renderArchitectureVisualization() {
                const container = document.getElementById('architecture-visualization');

                // Clear container
                container.innerHTML = '';

                // Define model layers based on the advanced model architecture
                const layers = [
                    { name: 'Input', type: 'InputLayer', shape: '48×48×1' },
                    // First Convolutional Block
                    { name: 'Conv2D', type: 'Conv2D', filters: 64, kernelSize: '3×3', activation: 'ReLU', block: 1 },
                    { name: 'BatchNorm', type: 'BatchNormalization', block: 1 },
                    { name: 'Conv2D', type: 'Conv2D', filters: 64, kernelSize: '3×3', activation: 'ReLU', block: 1 },
                    { name: 'BatchNorm', type: 'BatchNormalization', block: 1 },
                    { name: 'MaxPool', type: 'MaxPooling2D', size: '2×2', block: 1 },
                    { name: 'Dropout', type: 'Dropout', rate: '0.25', block: 1 },
                    // Second Convolutional Block
                    { name: 'Conv2D', type: 'Conv2D', filters: 128, kernelSize: '3×3', activation: 'ReLU', block: 2 },
                    { name: 'BatchNorm', type: 'BatchNormalization', block: 2 },
                    { name: 'Conv2D', type: 'Conv2D', filters: 128, kernelSize: '3×3', activation: 'ReLU', block: 2 },
                    { name: 'BatchNorm', type: 'BatchNormalization', block: 2 },
                    { name: 'MaxPool', type: 'MaxPooling2D', size: '2×2', block: 2 },
                    { name: 'Dropout', type: 'Dropout', rate: '0.25', block: 2 },
                    // Third Convolutional Block
                    { name: 'Conv2D', type: 'Conv2D', filters: 256, kernelSize: '3×3', activation: 'ReLU', block: 3 },
                    { name: 'BatchNorm', type: 'BatchNormalization', block: 3 },
                    { name: 'Conv2D', type: 'Conv2D', filters: 256, kernelSize: '3×3', activation: 'ReLU', block: 3 },
                    { name: 'BatchNorm', type: 'BatchNormalization', block: 3 },
                    { name: 'MaxPool', type: 'MaxPooling2D', size: '2×2', block: 3 },
                    { name: 'Dropout', type: 'Dropout', rate: '0.25', block: 3 },
                    // Fourth Convolutional Block
                    { name: 'Conv2D', type: 'Conv2D', filters: 512, kernelSize: '3×3', activation: 'ReLU', block: 4 },
                    { name: 'BatchNorm', type: 'BatchNormalization', block: 4 },
                    { name: 'Conv2D', type: 'Conv2D', filters: 512, kernelSize: '3×3', activation: 'ReLU', block: 4 },
                    { name: 'BatchNorm', type: 'BatchNormalization', block: 4 },
                    { name: 'MaxPool', type: 'MaxPooling2D', size: '2×2', block: 4 },
                    { name: 'Dropout', type: 'Dropout', rate: '0.25', block: 4 },
                    // Flatten and Dense Layers
                    { name: 'Flatten', type: 'Flatten' },
                    { name: 'Dense', type: 'Dense', units: 512, activation: 'ReLU' },
                    { name: 'BatchNorm', type: 'BatchNormalization' },
                    { name: 'Dropout', type: 'Dropout', rate: '0.5' },
                    { name: 'Dense', type: 'Dense', units: 256, activation: 'ReLU' },
                    { name: 'BatchNorm', type: 'BatchNormalization' },
                    { name: 'Dropout', type: 'Dropout', rate: '0.5' },
                    { name: 'Dense', type: 'Dense', units: 7, activation: 'Softmax' }
                ];

                // Create a flex container for the architecture
                const architectureContainer = document.createElement('div');
                architectureContainer.style.display = 'flex';
                architectureContainer.style.alignItems = 'center';
                architectureContainer.style.overflowX = 'auto';
                architectureContainer.style.padding = '20px 0';
                architectureContainer.id = 'architecture-container';

                // Add each layer to the visualization
                layers.forEach((layer, index) => {
                            // Create layer box
                            const layerBox = document.createElement('div');
                            layerBox.className = 'layer-box';
                            layerBox.setAttribute('data-layer-index', index);
                            layerBox.setAttribute('data-layer-type', layer.type);

                            // Set different colors based on layer type
                            let typeIcon = '';
                            if (layer.type.includes('Conv')) {
                                layerBox.style.borderColor = '#3498db';
                                layerBox.style.backgroundColor = '#ebf5fb';
                                typeIcon = 'C';
                            } else if (layer.type.includes('Pool')) {
                                layerBox.style.borderColor = '#2ecc71';
                                layerBox.style.backgroundColor = '#eafaf1';
                                typeIcon = 'P';
                            } else if (layer.type.includes('Dense')) {
                                layerBox.style.borderColor = '#e74c3c';
                                layerBox.style.backgroundColor = '#fdedec';
                                typeIcon = 'D';
                            } else if (layer.type.includes('Dropout')) {
                                layerBox.style.borderColor = '#f39c12';
                                layerBox.style.backgroundColor = '#fef5e7';
                                typeIcon = 'DO';
                            } else if (layer.type.includes('Batch')) {
                                layerBox.style.borderColor = '#9b59b6';
                                layerBox.style.backgroundColor = '#f4ecf7';
                                typeIcon = 'BN';
                            } else if (layer.type.includes('Flatten')) {
                                layerBox.style.borderColor = '#34495e';
                                layerBox.style.backgroundColor = '#ebedef';
                                typeIcon = 'F';
                            } else if (layer.type.includes('Input')) {
                                layerBox.style.borderColor = '#16a085';
                                layerBox.style.backgroundColor = '#e8f8f5';
                                typeIcon = 'I';
                            }

                            // Add block indicator if part of a convolutional block
                            let blockIndicator = '';
                            if (layer.block) {
                                blockIndicator = `<div class="block-indicator">Block ${layer.block}</div>`;
                            }

                            // Add layer name and details
                            layerBox.innerHTML = `
                        <div class="layer-type-badge">${typeIcon}</div>
                        ${blockIndicator}
                        <h6>${layer.name}</h6>
                        <p>${layer.type}</p>
                        ${layer.filters ? `<p>${layer.filters} filters</p>` : ''}
                        ${layer.kernelSize ? `<p>${layer.kernelSize}</p>` : ''}
                        ${layer.units ? `<p>${layer.units} units</p>` : ''}
                        ${layer.shape ? `<p>${layer.shape}</p>` : ''}
                        ${layer.rate ? `<p>Rate: ${layer.rate}</p>` : ''}
                        ${layer.size ? `<p>Size: ${layer.size}</p>` : ''}
                        ${layer.activation ? `<p>Activation: ${layer.activation}</p>` : ''}
                    `;
                    
                    // Add tooltip functionality
                    layerBox.setAttribute('data-bs-toggle', 'tooltip');
                    layerBox.setAttribute('data-bs-placement', 'top');
                    layerBox.setAttribute('title', `Layer ${index + 1}: ${layer.type}`);
                    
                    // Add connection line between layers (except for the first layer)
                    if (index > 0) {
                        const connection = document.createElement('div');
                        connection.className = 'layer-connection';
                        architectureContainer.appendChild(connection);
                    }
                    
                    // Add layer box to container
                    architectureContainer.appendChild(layerBox);
                    
                    // Add click event to highlight the corresponding row in the layer details table
                    layerBox.addEventListener('click', function() {
                        // Remove highlight from all rows
                        document.querySelectorAll('#layer-details tr').forEach(row => {
                            row.classList.remove('table-primary');
                        });
                        
                        // Highlight the corresponding row
                        const tableRows = document.querySelectorAll('#layer-details tr');
                        if (tableRows[index]) {
                            tableRows[index].classList.add('table-primary');
                            tableRows[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    });
                });
                
                // Add the architecture container to the main container
                container.appendChild(architectureContainer);
                
                // Initialize tooltips
                var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl);
                });
                
                // Initialize zoom functionality
                initializeZoomControls();
            }

    // Initialize zoom controls for the architecture visualization
    function initializeZoomControls() {
        const container = document.getElementById('architecture-container');
        const zoomInBtn = document.getElementById('zoom-in-btn');
        const zoomOutBtn = document.getElementById('zoom-out-btn');
        const resetZoomBtn = document.getElementById('reset-zoom-btn');
        
        let currentScale = 1;
        const minScale = 0.5;
        const maxScale = 2;
        const scaleStep = 0.1;
        
        // Apply zoom transformation
        function applyZoom() {
            container.style.transform = `scale(${currentScale})`;
            container.style.transformOrigin = 'left center';
        }
        
        // Zoom in button
        zoomInBtn.addEventListener('click', function() {
            if (currentScale < maxScale) {
                currentScale += scaleStep;
                applyZoom();
            }
        });
        
        // Zoom out button
        zoomOutBtn.addEventListener('click', function() {
            if (currentScale > minScale) {
                currentScale -= scaleStep;
                applyZoom();
            }
        });
        
        // Reset zoom button
        resetZoomBtn.addEventListener('click', function() {
            currentScale = 1;
            applyZoom();
        });
    }

    function populateLayerDetails() {
        const tableBody = document.getElementById('layer-details');
        
        // Clear table body
        tableBody.innerHTML = '';
        
        // Layer details (matching the advanced architecture visualization)
        const layerDetails = [
            { name: 'input_1', type: 'InputLayer', outputShape: '(None, 48, 48, 1)', params: '0' },
            // First Convolutional Block
            { name: 'conv2d_1', type: 'Conv2D', outputShape: '(None, 48, 48, 64)', params: '640' },
            { name: 'batch_normalization_1', type: 'BatchNormalization', outputShape: '(None, 48, 48, 64)', params: '256' },
            { name: 'conv2d_2', type: 'Conv2D', outputShape: '(None, 48, 48, 64)', params: '36,928' },
            { name: 'batch_normalization_2', type: 'BatchNormalization', outputShape: '(None, 48, 48, 64)', params: '256' },
            { name: 'max_pooling2d_1', type: 'MaxPooling2D', outputShape: '(None, 24, 24, 64)', params: '0' },
            { name: 'dropout_1', type: 'Dropout', outputShape: '(None, 24, 24, 64)', params: '0' },
            // Second Convolutional Block
            { name: 'conv2d_3', type: 'Conv2D', outputShape: '(None, 24, 24, 128)', params: '73,856' },
            { name: 'batch_normalization_3', type: 'BatchNormalization', outputShape: '(None, 24, 24, 128)', params: '512' },
            { name: 'conv2d_4', type: 'Conv2D', outputShape: '(None, 24, 24, 128)', params: '147,584' },
            { name: 'batch_normalization_4', type: 'BatchNormalization', outputShape: '(None, 24, 24, 128)', params: '512' },
            { name: 'max_pooling2d_2', type: 'MaxPooling2D', outputShape: '(None, 12, 12, 128)', params: '0' },
            { name: 'dropout_2', type: 'Dropout', outputShape: '(None, 12, 12, 128)', params: '0' },
            // Third Convolutional Block
            { name: 'conv2d_5', type: 'Conv2D', outputShape: '(None, 12, 12, 256)', params: '295,168' },
            { name: 'batch_normalization_5', type: 'BatchNormalization', outputShape: '(None, 12, 12, 256)', params: '1,024' },
            { name: 'conv2d_6', type: 'Conv2D', outputShape: '(None, 12, 12, 256)', params: '590,080' },
            { name: 'batch_normalization_6', type: 'BatchNormalization', outputShape: '(None, 12, 12, 256)', params: '1,024' },
            { name: 'max_pooling2d_3', type: 'MaxPooling2D', outputShape: '(None, 6, 6, 256)', params: '0' },
            { name: 'dropout_3', type: 'Dropout', outputShape: '(None, 6, 6, 256)', params: '0' },
            // Fourth Convolutional Block
            { name: 'conv2d_7', type: 'Conv2D', outputShape: '(None, 6, 6, 512)', params: '1,180,160' },
            { name: 'batch_normalization_7', type: 'BatchNormalization', outputShape: '(None, 6, 6, 512)', params: '2,048' },
            { name: 'conv2d_8', type: 'Conv2D', outputShape: '(None, 6, 6, 512)', params: '2,359,808' },
            { name: 'batch_normalization_8', type: 'BatchNormalization', outputShape: '(None, 6, 6, 512)', params: '2,048' },
            { name: 'max_pooling2d_4', type: 'MaxPooling2D', outputShape: '(None, 3, 3, 512)', params: '0' },
            { name: 'dropout_4', type: 'Dropout', outputShape: '(None, 3, 3, 512)', params: '0' },
            // Flatten and Dense Layers
            { name: 'flatten', type: 'Flatten', outputShape: '(None, 4608)', params: '0' },
            { name: 'dense_1', type: 'Dense', outputShape: '(None, 512)', params: '2,359,808' },
            { name: 'batch_normalization_9', type: 'BatchNormalization', outputShape: '(None, 512)', params: '2,048' },
            { name: 'dropout_5', type: 'Dropout', outputShape: '(None, 512)', params: '0' },
            { name: 'dense_2', type: 'Dense', outputShape: '(None, 256)', params: '131,328' },
            { name: 'batch_normalization_10', type: 'BatchNormalization', outputShape: '(None, 256)', params: '1,024' },
            { name: 'dropout_6', type: 'Dropout', outputShape: '(None, 256)', params: '0' },
            { name: 'dense_3', type: 'Dense', outputShape: '(None, 7)', params: '1,799' }
        ];
        
        // Add rows to table
        layerDetails.forEach(layer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${layer.name}</td>
                <td>${layer.type}</td>
                <td>${layer.outputShape}</td>
                <td>${layer.params}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function createTrainingHistoryChart() {
        const ctx = document.getElementById('training-history-chart').getContext('2d');
        
        // Sample training history data
        const epochs = Array.from({length: 50}, (_, i) => i + 1);
        const accuracyData = generateSampleAccuracyData(50);
        const lossData = generateSampleLossData(50);
        const valAccuracyData = generateSampleValAccuracyData(50, accuracyData);
        const valLossData = generateSampleValLossData(50, lossData);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: epochs,
                datasets: [
                    {
                        label: 'Training Accuracy',
                        data: accuracyData,
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        tension: 0.3,
                        fill: false
                    },
                    {
                        label: 'Validation Accuracy',
                        data: valAccuracyData,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.3,
                        fill: false
                    },
                    {
                        label: 'Training Loss',
                        data: lossData,
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.3,
                        fill: false,
                        hidden: true
                    },
                    {
                        label: 'Validation Loss',
                        data: valLossData,
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.1)',
                        tension: 0.3,
                        fill: false,
                        hidden: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Training and Validation Metrics'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Epoch'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Value'
                        },
                        min: 0,
                        max: 1
                    }
                }
            }
        });
    }

    function createConfusionMatrixChart() {
        const ctx = document.getElementById('confusion-matrix-chart').getContext('2d');
        
        // Sample confusion matrix data - more realistic values
        const labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'];
        const data = [
            [0.82, 0.02, 0.05, 0.01, 0.06, 0.01, 0.03],
            [0.05, 0.76, 0.07, 0.01, 0.05, 0.03, 0.03],
            [0.08, 0.03, 0.70, 0.02, 0.09, 0.04, 0.04],
            [0.01, 0.01, 0.02, 0.90, 0.01, 0.02, 0.03],
            [0.06, 0.02, 0.08, 0.02, 0.75, 0.01, 0.06],
            [0.02, 0.02, 0.05, 0.03, 0.01, 0.84, 0.03],
            [0.04, 0.01, 0.04, 0.05, 0.07, 0.02, 0.77]
        ];
        
        // Define emotion-specific colors for better visualization
        const emotionColors = {
            'Angry': '#e74c3c',
            'Disgust': '#8e44ad',
            'Fear': '#9b59b6',
            'Happy': '#f1c40f',
            'Sad': '#3498db',
            'Surprise': '#e67e22',
            'Neutral': '#95a5a6'
        };
        
        // Add a title and description above the chart
        const chartContainer = ctx.canvas.parentNode;
        const titleElement = document.createElement('div');
        titleElement.className = 'confusion-matrix-title';
        titleElement.innerHTML = `
            <p class="text-center mb-3">This confusion matrix shows the model's prediction accuracy across different emotions.</p>
            <p class="text-center mb-3"><small>Diagonal cells represent correct predictions, while off-diagonal cells show misclassifications.</small></p>
        `;
        chartContainer.insertBefore(titleElement, ctx.canvas);
        
        // Prepare data for heatmap
        const heatmapData = [];
        for (let i = 0; i < labels.length; i++) {
            for (let j = 0; j < labels.length; j++) {
                heatmapData.push({
                    x: labels[j],
                    y: labels[i],
                    v: data[i][j]
                });
            }
        }
        
        // Create the confusion matrix chart using a standard heatmap approach
        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Confusion Matrix',
                    data: heatmapData.map(item => ({
                        x: item.x,
                        y: item.y,
                        value: item.v
                    })),
                    backgroundColor: function(context) {
                        if (!context.raw) return 'rgba(0,0,0,0.1)';
                        
                        const value = context.raw.value;
                        const x = context.raw.x; // Predicted label
                        const y = context.raw.y; // True label
                        
                        // Use different color scheme for diagonal (correct predictions) vs off-diagonal
                        if (x === y) {
                            // Correct predictions - use emotion-specific color with opacity based on value
                            const baseColor = emotionColors[x] || '#3498db';
                            return baseColor + Math.round(value * 80 + 20).toString(16).padStart(2, '0');
                        } else {
                            // Incorrect predictions - use gray scale
                            return `rgba(150, 150, 150, ${value})`;
                        }
                    },
                    pointRadius: function(context) {
                        // Make points large enough to create a heatmap effect
                        const chart = context.chart;
                        const area = chart.chartArea || {};
                        const size = Math.min(area.width, area.height) / (labels.length * 2.5);
                        return size;
                    },
                    pointHoverRadius: function(context) {
                        const chart = context.chart;
                        const area = chart.chartArea || {};
                        const size = Math.min(area.width, area.height) / (labels.length * 2);
                        return size;
                    },
                    hoverBackgroundColor: function(context) {
                        if (!context.raw) return 'rgba(0,0,0,0.2)';
                        const value = context.raw.value;
                        const x = context.raw.x;
                        const y = context.raw.y;
                        
                        if (x === y) {
                            const baseColor = emotionColors[x] || '#3498db';
                            return baseColor;
                        } else {
                            return `rgba(100, 100, 100, ${value + 0.2})`;
                        }
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: function() {
                                return 'Confusion Matrix';
                            },
                            label: function(context) {
                                if (!context.raw) return '';
                                const x = context.raw.x;
                                const y = context.raw.y;
                                const value = context.raw.value;
                                return [
                                    `True: ${y}`,
                                    `Predicted: ${x}`,
                                    `Accuracy: ${(value * 100).toFixed(1)}%`
                                ];
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        type: 'category',
                        position: 'bottom',
                        labels: labels,
                        title: {
                            display: true,
                            text: 'Predicted',
                            font: {
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            display: true,
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        type: 'category',
                        position: 'left',
                        labels: labels,
                        title: {
                            display: true,
                            text: 'True',
                            font: {
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            display: true,
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            display: false
                        },
                        offset: true,
                        reverse: true // Reverse the y-axis to match traditional confusion matrix layout
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
        
        // Add a legend for the confusion matrix
        const legendElement = document.createElement('div');
        legendElement.className = 'confusion-matrix-legend mt-3';
        legendElement.innerHTML = `
            <div class="d-flex justify-content-center align-items-center flex-wrap">
                <div class="legend-item mx-2 mb-2">
                    <span class="legend-color" style="background-color: rgba(74, 111, 220, 0.9);"></span>
                    <span class="legend-text">High Accuracy</span>
                </div>
                <div class="legend-item mx-2 mb-2">
                    <span class="legend-color" style="background-color: rgba(74, 111, 220, 0.5);"></span>
                    <span class="legend-text">Medium Accuracy</span>
                </div>
                <div class="legend-item mx-2 mb-2">
                    <span class="legend-color" style="background-color: rgba(74, 111, 220, 0.2);"></span>
                    <span class="legend-text">Low Accuracy</span>
                </div>
            </div>
        `;
        chartContainer.appendChild(legendElement);
    }

    function createDatasetDistributionChart() {
        const ctx = document.getElementById('dataset-distribution-chart').getContext('2d');
        
        // Sample dataset distribution
        const labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'];
        const data = [4953, 547, 5121, 8989, 6077, 4002, 6198];
        
        // Define colors for each emotion (matching the main app)
        const backgroundColors = [
            '#e74c3c', // Angry
            '#8e44ad', // Disgust
            '#9b59b6', // Fear
            '#f1c40f', // Happy
            '#3498db', // Sad
            '#e67e22', // Surprise
            '#95a5a6'  // Neutral
        ];
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: '#ffffff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 15,
                            font: {
                                size: 10
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Dataset Distribution'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Helper function to generate sample accuracy data
    function generateSampleAccuracyData(epochs) {
        const data = [];
        let value = 0.5;
        
        for (let i = 0; i < epochs; i++) {
            // Simulate learning curve that plateaus
            const increment = 0.5 * Math.exp(-i / 10) / 10;
            value += increment + (Math.random() * 0.02 - 0.01);
            value = Math.min(Math.max(value, 0), 0.95); // Cap between 0 and 0.95
            data.push(value);
        }
        
        return data;
    }

    // Helper function to generate sample loss data
    function generateSampleLossData(epochs) {
        const data = [];
        let value = 1.5;
        
        for (let i = 0; i < epochs; i++) {
            // Simulate decreasing loss that plateaus
            const decrement = 0.5 * Math.exp(-i / 15) / 10;
            value -= decrement + (Math.random() * 0.02 - 0.01);
            value = Math.max(value, 0.2); // Minimum loss of 0.2
            data.push(value);
        }
        
        return data;
    }

    // Helper function to generate validation accuracy data (slightly worse than training)
    function generateSampleValAccuracyData(epochs, trainingData) {
        return trainingData.map(value => {
            // Validation accuracy is slightly lower with more variance
            const valValue = value - (Math.random() * 0.1 + 0.05);
            return Math.max(valValue, 0.4); // Minimum of 0.4
        });
    }

    // Helper function to generate validation loss data (slightly higher than training)
    function generateSampleValLossData(epochs, trainingData) {
        return trainingData.map(value => {
            // Validation loss is slightly higher with more variance
            const valValue = value + (Math.random() * 0.2 + 0.1);
            return valValue;
        });
    }

    // Helper function to generate confusion matrix data in the format Chart.js expects
    function generateConfusionMatrixData(labels, data) {
        const result = [];
        
        for (let i = 0; i < labels.length; i++) {
            for (let j = 0; j < labels.length; j++) {
                result.push({
                    x: labels[j],
                    y: labels[i],
                    v: data[i][j]
                });
            }
        }
        
        return result;
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

        // Add to the top of the container
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alertDiv);
            bsAlert.close();
        }, 5000);
    }
});

// Helper function to get color brightness (for determining text color)
function getBrightness(color) {
    // Handle hex format
    if (color.startsWith('#')) {
        const hex = color.replace(/^#/, '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return (r * 299 + g * 587 + b * 114) / 1000;
    }
    
    // Handle rgba format
    if (color.startsWith('rgba')) {
        const parts = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (parts) {
            const r = parseInt(parts[1], 10);
            const g = parseInt(parts[2], 10);
            const b = parseInt(parts[3], 10);
            return (r * 299 + g * 587 + b * 114) / 1000;
        }
    }
    
    return 0; // Default to dark text
}
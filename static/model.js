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
                const ctx = document.getElementById('confusionMatrixChart').getContext('2d');
                const mockData = {
                    labels: ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'],
                    datasets: [{
                        label: 'Confusion Matrix',
                        data: [10, 5, 3, 20, 15, 7, 8],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                };

                new Chart(ctx, {
                    type: 'bar',
                    data: mockData,
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            function createDatasetDistributionChart() {
                const ctx = document.getElementById('datasetDistributionChart').getContext('2d');
                const mockData = {
                    labels: ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'],
                    datasets: [{
                        label: 'Dataset Distribution',
                        data: [100, 50, 30, 200, 150, 70, 80],
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    }]
                };

                new Chart(ctx, {
                    type: 'pie',
                    data: mockData,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Dataset Distribution'
                            }
                        }
                    }
                });
            }

            // Initialize charts with mock data
            createConfusionMatrixChart();
            createDatasetDistributionChart();
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

// Register the matrix controller for the confusion matrix chart
Chart.register({
    id: 'matrix',
    beforeInit: function(chart) {
        const originalFit = chart.legend.fit;
        chart.legend.fit = function fit() {
            originalFit.bind(chart.legend)();
            this.height += 10;
        };
    },
    defaults: {
        animations: {
            numbers: {
                type: 'number',
                properties: ['x', 'y', 'width', 'height']
            }
        },
        transitions: {
            show: {
                animations: {
                    numbers: {
                        from: 0
                    }
                }
            },
            hide: {
                animations: {
                    numbers: {
                        to: 0
                    }
                }
            }
        }
    },
    controller: {
        updateElement: function(element, index, properties) {
            const me = this;
            const meta = me.getMeta();
            const dataset = me.getDataset();
            
            Object.assign(element, {
                x: properties.x,
                y: properties.y,
                width: properties.width,
                height: properties.height,
                options: me.resolveDataElementOptions(index, properties.mode),
                horizontal: properties.horizontal,
                base: properties.base,
                horizontal: properties.horizontal,
                datasetIndex: me.index,
                index: index,
                data: dataset.data[index]
            });
        },
        draw: function(context) {
            const me = this;
            const meta = me.getMeta();
            const elements = meta.data || [];
            const ctx = context.chart.ctx;
            
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                const data = element.data;
                
                ctx.save();
                
                // Draw cell background
                ctx.fillStyle = element.options.backgroundColor;
                ctx.fillRect(element.x, element.y, element.width, element.height);
                
                // Draw cell border
                ctx.strokeStyle = element.options.borderColor;
                ctx.lineWidth = element.options.borderWidth;
                ctx.strokeRect(element.x, element.y, element.width, element.height);
                
                // Add text for the value with improved styling
                const value = (data.v * 100).toFixed(0);
                const fontSize = Math.min(element.width, element.height) / 2.5;
                
                // Determine text color based on background brightness
                const rgb = hexToRgb(element.options.backgroundColor);
                const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
                ctx.fillStyle = brightness > 125 ? '#000000' : '#ffffff';
                
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(
                    value + '%', 
                    element.x + element.width / 2, 
                    element.y + element.height / 2
                );
                
                ctx.restore();
            }
        }
    }
});

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
    // Default to black if hex is not valid
    if (!hex || typeof hex !== 'string') {
        return { r: 0, g: 0, b: 0 };
    }
    
    // Handle rgba format
    if (hex.startsWith('rgba')) {
        const parts = hex.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (parts) {
            return {
                r: parseInt(parts[1], 10),
                g: parseInt(parts[2], 10),
                b: parseInt(parts[3], 10)
            };
        }
        return { r: 0, g: 0, b: 0 };
    }
    
    // Handle hex format
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    const bigint = parseInt(hex, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

// Theme Toggle Functionality
const themeToggleBtn = document.getElementById('theme-toggle-btn');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
applyTheme(savedTheme);

// Toggle theme on button click
themeToggleBtn.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
});
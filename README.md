# Facial Expression Recognition System

## Overview
This project implements a Facial Expression Recognition system using Deep Learning techniques. The system can detect 7 different emotions: Angry, Disgust, Fear, Happy, Neutral, Sad, and Surprise using a trained Convolutional Neural Network (CNN) model.

## Project Structure
```
📂 Facial Expression Recognition/
   ├── app.py                  # Flask backend (Handles image uploads and predictions)
   ├── fer2013.csv             # Dataset for training the model
   ├── model.h5                # Saved trained model
   ├── requirements.txt        # Python dependencies
   ├── test_model.py          # Script for testing model performance
   ├── train_advanced.py      # Script for training the CNN model
   ├── /templates/            # Contains frontend files
   │   └── index.html         # Main UI for uploading images and displaying predictions
   └── /static/               # Static assets
       ├── styles.css         # CSS styling for the frontend
       └── script.js          # JavaScript for handling user interactions
```

## Installation

1. Clone the repository or download the project files

2. Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Running the Application
1. Start the Flask server:
```bash
python app.py
```
2. Open your web browser and navigate to `http://localhost:5000`

### Training the Model
To train the model on the FER2013 dataset:
```bash
python train_advanced.py
```

### Testing the Model
To evaluate the model's performance:
```bash
python test_model.py
```

## Features
- **Image Upload**: Upload images to detect facial expressions
- **Webcam Support**: Use your webcam for real-time facial expression recognition
- **Visualization**: View confidence scores for each emotion category
- **Responsive Design**: Works on both desktop and mobile devices

## Technical Details

### Model Architecture
The CNN model consists of multiple convolutional layers followed by max pooling, batch normalization, and dropout layers. The final layers are fully connected dense layers that output probabilities for each of the 7 emotion classes.

### Dataset
The model is trained on the FER2013 dataset, which contains 48x48 pixel grayscale images of faces labeled with 7 different emotions.

### Backend
The Flask backend provides API endpoints for:
- Serving the frontend
- Processing uploaded images
- Processing webcam captures
- Making predictions using the trained model

### Frontend
The frontend is built with HTML, CSS, and JavaScript, featuring:
- Bootstrap for responsive design
- Chart.js for visualizing emotion probabilities
- Webcam integration using the MediaDevices API

## Troubleshooting
- Ensure all required dependencies are installed correctly
- Check that the model file (`model.h5`) is present in the project directory
- If webcam access is denied, ensure you've granted the necessary permissions in your browser
- For any import errors, verify that all required Python packages are installed

## Future Improvements
- Add support for multiple face detection
- Implement emotion tracking over time
- Add video recording capabilities
- Improve model accuracy with more advanced architectures
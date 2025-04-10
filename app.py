from flask import Flask, request, jsonify, render_template
import numpy as np
import cv2
import base64
import os
import random

app = Flask(__name__)

# Load the trained model
from tensorflow.keras.models import load_model

# Check if model file exists
if os.path.exists('model.h5'):
    model = load_model('model.h5')
    print("Loaded trained model from model.h5!")
else:
    # Fallback to mock model if real model doesn't exist
    class MockModel:
        def predict(self, image):
            # Generate random predictions for testing
            predictions = np.random.rand(1, 7)
            # Normalize to sum to 1
            predictions = predictions / np.sum(predictions)
            return predictions
    
    model = MockModel()
    print("WARNING: Using mock model for testing! Real model file not found.")

# Emotion labels
EMOTIONS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

def preprocess_image(image):
    # Convert to grayscale
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image
    
    # Resize to 48x48
    resized = cv2.resize(gray, (48, 48))
    
    # Normalize
    normalized = resized / 255.0
    
    # Reshape for model input
    preprocessed = normalized.reshape(1, 48, 48, 1)
    return preprocessed

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/model')
def model_architecture():
    return render_template('model.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get image from request
        file = request.files['image']
        image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        
        # Detect faces
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        
        if len(faces) == 0:
            return jsonify({'error': 'No face detected in the image'})
        
        # Use the first detected face
        x, y, w, h = faces[0]
        face_roi = gray[y:y+h, x:x+w]
        
        # Preprocess image
        preprocessed = preprocess_image(face_roi)
        
        # Make prediction
        predictions = model.predict(preprocessed)[0]
        
        # Get the emotion with highest confidence
        emotion_idx = np.argmax(predictions)
        emotion = EMOTIONS[emotion_idx]
        confidence = float(predictions[emotion_idx])
        
        # Create dictionary of all scores
        all_scores = {emotion: float(score) for emotion, score in zip(EMOTIONS, predictions)}
        
        return jsonify({
            'expression': emotion,
            'confidence': confidence,
            'all_scores': all_scores
        })
        
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/webcam_predict', methods=['POST'])
def webcam_predict():
    try:
        # Get image data from request
        data = request.json
        image_data = data['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        
        # Convert to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Detect faces
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        
        if len(faces) == 0:
            return jsonify({'error': 'No face detected'})
        
        # Use the first detected face
        x, y, w, h = faces[0]
        face_roi = gray[y:y+h, x:x+w]
        
        # Preprocess image
        preprocessed = preprocess_image(face_roi)
        
        # Make prediction
        predictions = model.predict(preprocessed)[0]
        
        # Get the emotion with highest confidence
        emotion_idx = np.argmax(predictions)
        emotion = EMOTIONS[emotion_idx]
        confidence = float(predictions[emotion_idx])
        
        # Create dictionary of all scores
        all_scores = {emotion: float(score) for emotion, score in zip(EMOTIONS, predictions)}
        
        return jsonify({
            'expression': emotion,
            'confidence': confidence,
            'all_scores': all_scores
        })
        
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/check_model', methods=['GET'])
def check_model():
    # Check if the model file actually exists
    if os.path.exists('model.h5'):
        return jsonify({'status': 'Model file exists'})
    else:
        return jsonify({'status': 'Model file not found', 'using': 'mock model'})

if __name__ == '__main__':
    app.run(debug=True)
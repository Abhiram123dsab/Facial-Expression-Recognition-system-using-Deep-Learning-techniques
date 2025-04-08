import numpy as np
import tensorflow as tf
import cv2
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt

# Load the trained model
model = load_model('model.h5')

# Emotion labels
EMOTIONS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

def predict_emotion(image):
    # Resize to 48x48
    resized = cv2.resize(image, (48, 48))
    
    # Convert to grayscale if needed
    if len(resized.shape) == 3:
        gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    else:
        gray = resized
    
    # Normalize
    normalized = gray / 255.0
    
    # Reshape for model input
    input_data = normalized.reshape(1, 48, 48, 1)
    
    # Predict
    predictions = model.predict(input_data)[0]
    
    # Get the emotion with highest confidence
    emotion_idx = np.argmax(predictions)
    emotion = EMOTIONS[emotion_idx]
    confidence = predictions[emotion_idx]
    
    return emotion, confidence, predictions

def test_with_image(image_path):
    # Read image
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Could not read image at {image_path}")
        return
    
    # Detect face
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    
    if len(faces) == 0:
        print("No face detected in the image")
        return
    
    # For each detected face
    for (x, y, w, h) in faces:
        # Extract face ROI
        face_roi = gray[y:y+h, x:x+w]
        
        # Predict emotion
        emotion, confidence, all_scores = predict_emotion(face_roi)
        
        # Draw rectangle around face
        cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)
        
        # Put text
        text = f"{emotion}: {confidence*100:.2f}%"
        cv2.putText(image, text, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
        
        # Print detailed results
        print("\nEmotion Predictions:")
        for emotion, score in zip(EMOTIONS, all_scores):
            print(f"{emotion}: {score*100:.2f}%")
    
    # Display result
    plt.figure(figsize=(10, 6))
    plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    plt.axis('off')
    plt.show()

if __name__ == "__main__":
    # Test with an image
    image_path = input("Enter the path to test image: ")
    test_with_image(image_path)
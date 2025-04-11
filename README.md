# Facial Expression Recognition System using Deep Learning Techniques

## Project Overview
This project is a Facial Expression Recognition System that utilizes advanced deep learning techniques to identify and classify human facial expressions. The system is designed to process images and video streams, providing real-time feedback on detected emotions.

## Features
- **Theme System**: Supports light/dark modes with localStorage persistence and WCAG-compliant contrast ratios
- **Real-time Emotion Detection**: Analyze facial expressions from images and webcam streams.
- **Advanced Model Architecture**: Utilizes a deep convolutional neural network with multiple layers for accurate emotion recognition.
- **Interactive Visualization**: Visualize model architecture, training history, and dataset distribution.
- **User-Friendly Interface**: Easy-to-use web interface for uploading images and accessing webcam.

## Installation Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/facial-expression-recognition.git
   ```
2. **Navigate to the Project Directory**:
   ```bash
   cd facial-expression-recognition
   ```
3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Run the Application**:
   ```bash
   python app.py
   ```

## Usage Guide
- **Upload Image**: Use the upload button to select an image file for analysis.
- **Webcam Access**: Start the webcam to capture and analyze live video feed.
- **View Results**: Check the detected emotion and confidence level displayed on the interface.

## Future Improvements
- **Enhanced Emotion Categories**: Expand the range of detectable emotions.
- **Mobile Compatibility**: Optimize the interface for mobile devices.
- **Performance Optimization**: Improve model efficiency and reduce processing time.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments
- Special thanks to the contributors and the open-source community for their valuable resources and support.

## Model Details
- **Architecture**: The model is a deep convolutional neural network (CNN) with multiple layers including convolutional, pooling, and fully connected layers.
- **Techniques**: Utilizes dropout for regularization and batch normalization for faster convergence.

## Theme System Details
- **Toggle Control**: Persistent theme selection via localStorage
- **CSS Variables**: Centralized theming using CSS custom properties
- **Accessibility**: AA contrast ratios maintained in both modes

## Technologies Used
- **Backend**: Flask for serving the web application.
- **Model Training**: TensorFlow and Keras for building and training the CNN model.
- **Data Processing**: NumPy and Pandas for data manipulation.
- **Visualization**: Matplotlib and Seaborn for plotting training metrics and data distribution.

## Training Process
- **Dataset**: The model was trained using the FER-2013 dataset, which contains labeled facial expressions.
- **Preprocessing**: Images were resized and normalized to improve model performance.
- **Training**: The model was trained using a combination of data augmentation and early stopping to prevent overfitting.
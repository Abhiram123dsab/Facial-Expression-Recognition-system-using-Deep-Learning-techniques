import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPooling2D, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import seaborn as sns
import os

def load_fer2013():
    print("Loading FER2013 dataset...")
    try:
        data = pd.read_csv('fer2013.csv')
        pixels = data['pixels'].tolist()
        width, height = 48, 48
        faces = []
        
        print("Processing images...")
        for i, pixel_sequence in enumerate(pixels):
            face = [int(pixel) for pixel in pixel_sequence.split(' ')]
            face = np.asarray(face).reshape(width, height)
            faces.append(face.astype('float32'))
            
            if i % 1000 == 0:
                print(f"Processed {i} images")

        faces = np.asarray(faces)
        faces = np.expand_dims(faces, -1)
        
        # Normalize pixel values
        faces = faces / 255.0
        
        # Convert emotions to one-hot encoding
        emotions = pd.get_dummies(data['emotion']).values
        
        print(f"Dataset loaded: {len(faces)} images")
        return faces, emotions
    
    except Exception as e:
        print(f"Error loading dataset: {str(e)}")
        return None, None

def create_advanced_model():
    model = Sequential([
        # First Convolutional Block
        Conv2D(64, (3, 3), padding='same', activation='relu', input_shape=(48, 48, 1)),
        BatchNormalization(),
        Conv2D(64, (3, 3), padding='same', activation='relu'),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),

        # Second Convolutional Block
        Conv2D(128, (3, 3), padding='same', activation='relu'),
        BatchNormalization(),
        Conv2D(128, (3, 3), padding='same', activation='relu'),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),

        # Third Convolutional Block
        Conv2D(256, (3, 3), padding='same', activation='relu'),
        BatchNormalization(),
        Conv2D(256, (3, 3), padding='same', activation='relu'),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),

        # Fourth Convolutional Block
        Conv2D(512, (3, 3), padding='same', activation='relu'),
        BatchNormalization(),
        Conv2D(512, (3, 3), padding='same', activation='relu'),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),

        # Dense Layers
        Flatten(),
        Dense(512, activation='relu'),
        BatchNormalization(),
        Dropout(0.5),
        Dense(256, activation='relu'),
        BatchNormalization(),
        Dropout(0.5),
        Dense(7, activation='softmax')
    ])

    optimizer = Adam(learning_rate=0.001)
    model.compile(
        optimizer=optimizer,
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print("Model created successfully!")
    model.summary()
    return model

def train_model():
    # Create output directory for results
    if not os.path.exists('output'):
        os.makedirs('output')
    
    # Load data
    X, y = load_fer2013()
    if X is None or y is None:
        print("Failed to load dataset. Exiting...")
        return
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f"Training samples: {len(X_train)}, Test samples: {len(X_test)}")
    
    # Data Augmentation
    datagen = ImageDataGenerator(
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        zoom_range=0.2,
        fill_mode='nearest'
    )

    # Create model
    model = create_advanced_model()
    
    # Callbacks
    callbacks = [
        EarlyStopping(
            monitor='val_accuracy',
            patience=15,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.2,
            patience=5,
            min_lr=1e-7,
            verbose=1
        ),
        ModelCheckpoint(
            'output/model.h5',
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        )
    ]

    # Train
    print("\nStarting training...")
    history = model.fit(
        datagen.flow(X_train, y_train, batch_size=64),
        validation_data=(X_test, y_test),
        epochs=100,
        callbacks=callbacks,
        verbose=1
    )

    # Plot training history
    plt.figure(figsize=(15, 5))
    
    # Accuracy plot
    plt.subplot(1, 2, 1)
    plt.plot(history.history['accuracy'], label='Training Accuracy')
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
    plt.title('Model Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    
    # Loss plot
    plt.subplot(1, 2, 2)
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Model Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig('output/training_history.png')
    plt.close()

    # Final evaluation
    print("\nEvaluating model on test set...")
    test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
    print(f"Final Test Accuracy: {test_accuracy*100:.2f}%")
    print(f"Final Test Loss: {test_loss:.4f}")
    
    # Save final results
    with open('output/training_results.txt', 'w') as f:
        f.write(f"Final Test Accuracy: {test_accuracy*100:.2f}%\n")
        f.write(f"Final Test Loss: {test_loss:.4f}\n")
    
    print("\nTraining completed!")
    print("Model saved as 'output/model.h5'")
    print("Training history plot saved as 'output/training_history.png'")
    print("Results saved in 'output/training_results.txt'")

if __name__ == "__main__":
    train_model()
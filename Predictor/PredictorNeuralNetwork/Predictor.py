from keras.models import Sequential
from keras.layers import Activation, Dropout, Flatten, Dense
from keras import backend as K
from keras.preprocessing.sequence import pad_sequences
from keras.preprocessing.image import ImageDataGenerator
from keras.layers import Conv2D, MaxPooling2D
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import cv2
import numpy as np

img_width, img_height = 150, 150
train_data_dir = './UserflowPredictorSystem/predictor/datas/train'
validation_data_dir = './UserflowPredictorSystem/predictor/datas/test'
nb_train_samples = 2000
nb_validation_samples = 800
epochs = 100
batch_size = 16


if K.image_data_format() == 'channels_first':
    input_shape = (3, img_width, img_height)
else:
    input_shape = (img_width, img_height, 3)

def create_model():
    model = Sequential()
    model.add(Conv2D(32, (3, 3), input_shape=input_shape))
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    model.add(Conv2D(32, (3, 3)))
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    model.add(Conv2D(64, (3, 3)))
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    model.add(Flatten())
    model.add(Dense(64))
    model.add(Activation('relu'))
    model.add(Dropout(0.5))
    model.add(Dense(1))
    model.add(Activation('sigmoid'))


    model.compile(loss='binary_crossentropy',
                  optimizer='rmsprop',
                  metrics=['accuracy'])
    return model

def train_model(model):
    # this is the augmentation configuration we will use for training
    train_datagen = ImageDataGenerator(
        rescale=1. / 255,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True)

    # this is the augmentation configuration we will use for testing:
    # only rescaling
    test_datagen = ImageDataGenerator(rescale=1. / 255)

    train_generator = train_datagen.flow_from_directory(
        train_data_dir,
        target_size=(img_width, img_height),
        batch_size=batch_size,
        class_mode='binary')

    validation_generator = test_datagen.flow_from_directory(
        validation_data_dir,
        target_size=(img_width, img_height),
        batch_size=batch_size,
        class_mode='binary')

    model.fit_generator(
        train_generator,
        steps_per_epoch=nb_train_samples // batch_size,
        epochs=epochs,
        validation_data=validation_generator,
        validation_steps=nb_validation_samples // batch_size)

    model.save_weights('./UserflowPredictorSystem/first_try2.h5')
    return model



def load_trained_model(weights_path):
   model = create_model()
   model.load_weights(weights_path)
   return model


def predict(number, model):
    img = cv2.imread("./UserflowPredictorSystem/predictor/datas/test/" + str(number) + ".jpg")
    im = mpimg.imread("./UserflowPredictorSystem/predictor/datas/test/" + str(number) + ".jpg")
    plt.imshow(im)
    img = cv2.resize(img, (img_width,img_height))
    img = img.reshape(1, img_width, img_height, 3)
    res = model.predict(img)
    if res == 1:
        print('DOG')
    else:
        print('CAT')

model = create_model()
model = train_model(model)

import os
os.getcwd()

trained_model = load_trained_model("./UserflowPredictorSystem/first_try2.h5")
trained_model.summary()
import random
predict(random.randint(1,12500), trained_model)
predict('lolly', model)



print(np.argmax(loaded_model.predict(img)))

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
import os
import shutil
import random

img_width, img_height = 150, 150
train_data_dir = './Predictor/PredictorNeuralNetwork/datas/userflows/train/'
validation_data_dir = './Predictor/PredictorNeuralNetwork/datas/userflows/test/'
nb_train_samples = 2000
nb_validation_samples = 800
epochs = 20
batch_size = 16

def copytree(src, dst, symlinks=False, ignore=None):
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        if os.path.isdir(s):
            shutil.copytree(s, d, symlinks, ignore)
        else:
            shutil.copy2(s, d)

def populateDatas():
    copytree('./Predictor/PredictorWebService/trainingImages/virtual', './Predictor/PredictorNeuralNetwork/datas/userflows/train')
    offset = 0
    for folder in os.listdir('./Predictor/PredictorNeuralNetwork/datas/userflows/train'):
        numberOfFiles = len([name for name in os.listdir('./Predictor/PredictorNeuralNetwork/datas/userflows/train/' + folder)])
        numberOfTestFiles = int(numberOfFiles / 10)
        for idx in range(0,numberOfTestFiles):
            file =  os.listdir('./Predictor/PredictorNeuralNetwork/datas/userflows/train/' + folder)[random.randint(0,numberOfTestFiles)]
            shutil.copy2("./Predictor/PredictorNeuralNetwork/datas/userflows/train/" + folder + "/" + file, './Predictor/PredictorNeuralNetwork/datas/userflows/test/' + str(idx + offset) + '.png')
        shutil.copy2("./Predictor/PredictorNeuralNetwork/datas/userflows/train/" + folder + "/" + file, './Predictor/PredictorNeuralNetwork/datas/userflows/test/' + str(idx + offset) + '_SEPARATOR.png')
        offset = numberOfTestFiles

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


    model.compile(loss='categorical_crossentropy',
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
        class_mode='categorical')

    validation_generator = test_datagen.flow_from_directory(
        validation_data_dir,
        target_size=(img_width, img_height),
        batch_size=batch_size,
        class_mode='categorical')

    model.fit_generator(
        train_generator,
        steps_per_epoch=nb_train_samples // batch_size,
        epochs=epochs,
        validation_data=validation_generator,
        validation_steps=nb_validation_samples // batch_size)

    model.save_weights('./Predictor/PredictorNeuralNetwork/weights/userflows.h5')
    return model



def load_trained_model(weights_path):
   model = create_model()
   model.load_weights(weights_path)
   return model


def predict(number, model):
    img = cv2.imread("./Predictor/PredictorNeuralNetwork/datas/userflows/test/" + str(number) + ".png")
    im = mpimg.imread("./Predictor/PredictorNeuralNetwork/datas/userflows/test/" + str(number) + ".png")
    plt.imshow(im)
    img = cv2.resize(img, (img_width,img_height))
    img = img.reshape(1, img_width, img_height, 3)
    res = model.predict(img)
    print(res)

model = create_model()
populateDatas()

model = train_model(model)

os.getcwd()

trained_model = load_trained_model("./Predictor/PredictorNeuralNetwork/weights/userflows.h5")
trained_model.summary()
num = random.randint(1,10)
print(num)
predict(num, trained_model)


print(np.argmax(trained_model.predict(img)))

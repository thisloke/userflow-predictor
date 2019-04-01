
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

import tensorflow as tf
sess = tf.Session(config=tf.ConfigProto(log_device_placement=True))



#from keras.datasets import imdb



#https://gist.github.com/fchollet/0830affa1f7f19fd47b06d4cf89ed44d

img_width, img_height = 150, 150
train_data_dir = './datas/train'
validation_data_dir = './datas/test'
nb_train_samples = 2000
nb_validation_samples = 800
epochs = 10
batch_size = 16


if K.image_data_format() == 'channels_first':
    input_shape = (3, img_width, img_height)
else:
    input_shape = (img_width, img_height, 3)


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

from tensorflow.python.client import device_lib
print(device_lib.list_local_devices())

from keras import backend as K
K.tensorflow_backend._get_available_gpus()

model.save_weights('first_try.h5')
model.summary()

img = cv2.imread("./datas/test/27.jpg")
im = mpimg.imread("./datas/test/27.jpg")
plt.imshow(im)

img = cv2.resize(img, (img_width,img_height))
print(img.shape)
img = img.reshape(1, img_width, img_height, 3)

print(img.shape)
#print(np.argmax(loaded_model.predict(img)))
print(model.predict(img))








K.tensorflow_backend._get_available_gpus()


num_words = 10000
(X_train, y_train), (X_test, y_test) = loadDatas()

maxlen = 500

X_train = pad_sequences(X_train, maxlen=maxlen)
X_test = pad_sequences(X_test, maxlen=maxlen)

from keras.layers import Flatten, LSTM
from keras.layers.convolutional import Conv1D, MaxPooling1D

model = Sequential()
model.add(Embedding(num_words, 50, input_length=500))
model.add(Conv1D(filters=32, kernel_size=3, padding="same", activation="relu"))
model.add(MaxPooling1D(pool_size=2))
model.add(LSTM(32, dropout=0.4))
model.add(Dense(1, activation="sigmoid"))

model.summary()

model.compile(loss="binary_crossentropy", optimizer="rmsprop", metrics=["accuracy"])
model.fit(X_train, y_train, batch_size=512, validation_split=0.2, epochs=5)

model.evaluate(X_test, y_test)

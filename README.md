To compile it and put in production, please follow indications:


Compile

- istruzioni per compilare python

- cd DataGatherer
  - npm run build:prod
- cd..
  - cd Predictor/PredictorWebService 
  - npm run build-ws:prod


Run

sudo docker-compose up

open browser on localhost:8002
database starts to popolate while moving on browser web graphical interface.

To obtain images from data run 
- cd Predictor/PredictorWebService 
- npm run start:image-creator


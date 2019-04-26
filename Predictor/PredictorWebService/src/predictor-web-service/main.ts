import { PredictorWebService } from "./PredictorWebService";

function main() { 
    const predictorWebService = new PredictorWebService('/', 4000, 4100);
    predictorWebService.startPredictor();
    predictorWebService.startTrainer();
}

main();

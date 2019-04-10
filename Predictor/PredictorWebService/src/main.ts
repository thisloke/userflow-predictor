import { PredictorWebService } from "./predictor-web-service/PredictorWebService";

function main() { 
    const predictorWebService = new PredictorWebService('/', 4000, 4100);
    predictorWebService.startExpress();
    predictorWebService.startWebSocket();
}

main();
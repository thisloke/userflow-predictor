import {ImageCreatorService} from "./ImageCreatorService";

function main() { 
    const imageCreatorService = new ImageCreatorService();
    imageCreatorService.startProcessing('./trainingDatas/flow1', 'flow1');
    imageCreatorService.startProcessing('./trainingDatas/flow2', 'flow2');
    imageCreatorService.startProcessing('./trainingDatas/flow3', 'flow3');

}

main();

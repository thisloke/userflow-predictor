import { Sender } from "./sender/Sender";
import { Mouse } from "./source/mouse/Mouse";
import { Gatherer } from "./gatherer/Gatherer";
import { Keyboard } from "./source/keyboard/Keyboard";
import { Screen } from "./source/screen/Screen";

function main() {
    const gatherer: Gatherer = new Gatherer([
            new Screen('screen'),
            new Keyboard('keyboard', ['keydown']),
            new Mouse('mouse', ['click', 'mousemove'])
        ]);

    gatherer.start();
    startPrediction(gatherer);
    startGathering(gatherer);
  
}

function startPrediction(gatherer: Gatherer) {
    const sender: Sender = new Sender(() => gatherer.getData(), 'localhost:4000/predict', 10000);
    sender.start()
        .subscribe(
            val => {
                console.log(val);
            }
        );
}


function startGathering(gatherer: Gatherer) {
    const sender: Sender = new Sender(() => gatherer.getData(), 'localhost:4000/trainData', 3000);
    sender.start()
        .subscribe(
            val => {
                console.log(val);
            }
        );
}

main();

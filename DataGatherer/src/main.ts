import { Sender } from "./sender/Sender";
import { Mouse } from "./source/mouse/Mouse";
import { Gatherer } from "./gatherer/Gatherer";
import { Keyboard } from "./source/keyboard/Keyboard";

function main() {
    const gatherer: Gatherer = new Gatherer([
            new Keyboard('keyboard', ['keydown']), 
            new Mouse('mouse', ['click', 'mousemove'])
        ]);

    gatherer.start();

    const sender: Sender = new Sender(() => gatherer.getData(), '/predictor', 4000, 2000);
    sender.start()
        .subscribe(
            val => {
                console.log(val);
            }
        );
}

main();
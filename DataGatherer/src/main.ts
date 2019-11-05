import { Sender } from "./sender/Sender";
import { Mouse } from "./source/mouse/Mouse";
import { Gatherer } from "./gatherer/Gatherer";
import { Keyboard } from "./source/keyboard/Keyboard";
import { Screen } from "./source/screen/Screen";

declare var UPS_CONFIGS;

function main() {
    const humanGatherer: Gatherer = new Gatherer([
            new Screen('screen'),
            new Keyboard('keyboard', ['keydown']),
            new Mouse('mouse', ['click', 'mousemove'])
        ]);


    //startPrediction(gatherer);
//    startGathering([humanGatherer, botGatherer]);
    startGathering([humanGatherer])
}

function getFlowName() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('flowName');
}

function getAgentName() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('agentName');
}

function startPrediction(gatherer: Gatherer) {
    const sender: Sender = new Sender(() => gatherer.getData(), UPS_CONFIGS.gatherer_ws_url,10000);
    sender.start('http')
        .subscribe(
            val => {
                console.log(val);
            }
        );
}


function startGathering(gatherers: Array<Gatherer>) {
    for(const gatherer of gatherers ) {
        gatherer.start();

        const sender: Sender = new Sender(() => gatherer.getData(), UPS_CONFIGS.gatherer_ws_url+ '?agentName='+getAgentName()+'&flowName='+getFlowName(), 1000);
        sender.start('ws')
            .subscribe(
                val => {
                    console.log(val);
                }
            );
    }
}

main();

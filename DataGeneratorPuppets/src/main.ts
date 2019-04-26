import {Puppet} from "./Puppet";
import {flows} from "../../DataGeneratorPuppets/src/datas/flow";

function main() {

    for(let i = 0; i < 30; i++) {
        let flowIndex = Math.floor(Math.random() * flows.length + 0);
        const puppet = new Puppet('', flows[flowIndex].name, 'bot_'+i, flows[flowIndex].data);
        puppet.run();
    }
}

main();

import {Puppet} from "./Puppet";
import {flows} from "../../DataGeneratorPuppets/src/datas/flow";

function main() {

    let puppetCounter = 0;
    let loop = true;
    let counter = 0;

    setInterval(() =>{
        let res = [];
        if(counter < 10) {
            loop = false;
            counter++;
            let flowIndex = Math.floor(Math.random() * flows.length + 0);

            res.push(new Puppet('', flows[flowIndex].name, 'bot_' + puppetCounter++, flows[flowIndex].data).run());

            Promise.race(res)
                .then(val => {
                    counter--;
                    console.log('Adios');
                    loop = true;
                });
        }
    }, 50)
}

main();

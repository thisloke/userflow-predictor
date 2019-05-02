import {Puppet} from "./Puppet";
import {flows} from "../../DataGeneratorPuppets/src/datas/flow";

function main() {

    /*for(let i = 1; i <= 5; i++) {
        let flowIndex = Math.floor(Math.random() * flows.length + 0);
        const puppet = new Puppet('', flows[flowIndex].name, 'bot_'+i, flows[flowIndex].data);
        puppet.run();
    }*/

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

    /*
    const puppet2 = new Puppet('', flows[flowIndex].name, 'bot_'+puppetCounter++, flows[flowIndex].data).run();
    const puppet3 = new Puppet('', flows[flowIndex].name, 'bot_'+puppetCounter++, flows[flowIndex].data).run();
    const puppet4 = new Puppet('', flows[flowIndex].name, 'bot_'+puppetCounter++, flows[flowIndex].data).run();
    const puppet5 = new Puppet('', flows[flowIndex].name, 'bot_'+puppetCounter++, flows[flowIndex].data).run('infinite');*/

}

main();

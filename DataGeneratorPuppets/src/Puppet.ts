import puppeteer from 'puppeteer';

export class Puppet {
    public flow: { type: string; target: {x: number, y: number, width: number, height: number} }[];
    public url: string;
    public flowName: string;
    public agentName: string;

    mousePosition: {x: number, y: number} = {x:0, y:0};

    constructor(url: string, flowName: string, agentName: string, flow: { type: string; target: {x: number, y: number, width: number, height: number}}[]){
        this.url = url;
        this.flow = flow;
        this.flowName = flowName;
        this.agentName = agentName;
    }

    async execMovements(page, flow: {type: string; target: {x: number, y: number, width: number, height: number} }[]){

        function humanize(val: number, bounduaries: {min: number, max: number}) {
            console.log(val);
            console.log(Math.random() * Math.abs(bounduaries.max));
            return val + (Math.random() * Math.abs(bounduaries.max));
        }

        try {
            await page.goto('file:///C:/Users/Lorenzo/UserflowPredictorSystem/DataGatherer/src/index.html?flowName='+this.flowName+'&agentName=' + this.agentName, {waitUntil: 'load'});
            for(const movement of flow){
                let boundariesX = {min: movement.target.x, max: movement.target.width};
                let boundariesY = {min: movement.target.y, max: movement.target.height};
                if(movement.type === 'click') {
                    await page.mouse.click(humanize(movement.target.x, boundariesX), humanize(movement.target.y, boundariesY), {delay: Math.random() * 500 + 100});
                }
                if(movement.type === 'mousemove') {
                    await page.mouse.move(humanize(movement.target.x, boundariesX), humanize(movement.target.y, boundariesY), {steps: Math.random() * 100 + 50});
                }
            }

        } catch (err) {
            console.log('ERR:', err.message);
        }

    }

    async run() {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await this.execMovements(page, this.flow);
    }
}

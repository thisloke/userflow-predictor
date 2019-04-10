import { Source } from '../Source';
import {Data} from "../../data/Data";

export class Mouse extends Source {

    constructor(name: string, events: Array<string>) {
        super(name, events);
    }

    startCollect() {
        for(const event of this.events){
            document.addEventListener(event, (e: MouseEvent) => {
                this.data.push(new Data(event, {x: e.x, y: e.y}, {width: window.innerWidth, height: window.innerHeight}));
            });
        }
    }
}
   

import { Source } from '../Source';
import Html2CanvasStatic from "html2canvas";
import {Data} from "../../data/Data";

export class Screen extends Source {

    constructor(name: string, events: Array<string> = []) {
        super(name, events);
    }

    public startCollect() {
        const interval = setInterval(() => {
            if (document.body) {
                Html2CanvasStatic(document.body, {logging: false})
                    .then((canvas) => {
                        console.log(canvas);
                        const imgData = canvas.toDataURL("image/png");
                        this.data.push(new Data('screen', imgData, {width: window.innerWidth, height: window.innerHeight}))
                    });
            }
        }, 3000);
    }
}

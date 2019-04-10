import { interval, Observable, of } from 'rxjs';
import { filter, flatMap, delay } from 'rxjs/operators';
import { Rxios } from 'rxios';

export class Sender {
    private url: string;
    private interval: number;
    private dataSourceFn: any;

    constructor(dataSourceFn: any, url: string, interval: number) {
        this.url = url;
        this.interval = interval;
        this.dataSourceFn = dataSourceFn;
    }
    
    public start() {
        return interval(this.interval)
            .pipe(
                flatMap(() => this.send(this.dataSourceFn()))
            )
    }

    private send(data: any) {
        const http: Rxios = new Rxios();
       /* var wsConnect = new WebSocket('ws://' + this.url, "protocolOne");
        wsConnect.send(data);
        wsConnect.onmessage((msg) => {
            console.log(msg)
            }
            //gestire con rxjs o un wrapper di websocket client
        )*/
        return http.post('http://' + this.url, data);
    }
}

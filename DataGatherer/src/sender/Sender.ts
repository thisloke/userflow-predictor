import { interval, Observable, of } from 'rxjs';
import { filter, flatMap, delay } from 'rxjs/operators';
import { Rxios } from 'rxios';
import {Data} from "../data/Data";

export class Sender {
    private url: string;
    private interval: number;
    private dataSourceFn: any;
    private wsConnect;

    constructor(dataSourceFn: any, url: string, interval: number) {
        this.url = url;
        this.interval = interval;
        this.dataSourceFn = dataSourceFn;
    }
    
    public start(protocol: string) {
        if(protocol === 'ws') {
            this.wsConnect = new WebSocket('ws://' + this.url);
        }
        return interval(this.interval)
            .pipe(
                flatMap(() => this.send(this.dataSourceFn(), protocol))
            )
    }

    private send(data: Array<Data>, protocol: string) {
        if(data.length > 0) {
            if (protocol === 'http') {
                const http: Rxios = new Rxios();
                return http.post('http://' + this.url, data);
            }

            if (protocol === 'ws') {
                this.wsConnect.send(JSON.stringify(data));
                return new Observable((observer) => {
                    this.wsConnect.onmessage = (msg) => {
                        console.log(msg);
                        observer.next(msg);
                    };
                });

            }
        } else {
            return of(null)
        }
    }
}

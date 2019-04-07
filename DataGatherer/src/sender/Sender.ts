import { interval, Observable, of } from 'rxjs';
import { filter, flatMap, delay } from 'rxjs/operators';
import { Rxios } from 'rxios';

export class Sender {
    private url: string;
    private port: number;
    private interval: number;
    private dataSourceFn: any;

    constructor(dataSourceFn: any, url: string, port: number, interval: number) {
        this.url = url;
        this.port = port;
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
        //return http.post(this.url, data);
        function generateFakeResponse() {
            return Array.from({length: 20}, () => Math.random().toPrecision(2));
        }

        return of(generateFakeResponse()).pipe(delay(200));
    }
}

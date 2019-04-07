import { Data } from "./../data/Data";

export class Source {
    private name: string;
    public data: Array<any> = [];
    public events: Array<string>;

    constructor(name: string, events: Array<string>) {
        this.name = name;
        this.events = events;
    }

    public startCollect() {
        for(const event of this.events){
            document.addEventListener(event, (e) => {
                this.data.push(new Data(event, e));
            });
        }
    }

    public getData() {
        const data = JSON.parse(JSON.stringify(this.data));
        this.deleteAllData();
        return data;
    }

    public deleteAllData() {
        this.data = [];
    }
}

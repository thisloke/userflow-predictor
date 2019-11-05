import { Data } from "../../../Shared/Data";

export class Source {
    private name: string;
    public data: Array<Data> = [];
    public events: Array<string>;

    constructor(name: string, events: Array<string>) {
        this.name = name;
        this.events = events;
    }

    public startCollect() {
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

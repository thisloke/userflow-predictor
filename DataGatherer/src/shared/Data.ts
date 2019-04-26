export class Data {
    public name: string;
    public data: any;
    public timestamp: number;
    public size: {
        width: number;
        height: number;
    };

    constructor(name: string, data: any, size: any, timestamp?: number) {
        this.name = name;
        this.data = data;
        this.timestamp = timestamp ? timestamp : Date.now();
        this.size = size;
    }

}

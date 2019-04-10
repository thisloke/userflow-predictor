export class Data {
    private name: string;
    private data: any;
    private timestamp: number;
    private size: {
        width: number;
        height: number;
    };

    constructor(name: string, data: any, size: any, timestamp?: number) {
        this.name = name;
        this.data = data;
        this.timestamp = timestamp ? timestamp : Date.now();
        this.size = size;
    }

    public getName() {
        return this.name;
    }

    public getData() {
        return this.data;
    }

    public getTimestamp() {
        return this.timestamp;
    }

    public getSize() {
        return this.size;
    }
}

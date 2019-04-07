export class Data {
    private name: string;
    private data: any;
    private timestamp: number;

    constructor(name: string, data: any) {
        this.name = name;
        this.data = data;
        this.timestamp = Date.now();
    }
}

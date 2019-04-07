import { Source } from "./../source/Source";

export class Gatherer {

    private sources: Array<Source>;

    constructor(sources: Array<Source>) {
        this.sources = sources;
    }

    public start() {
        for(const source of this.sources){
            source.startCollect();
        }
    }

    public getData(): any {
        let allData = [];
        for(const source of this.sources){
            allData = allData.concat(source.getData());
        }
        return allData;
    }
}
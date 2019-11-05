import mongoose from "mongoose";
import {Data} from "../../../../../Shared/Data";
import {Schema} from "mongoose";

const DataSchema_:Schema = new Schema(
    {
        flowName: String,
        agentName: String,
        counter: Number,
        data: Array<Data>()
    }
);

export const DataSchema: any = mongoose.model('Data', DataSchema_, 'datas');

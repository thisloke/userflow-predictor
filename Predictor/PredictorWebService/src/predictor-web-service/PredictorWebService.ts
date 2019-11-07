import express from 'express';
import * as WebSocket from 'ws';
import * as http from 'http';
import cors from 'cors';
import * as bodyParser from "body-parser";
import {Data} from "../../../../Shared/Data";
import parser from 'query-string-parser';
import mongoose from "mongoose";
import {DataSchema} from './models/Data';

export class PredictorWebService {

    private portWebSocket: number;
    private portApi: number;
    private url: string;
    private app: express.Application;
    private httpServer: http.Server; 
    private wss: WebSocket.Server;
    private mongoEndpoint = 'mongodb://ups_database:27017/predictorDatas';

    private counter: number = 0;

    constructor(url: string, portApi: number, portWebSocket: number) {
        this.url = url;
        this.portApi = portApi;
        this.portWebSocket = portWebSocket;
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoEndpoint, { useNewUrlParser: true, useUnifiedTopology: true },
                err => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Connected to MongoDb');
                    this.startPredictor();
                    this.startTrainer();
                }
            });
    }

    public startTrainer() {
        this.httpServer = http.createServer(this.app);
        this.wss = new WebSocket.Server({port: this.portWebSocket});

        this.wss.on('connection', (ws: WebSocket, req: any) => {
            let url = require('url').parse(req.url).query;
            const queryObj = parser.fromQuery(url);
            const that = this;
            ws.on('message', (message: string) => {
                const jsonMsg = JSON.parse(message);
                const data: Array<Data> = jsonMsg.map(d => new Data(d.name, d.data, d.size, d.timestamp));
                that.counter++;
                that.saveData(data, queryObj.flowName, queryObj.agentName)
                    .then( (msg) => {
                        ws.send('trainer - Data saved');
                    })
                    .catch( (err) => {
                        ws.send('trainer - Error while saving data');
                    });
            });
        });
    }

    public startPredictor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.post('/predict', function (req, res) {

            //TODO contatta servizio python
            function generateFakeResponse() {
                return Array.from({length: 20}, () => Math.random().toPrecision(2));
            }
            console.log('predictor - Request prediction');
            res.send(generateFakeResponse());
        });

        this.app.listen(this.portApi, () => {
            console.log('predictor - up and running on port: %d', this.portApi);
        }); 
    }


    saveData(data: Array<Data>, flowName: string, agentName: string) {
        return new Promise((resolve, reject) => {
            const dataSchema = new DataSchema({flowName: flowName, agentName: agentName, counter: this.counter, data: data});
            resolve(dataSchema.save());
        });
    }
}

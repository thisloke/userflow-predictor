import express from 'express';
import * as WebSocket from 'ws';
import * as http from 'http';
import cors from 'cors';
import * as bodyParser from "body-parser";
import fs from 'fs';
import {Data} from "../../../../DataGatherer/src/shared/Data";
import parser from 'query-string-parser';

export class PredictorWebService {

    private portWebSocket: number;
    private portApi: number;
    private url: string;
    private app: express.Application;
    private httpServer: http.Server; 
    private wss: WebSocket.Server;

    private counter: number = 0;

    constructor(url: string, portApi: number, portWebSocket: number) {
        this.url = url;
        this.portApi = portApi;
        this.portWebSocket = portWebSocket;
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
                        if(msg === 'ok') {
                            ws.send('trainer - Data saved');
                        }
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
            console.log(flowName);
            console.log(agentName);
            if(flowName && agentName) {
                fs.mkdirSync('./trainingDatas/' + flowName + '/', { recursive: true });
            } else {
                fs.mkdirSync('./trainingDatas/undefined', { recursive: true });
            }
            if(!flowName && !agentName) {
                fs.writeFile('./trainingDatas/undefined/' + this.counter + '.json', JSON.stringify(data), 'utf8', function (err) {
                    if (err) reject('err');
                    console.log('Data saved');
                    resolve('ok');
                });
            } else {
                fs.writeFile('./trainingDatas/' + flowName + '/' + agentName + '_' + this.counter + '.json', JSON.stringify(data), 'utf8', function (err) {
                    if (err) reject('err');
                    console.log('Data saved');
                    resolve('ok');
                });
            }
        });
    }
}

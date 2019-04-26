import {Data} from "../../../../DataGatherer/src/shared/Data";
import {createCanvas, Image} from "canvas";
import fs from "fs";

export class ImageCreatorService {

    createImageFromData(data: Array<Data>, name: string) {
        return new Promise((resolve, reject) => {
            const htmlElements = data.filter( val => {
               return val.name !== 'screen';
            });
            const mouseClicks = data.filter(val => {
                return val.name === 'click';
            });

            const mouseMovements = data.filter(val => {
                return val.name === 'mousemove';
            });

            const keyboard = data.filter(val => {
                return val.name === 'keydown';
            });

            //todo da cambiare le dimensioni e renderle dinamiche
            const canvas = createCanvas(1000, 800);
            const ctx = canvas.getContext('2d');
            this.printHTMLElements(htmlElements, ctx);
            this.printMouseClick(mouseClicks, ctx);
            this.printMouseMove(mouseMovements, ctx);
            this.printKeyboard(keyboard, ctx);
            const base64data = canvas.toBuffer();
            resolve({data: base64data, name: name});
        });
    }


    saveImage(base64datas: any, path: string) {
        fs.writeFile(path, base64datas, 'base64', function (err) {
            if (err) throw err;
            console.log('Image saved');
        });
    }


    applyDataToImage(data: Array<Data>, name: string) {
        return new Promise((resolve, reject) => {
            const mouseClicks = data.filter(val => {
                return val.name === 'click';
            });
            const mouseMovements = data.filter(val => {
                return val.name === 'mousemove';
            });
            const keyboard = data.filter(val => {
                return val.name === 'keydown';
            });
            const image: any = data.filter(val => {
                return val.name === 'screen';
            })[0];

            if (image) {
                const canvas = createCanvas(image.size.width, image.size.height);
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.onload = () => {
                    this.printImage(img, ctx);
                    this.printMouseClick(mouseClicks, ctx);
                    this.printMouseMove(mouseMovements, ctx);
                    this.printKeyboard(keyboard, ctx);
                    const base64data = canvas.toBuffer();
                    resolve({data: base64data, name: name});
                };
                img.onerror = err => {
                    throw err
                };
                img.src = image.data;
            } else {
                resolve(null);
            }
        });
    }

    printMouseClick(mouseclicks: Array<Data>, ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = 'rgba(219, 10, 91, 0.5)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        for(const move of mouseclicks){
            ctx.strokeRect(move.data.x, move.data.y,10, 10);
        }
        ctx.stroke();
    }

    printHTMLElements(htmlElements: Array<Data>, ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = 'rgba(33, 123, 22, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for(const element of htmlElements){
            ctx.fillStyle = element.data.target.style.backgroundColor !== '' ? element.data.target.style.backgroundColor : 'transparent';
            ctx.fillRect(element.data.target.rect.x, element.data.target.rect.y, element.data.target.rect.width,  element.data.target.rect.height);
            ctx.strokeRect(element.data.target.rect.x, element.data.target.rect.y, element.data.target.rect.width,  element.data.target.rect.height);
            ctx.font = "10px Arial";
            ctx.fillStyle = 'black';
            ctx.textAlign = "center";
            ctx.fillText(element.data.target.id, element.data.target.rect.x + element.data.target.rect.width/2,  element.data.target.rect.y + element.data.target.rect.height/2);
        }
        ctx.stroke();
    }

    printMouseMove(mousemoves: Array<Data>, ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        for(const move of mousemoves){
            ctx.lineTo(move.data.x, move.data.y);
        }
        ctx.stroke();
    }

    printKeyboard(keyboard: Array<Data>, ctx: CanvasRenderingContext2D) {

    }

    printImage(image: any, ctx: CanvasRenderingContext2D){
        ctx.drawImage(image, 0, 0);
    }


    public startProcessing(srcPath: string, destPath: string) {
        const that = this;
        fs.readdir(srcPath, function(err, items) {

            for (var i=0; i<items.length; i++) {
                const data = fs.readFileSync(srcPath + '/' + items[i]);
                try {
                    const jsonData = JSON.parse(data.toString('utf8'));
                    fs.mkdirSync('./trainingImages/virtual/' + destPath, {recursive: true});
                    that.createImageFromData(jsonData, items[i].split('.')[0])
                        .then(res => {
                            if(res) {
                                console.log('virtual image ' + ' processed');
                                that.saveImage(res['data'], './trainingImages/virtual/' + destPath + '/' + res['name'] + '.png');
                            }
                        });

                    that.applyDataToImage(jsonData, items[i].split('.')[0])
                        .then(res => {
                            if(res) {
                                console.log('real image ' + ' processed');
                                that.saveImage(res['data'], './trainingImages/real/' + destPath + '/' + res['name'] + '.png');
                            }
                        });
                } catch (e) {
                    console.log('file not valid');
                }
            }
        });

    }
}

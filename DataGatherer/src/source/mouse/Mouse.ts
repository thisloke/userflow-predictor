import { Source } from '../Source';
import {Data} from "../../../../Shared/Data";

export class Mouse extends Source {

    constructor(name: string, events: Array<string>) {
        super(name, events);
    }

    startCollect() {
        this.collectHumanDatas();
    }

    collectHumanDatas() {
        for(const event of this.events){
            document.addEventListener(event, (e: MouseEvent) => {
                this.data.push(
                    new Data(
                        event,
                        {
                            x: e.x,
                            y: e.y,
                            target: {
                                id: e.target['id'],
                                innerText: e.target['innerText'],
                                style: {
                                    backgroundColor: e.target['style'].backgroundColor
                                },
                                rect: e.target['getBoundingClientRect']()
                            }
                        }, {
                            width: window.innerWidth,
                            height: window.innerHeight
                        }
                    )
                );
            });
        }
    }

    /*collectBotDatas(flow: Array<MouseEventFlow>) {

        function getIntersectedElement(position: {x: number, y: number}) {
            //for()
        }

        function computeMovement(startingPoint: {x: number, y: number}, targetId: string): Promise<Array<Data>> {
            return new Promise( (resolve, reject) => {
                let movements = [];

                const target = document.getElementById(targetId);
                const targetCenterCoords = {x: target.getBoundingClientRect().left + target.getBoundingClientRect().width / 2, y: target.getBoundingClientRect().top + target.getBoundingClientRect().height / 2};

                const distance_x = Math.abs(startingPoint.x - targetCenterCoords.x);
                const distance_y = Math.abs(startingPoint.y - targetCenterCoords.y);
                const distance = Math.sqrt(Math.pow(distance_x, 2) + Math.pow(distance_y, 2));

                const movementTime = Math.random() * 5000 + 1000;

                if(distance) {
                    const trance = Math.floor(distance / 20);
                    const step_x = distance_x / trance;
                    const step_y = distance_y / trance;
                    let i = 1;
                    const interval = setInterval(() => {
                        movements.push(new Data(
                            'mousemove',
                            {
                                x: startingPoint.x > targetCenterCoords.x ? startingPoint.x - step_x * i :  startingPoint.x + step_x * i ,
                                y: startingPoint.y > targetCenterCoords.y ? startingPoint.y - step_y * i :  startingPoint.y + step_y * i ,
                                target: {
                                    id: '',
                                    innerText: '',
                                    style: {},
                                    rect: {}
                                }
                            }, {
                                width: window.innerWidth,
                                height: window.innerHeight
                            })
                        );
                        i++;
                        if(i > trance) {
                            console.log(target);
                            clearInterval(interval);
                            resolve(movements);
                        }
                    }, movementTime / trance);
                } else {
                    movements = [];
                    resolve(movements);
                }
            })
        }

        function computeInit(): Data {
            return new Data(
                'mousemove',
                {
                    x: Math.floor(Math.random() * window.innerWidth) + 1,
                    y: Math.floor(Math.random() * window.innerHeight) + 1,
                    target: {
                        id: '',
                        innerText: '',
                        style: {},
                        rect: {}
                    }
                }, {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            );
        }

        let i = 0;
        let evt = flow[i];
        const interval = setInterval( () => {
            evt = flow[i];
            if(evt.type === 'init') {
                this.data.push(computeInit());
                i++;
            }

            if(evt.type === 'mousemove') {
                computeMovement({x: this.data[this.data.length-1].data.x, y: this.data[this.data.length-1].data.y}, evt.target)
                    .then(
                        movements => {
                            console.log(movements);
                            this.data.push(...movements);
                            i++;
                        }
                    );
            }

            if(evt.type === 'click') {
                i++;
            }

            if(i === flow.length) {
                clearInterval(interval);
            }
        }, 20);

    }*/
}
   

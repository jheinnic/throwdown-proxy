import {Canvas} from 'canvas';
import * as fs from 'fs';
import {new_new_picture, new_picture, compute_pixel} from './genjs5';

import {IncrementalPlotObserver} from '../interface';
import {ModelSeed} from '../messages';

export class RandomArtModel implements IncrementalPlotObserver {
    private readonly genModel: any;
    private readonly context: CanvasRenderingContext2D;

    public constructor(public readonly modelSeed: ModelSeed, private readonly canvas: Canvas) {
        const prefix = [...modelSeed.prefixBits];
        const suffix = [...modelSeed.suffixBits];

        if (modelSeed.novel) {
            // @ts-ignore
            this.genModel = new_new_picture(prefix, suffix);
        } else {
            // @ts-ignore
            this.genModel = new_picture(prefix, suffix);
        }

        this.context = canvas.getContext('2d')!;
        if (this.context === null) {
            throw new Error('Canvas failed to return a 2D context object?');
        }
    }

    public onComplete(): void {
        const filePath = "temp2.png";
        console.log(`Entered stream writer for ${filePath}`);

        const out = fs.createWriteStream(filePath);
        const stream = this.canvas.createPNGStream();

        out.on('end', () => {
            console.log(`Saved png of ${out.bytesWritten} bytes to ${filePath}`);
        });

        stream.on('error', function (err: any) {
            console.error('Brap!', err);
            out.close();
        });

        stream.pipe(out);
    }

    public onError(error: any): void {
        console.error(error);
    }

    public plot(canvasX: number, canvasY: number, modelX: number, modelY: number): void {
        // @ts-ignore
        this.context.fillStyle = compute_pixel(this.genModel, modelX, modelY);
        // console.log(`<${canvasX}, ${canvasY}> @ ${this.context.fillStyle}`)
        this.context.fillRect(canvasX, canvasY, 1, 1);
    }
}


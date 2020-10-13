import { WorkArea } from './work-area.model';

export class Agv {
    private progress = 0
    private error = false

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public getProgress(): number {
        return this.progress;
    }
    public setProgress(value: number) {
        this.progress = value;
    }
    public getError(): boolean {
        return this.error;
    }
    public setError(value: boolean) {
        this.error = value;
    }

    constructor(private _id: number) {
    }
}

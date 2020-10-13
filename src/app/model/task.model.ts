export class Task{
    public get create_time(): Date {
        return this._create_time;
    }
    public set create_time(value: Date) {
        this._create_time = value;
    }
    public get task_ref(): String {
        return this._task_ref;
    }
    public set task_ref(value: String) {
        this._task_ref = value;
    }
    public get task_type_id(): Number {
        return this._task_type_id;
    }
    public set task_type_id(value: Number) {
        this._task_type_id = value;
    }
    public get component_id(): Number {
        return this._component_id;
    }
    public set component_id(value: Number) {
        this._component_id = value;
    }
    public get error_time(): Date {
        return this._error_time;
    }
    public set error_time(value: Date) {
        this._error_time = value;
    }
    public get oper_id(): Number {
        return this._oper_id;
    }
    public set oper_id(value: Number) {
        this._oper_id = value;
    }
    public get agv_id(): Number {
        return this._agv_id;
    }
    public set agv_id(value: Number) {
        this._agv_id = value;
    }
    public get task_comment(): String {
        return this._task_comment;
    }
    public set task_comment(value: String) {
        this._task_comment = value;
    }
    public get task_status_id(): Number {
        return this._task_status_id;
    }
    public set task_status_id(value: Number) {
        this._task_status_id = value;
    }
    public get stop_time(): Date {
        return this._stop_time;
    }
    public set stop_time(value: Date) {
        this._stop_time = value;
    }
    public get start_time(): Date {
        return this._start_time;
    }
    public set start_time(value: Date) {
        this._start_time = value;
    }
    public get order_id(): Number {
        return this._order_id;
    }
    public set order_id(value: Number) {
        this._order_id = value;
    }
    public get mach_det_id(): Number {
        return this._mach_det_id;
    }
    public set mach_det_id(value: Number) {
        this._mach_det_id = value;
    }
    public get task_descr(): String {
        return this._task_descr;
    }
    public set task_descr(value: String) {
        this._task_descr = value;
    }
    public get task_id(): Number {
        return this._task_id;
    }
    public set task_id(value: Number) {
        this._task_id = value;
    }

    constructor(
        private _task_id: Number,
        private _task_descr: String,
        private _mach_det_id: Number,
        private _order_id: Number,
        private _start_time: Date,
        private _stop_time: Date,
        private _task_status_id: Number,
        private _task_comment: String,
        private _agv_id: Number,
        private _oper_id: Number,
        private _error_time: Date,
        private _component_id: Number,
        private _task_type_id: Number,
        private _task_ref: String,
        private _create_time: Date){

    }



}
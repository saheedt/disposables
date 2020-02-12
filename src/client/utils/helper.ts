export default class Helper {
    static clone(data: any) {
        return JSON.parse(JSON.stringify(data));
    }
}
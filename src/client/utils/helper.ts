export default class Helper {
    static clone(data: any) {
        return JSON.parse(JSON.stringify(data));
    }

    static get routeMediaQueries() {
        return {
            mobile: "(max-width: 719px)",
            tablet: "(min-width: 720px) and (max-width: 1079px)",
            desktop: "(min-width: 1080px) and (max-width: 1199px)",
            widescreen: "(min-width: 1200px)",
            landscape: "(orientation: landscape)"
        };
    }

    static fetchLocalStorageItem(item: string) {
        return JSON.parse(localStorage.getItem(item));
    }

    static removeLocalStorageItem(item: string) {
        localStorage.removeItem(item);
    }

    static isEmptyOrNull(str: string) {
        return (!str || /^\s*$/.test(str));
    }
}
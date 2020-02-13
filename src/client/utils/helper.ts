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
}
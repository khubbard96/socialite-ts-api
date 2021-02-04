import { Router } from "express";

class SocialiteApiRoute {
    private name: string;
    private route: Router;

    constructor(name: string, router: Router) {
        if(!name) throw new Error();
        this.name = name;
        if(!router) throw new Error();
        this.route = router;
    }
    getName(): string {
        return this.name;
    }
    getRoute(): Router {
        return this.route;
    }
}

export default SocialiteApiRoute;
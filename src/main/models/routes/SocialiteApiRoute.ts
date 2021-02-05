import { Router } from "express";

class SocialiteApiRoute {
    private name: string;
    private route: Router;
    private handle: string;

    constructor(name: string, router: Router, handle: string) {
        if(!name) throw new Error();
        this.name = name;
        if(!router) throw new Error();
        this.route = router;
        if(!handle) throw new Error();
        this.handle = handle;
    }
    getName(): string {
        return this.name;
    }
    getRoute(): Router {
        return this.route;
    }
    getHandle(): string{
        return this.handle;
    }
}

export default SocialiteApiRoute;
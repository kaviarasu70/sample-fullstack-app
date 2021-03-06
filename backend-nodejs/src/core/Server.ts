///<reference path="../../typings/index.d.ts" />

import * as Hapi from 'hapi';
import {IApplicationContext} from "./context/IApplicationContext";
import {StockRoutes} from "../web/route/StockRoutes";

let packageJson = require('../../package.json');

export class Server {
    private hapiServer: Hapi.Server;
    private config: any;
    private applicationContext: IApplicationContext;

    /**
     *
     * @param applicationContext
     */
    constructor(applicationContext: IApplicationContext) {
        this.applicationContext = applicationContext;
    }

    /**
     *
     */
    public startServer(): void {
        this.hapiServer = new Hapi.Server({
            connections: {
                router: {
                    isCaseSensitive: false,
                    stripTrailingSlash: false
                }
            },
            debug: {
                log: ['error', 'uncaught'],
                request: ['error', 'uncaught']
            }
        });

        this.hapiServer.on('request-error', function(request, err) {
            console.log("server error");
        });

        this.config = require('rc')(packageJson.name, {
            port: 8080,
            basePath: 'http://localhost:8080'
        });

        this.hapiServer.connection({ port: this.config.port, routes: { cors: true } });

        this.hapiServer.start(() => {
            console.log('Server running at:', this.hapiServer.info.uri);
        });
    }

    /**
     *
     */
    public initializeRoutes(): void {
        let stockRoutes : StockRoutes = new StockRoutes( this.applicationContext );
        this.hapiServer.route( stockRoutes.createRoutes() );
    }
}
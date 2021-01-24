export declare class Server {
    private httpServer;
    private app;
    private io;
    private activeSockets;
    private readonly DEFAULT_PORT;
    constructor();
    private handleRoutes;
    private handleSocketConnection;
    listen(callback: (port: any) => void): void;
    private configureApp;
}

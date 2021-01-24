"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
class Server {
    constructor() {
        this.activeSockets = [];
        this.DEFAULT_PORT = 5000;
        this.app = express_1.default();
        this.httpServer = http_1.createServer(this.app);
        this.io = socket_io_1.default(this.httpServer);
        this.configureApp();
        this.handleRoutes();
        this.handleSocketConnection();
    }
    handleRoutes() {
        this.app.get("/", (req, res) => {
            res.send(`<h1>Hello World</h1>`);
        });
    }
    handleSocketConnection() {
        this.io.on("connection", socket => {
            const existingSocket = this.activeSockets.find(i => i === socket.id);
            if (!existingSocket) {
                this.activeSockets.push(socket.id);
                socket.emit("update-user-list", {
                    users: this.activeSockets.filter(i => i !== socket.id)
                });
                socket.broadcast.emit("update-user-list", {
                    users: [socket.id]
                });
            }
            socket.on("disconnect", () => {
                this.activeSockets = this.activeSockets.filter(existingSocket => existingSocket !== socket.id);
                socket.broadcast.emit("remove-user", {
                    socketId: socket.id
                });
            });
            socket.on("call-user", data => {
                socket.to(data.to).emit("call-made", {
                    offer: data.offer,
                    socket: socket.id
                });
            });
            socket.on("make-answer", data => {
                socket.to(data.to).emit("answer-made", {
                    socket: socket.id,
                    answer: data.answer
                });
            });
        });
    }
    listen(callback) {
        this.httpServer.listen(this.DEFAULT_PORT, () => callback(this.DEFAULT_PORT));
    }
    configureApp() {
        this.app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map
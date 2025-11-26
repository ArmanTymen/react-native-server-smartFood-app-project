"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
const JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_SECRET = JWT_SECRET;
if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined! Exiting...');
    process.exit(1);
}

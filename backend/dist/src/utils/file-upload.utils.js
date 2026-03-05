"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDynamicUploadPath = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const getDynamicUploadPath = (basePath, identifier) => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());
    const sanitizedIdentifier = identifier.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
    const relativePath = (0, path_1.join)(basePath, sanitizedIdentifier, month, year);
    const absolutePath = (0, path_1.join)(process.cwd(), relativePath);
    if (!(0, fs_1.existsSync)(absolutePath)) {
        (0, fs_1.mkdirSync)(absolutePath, { recursive: true });
    }
    return absolutePath;
};
exports.getDynamicUploadPath = getDynamicUploadPath;
//# sourceMappingURL=file-upload.utils.js.map
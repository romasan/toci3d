exports.v2d = (x = 0, y = 0) => ({x, y});
exports.add2d = (a, b) => (v2d(a.x + b.x, a.y + b.y));
exports.mult2d = (a, b) => typeof b === 'number' ? v2d(a.x * b, a.y * b) : v2d(a.x * b.x, a.y * b.y);
exports.v3d = (x = 0, y = 0, z = 0) => ({x, y, z});
exports.add3d = (a, b) => (v2d(a.x + b.x, a.y + b.y, a.z + b.z));
exports.mult3d = (a, b) => typeof b === 'number' ? v2d(a.x * b, a.y * b, a.z * b) : v2d(a.x * b.x, a.y * b.y, a.z * b.z);
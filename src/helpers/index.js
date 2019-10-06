export const debounce = (f, t, x) => (...a) => { clearTimeout(x), x = setTimeout(f, t, ...a); }

export const trottle = (f, t, x = Date.now() - t) => (...a) => { Date.now() - x >= t && f(...a), x = Date.now(); }

export class el {
    constructor(wrap, tag = 'div', text) {
        this.wrap = wrap;
        this.el = document.createElement(tag);
        wrap.appendChild(this.el);
        this.prefix = text;
        this.text = text || '';
    }
    set text(v) {
        this.el.innerText = this.prefix ? (this.prefix + ': ' + v) : v;
    }
    set color(v) {
        this.el.style.color = v;
    }
}

export const v2d = (x = 0, y = 0) => ({x, y});

export const add2d = (a, b) => (v2d(a.x + b.x, a.y + b.y));

export const mult2d = (a, b) => typeof b === 'number' ? v2d(a.x * b, a.y * b) : v2d(a.x * b.x, a.y * b.y);

export const v3d = (x = 0, y = 0, z = 0) => ({x, y, z});

export const add3d = (a, b) => (v2d(a.x + b.x, a.y + b.y, a.z + b.z));

export const mult3d = (a, b) => typeof b === 'number' ? v2d(a.x * b, a.y * b, a.z * b) : v2d(a.x * b.x, a.y * b.y, a.z * b.z);
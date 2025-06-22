export const CanvasOptions = class {
    constructor() {
        this.default = {
            snakeCount: 10,
            fps: 15,
            lastFps: 15,
            grid: {
                size: 8,
                gap: 4
            },
            isPageHidden: false,
            isDebugMode: false
        };
        this.settings = {};
        this.load();
    }

    save() {
        localStorage.setItem('CanvasOptions', JSON.stringify(this.settings));
    }

    load() {
        const savedOptions = localStorage.getItem('CanvasOptions');
        if (savedOptions) {
            this.settings = { ...this.settings, ...JSON.parse(savedOptions) };
        } else {
            this.settings = this.default;
        }
    }

    reset() {
        this.settings = this.default;
        this.save();
        this.load();
    }

    update(key, value) {
        if (key.includes('.')) {
            const [parent, child] = key.split('.');
            this.settings[parent][child] = value;
        } else {
            this.settings[key] = value;
        }
        this.save();
    }

    get(key) {
        if (key != null) {
            return this.settings[key];
        } else {
            return {...this.settings};
        }
    }

    getDefault(key) {
        if (key != null) {
            return this.default[key];
        } else {
            return {...this.default};
        }
    }
}
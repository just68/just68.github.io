export const CanvasSettings = class {
    constructor() {
        this.defaultSettings = {
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

        this.loadSettings();
    }

    saveSettings() {
        localStorage.setItem('CanvasSettings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('CanvasSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        } else {
            this.settings = this.defaultSettings;
        }
    }

    resetSettings() {
        this.settings = this.defaultSettings;
        this.saveSettings();
        this.loadSettings();
    }

    updateSetting(key, value) {
        if (key.includes('.')) {
            const [parent, child] = key.split('.');
            this.settings[parent][child] = value;
        } else {
            this.settings[key] = value;
        }
        this.saveSettings();
    }

    getSetting(key) {
        if (key != null) {
            return this.settings[key];
        } else {
            return {...this.settings};
        }
    }

    getDefaultSetting(key) {
        if (key != null) {
            return this.defaultSettings[key];
        } else {
            return {...this.defaultSettings};
        }
    }
}
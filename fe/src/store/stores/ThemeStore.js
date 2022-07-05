import { makeAutoObservable } from "mobx";
import { themes, getTheme, setTheme } from "../../utils/themes";

class ThemeStore {
    constructor(root) {
        makeAutoObservable(this);
        this.root = root;
    }

    theme = getTheme();
    themes = themes;
    nextTheme = (theme) => (this.theme = setTheme(theme));
}

export default ThemeStore;

import { observer } from "mobx-react";
import { useStore } from "./store/store";
import { setColorScheme, themeIcons } from "./utils/themes";

const ThemeSelector = observer(() => {
    const {
        themeStore: { theme, themes, nextTheme },
    } = useStore();

    return (
        <div onMouseLeave={() => nextTheme(theme)} className="themes-wrapper">
            {themes.map((name) => (
                <div
                    key={`theme-${name}`}
                    onMouseEnter={() => setColorScheme(name)}
                    onClick={() => nextTheme(name)}
                    className="theme-selector"
                >
                    {themeIcons[name]} {name} theme
                </div>
            ))}
        </div>
    );
});

export default ThemeSelector;

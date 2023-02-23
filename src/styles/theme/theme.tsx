let THEME = {
    "light": {
        backgroundColor: {
            primary: "#ffffff",
            secondary: "rgb(45, 45, 45)",
            tertiary: "rgba(45,45,45, 0.3)",
        },
        textColor: {
            primary: "rgb(45, 45, 45)",
            secondary: "rgb(70, 70, 70)",
            tertiary: "rgb(130, 255, 180)"
        },
        shadow: {
            primary: "0 0 1.5rem 1rem rgba(0, 0, 0, 0.3)",
            secondary: "0 0 1rem rgba(255, 255, 255, 0.3)",
            tertiary: "0 0 1rem rgb(130, 255, 180)",
        }
    },
    "dark" : {
    }
}

export default THEME;

type THEME_TYPE = typeof THEME['light'];

export type {THEME_TYPE};
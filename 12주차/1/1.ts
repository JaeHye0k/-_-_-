// https://vanilla-extract.style/documentation/global-api/create-global-theme/
import { createGlobalTheme, style } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
    color: {
        main0: "#EAF2F8",
        main1: "#D4E6F1",
        main2: "#A9CCE3",
        main3: "#7FB3D5",
        main4: "#5499C7",
        main5: "#2980B9",
        main6: "#2471A3",
        main7: "#1F618D",
        main8: "#1A5276",
        main9: "#154360",
    },
    fontSizing: {
        T1: "32px",
        T2: "24px",
        T3: "18px",
        T4: "14px",
        P1: "12px",
    },
    spacing: {
        small: "5px",
        medium: "10px",
        big1: "20px",
        big2: "15px",
        list: "30px",
    },
    font: {
        body: "arial",
    },
    shadow: {
        basic: "4px 4px 8px 0px rgba(34, 60, 80, 0.2)",
    },
    minWidth: {
        list: "250px",
    },
});

export const appContainer = style({
    flexDirection: "column",
    minHeight: "100vh",
    height: "max-content",
    width: "100vw",
});

export const board = style({
    display: "flex",
    flexDirection: "row",
    height: "100%",
});

export const buttons = style({
    marginTop: "auto",
    paddingLeft: vars.spacing.big2,
});

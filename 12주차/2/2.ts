import { style } from "@vanilla-extract/css";
import { vars } from "../../../App.css";

export const taskForm = style({
    display: "flex",
    flexDirection: "column",
    height: "max-content",
    borderRadius: 4,
    marginTop: vars.spacing.small,
    fontSize: vars.fontSizing.T3,
    padding: vars.spacing.medium,
});

export const listForm = style({
    display: "flex",
    flexDirection: "column",
    marginRight: vars.spacing.list,
    padding: vars.spacing.big2,
    width: "max-content",
    height: "max-content",
    borderRadius: 20,
    backgroundColor: vars.color.main3,
});

export const input = style({
    padding: vars.spacing.medium,
    fontSize: vars.fontSizing.P1,
    minHeight: 60,
    marginBottom: vars.spacing.medium,
    border: "none",
    boxShadow: vars.shadow.basic,
    borderRadius: 4,
    resize: "none",
    overflow: "hidden",
    wordWrap: "break-word",
});

export const button = style({
    width: 150,
    color: vars.color.main0,
    padding: vars.spacing.medium,
    fontSize: vars.fontSizing.T3,
    backgroundColor: vars.color.main7,
    border: "none",
    cursor: "pointer",
    ":hover": {
        backgroundColor: vars.color.main5,
    },
});

export const buttons = style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
});

export const close = style({
    marginLeft: vars.spacing.big2,
    fontSize: vars.fontSizing.T1,
    opacity: 0.5,
    ":hover": {
        opacity: 0.7,
    },
});

import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  wrapper: {
    background: theme.palette.background.main,
    height: "100vh"
  }
}));

// eslint-disable-next-line react/prop-types
export default ({ children }) => {
  const classes = useStyles();
  return <div className={classes.wrapper}>{children}</div>;
};

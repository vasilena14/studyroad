import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 900,
    margin: "auto",
    marginBottom: theme.spacing(5),
    padding: `${theme.spacing(3.5)}px `,
  },
  title: {
    padding: `${theme.spacing(1)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
  },
  content: {
    color: "#3f5d71",
    marginTop: "8px",
    marginBottom: 12,
    marginLeft: 8,
    padding: `0px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
  },
  credit: {
    textAlign: "center",
    fontSize: "14px",
    color: "#3f5d71",
  },
}));

export default function More() {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.card} elevation={4}>
        <Typography variant="h5" component="h2" className={classes.title}>
          Стани преподавател
        </Typography>
        <Typography variant="body1" className={classes.content}>
          Искаш да станеш преподавател при нас и да изготвяш и качваш курсове?
          <br />
          <br />
          Изпрати ни имейл на{" "}
          <a
            style={{ color: "#f4b318", fontWeight: "500" }}
            href="mailto:studyroad.platform@gmail.com"
          >
            studyroad.platform@gmail.com
          </a>{" "}
          озаглавен{" "}
          <span style={{ color: "#f4b318", fontWeight: "500" }}>
            "Искам да преподавам"
          </span>{" "}
          като напишеш{" "}
          <span style={{ color: "#f4b318", fontWeight: "500" }}>Името</span> и{" "}
          <span style={{ color: "#f4b318", fontWeight: "500" }}>Имейла</span>, с
          които си се регистрирал в нашия сайт и накратко представиш идеята си
          за това какви твои знания биха били полезни на хората.
        </Typography>
        <Typography variant="h5" component="h2" className={classes.title}>
          Други въпроси
        </Typography>
        <Typography variant="body1" className={classes.content}>
          За въпроси, свързани с вашия акаунт или с качените от вас курсове, ако
          имате дори предложения за подобряване работата на платформата, може да
          ни пишете на{" "}
          <a
            style={{ color: "#f4b318", fontWeight: "500" }}
            href="mailto:studyroad.platform@gmail.com"
          >
            studyroad.platform@gmail.com
          </a>
        </Typography>
      </Card>
    </>
  );
}

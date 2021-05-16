import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import favicon from "serve-favicon";
import path from "path";
import renderFullPage from "./../renderFullPage";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";

import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import MainRouter from "./../client/MainRouter";
import { ServerStyleSheets, ThemeProvider } from "@material-ui/styles";
import theme from "./../client/theme";

//only for development mode - comment out for production
// import devBundle from "./devBundle";

const CURRENT_WORKING_DIR = process.cwd();
// const app = express();

//only for development mode - comment out for production
devBundle.compile(app);

app.use(favicon(path.join(CURRENT_WORKING_DIR, "public", "favicon.ico")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));

app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", courseRoutes);
app.use("/", enrollmentRoutes);

app.get("*", (req, res) => {
  const sheets = new ServerStyleSheets();
  const context = {};
  const html = ReactDOMServer.renderToString(
    sheets.collect(
      <StaticRouter location={req.url} context={context}>
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
      </StaticRouter>
    )
  );

  if (context.url) {
    return res.redirect(303, context.url);
  }

  const css = sheets.toString();

  res.status(200).send(
    renderFullPage({
      html: html,
      css: css,
    })
  );
});

app.get("/favicon.ico", function (req, res) {
  res.status(204);
  res.end();
});

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

//Catches unauthorized errors
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

export default app;

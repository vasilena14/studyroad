export default ({ html, css }) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Studyroad</title>
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
            a{
              text-decoration: none;
              color: #002940
            }
        </style>
      </head>
      <body style="margin:0; background-color:#f2f2f2; padding-bottom: 40px">
      <div id="root" >${html}</div>
      <style id="jss-server-side">${css}</style>
      <script type="text/javascript" src="/dist/bundle.js"></script>
      </body> 
    </html>`;
};

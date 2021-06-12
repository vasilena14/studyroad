export default ({ html, css }) => {
  return `<!DOCTYPE html>
    <html lang="bg">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>StudyRoad</title>
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
            a{
              text-decoration: none;
              color: #002940
            }
        </style>
      </head>
      <body style="margin:0; background-color:#f2f2f2; min-height: 100vh; display: flex; flex-direction: column;">
        <div id="root" >${html}</div>
        <style id="jss-server-side">${css}</style>
        <script type="text/javascript" src="/dist/bundle.js"></script>
        <div style="color: #3f5d71; font-family: 'Montserrat'; font-size: 12px; text-align: center; width: 100%; margin-top: auto; padding-bottom: 5px;">Copyright &copy <script>document.write(new Date().getFullYear())</script> Vassilena Vassileva</div>
      </body> 
    </html>`;
};

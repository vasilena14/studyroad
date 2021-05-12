export default ({ html, css }) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
      <meta charset="utf-8">
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        >
        <title>Studyroad</title>
        <link rel="preconnect" href="https://fonts.gstatic.com">
        
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
            a{
              text-decoration: none;
              color: #061d95
            }
        </style>
      </head>
      <body style="margin:0">
      <div id="root">${html}</div>
      <style id="jss-server-side">${css}</style>
      <script type="text/javascript" src="/dist/bundle.js"></script>
      </body> 
    </html>`;
};

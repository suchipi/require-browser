module.exports = port => `
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>require-browser test page</title>
  <style>
    .code {
      font-family: monospace;
    }
  </style>
</head>

<body>
  <script src="http://localhost:${port}/require-browser.js"></script>
  <h1>Open your browser's DevTools to try out the global <span class="code">require</span> function</h1>
</body>

</html>
`;

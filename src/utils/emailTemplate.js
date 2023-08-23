export const emailTemplate = (customerName, invoiceLink) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #ff9700;
            color: #ffffff;
            padding: 10px 0;
            text-align: center;
          }
          .content {
            padding: 20px 0;
          }
          .button {
            display: inline-block;
            background-color: #ff9700;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Gracias por tu compra!</h1>
          </div>
          <div class="content">
            <p>Hola <b>${customerName}</b>,</p>
            <p>Gracias por tu compra. Aquí está el enlace para acceder a tu comprobante de pago:</p>
            <p><a class="button" href="${invoiceLink}">Ver Comprobante</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
};

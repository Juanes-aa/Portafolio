const nodemailer = require('nodemailer');

// Configuración del transportador de email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // Puedes cambiar a 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER, // Tu email
      pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación
    }
  });
};

// Validación de datos
const validateContactData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email inválido');
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('El mensaje debe tener al menos 10 caracteres');
  }

  return errors;
};

// Handler principal
exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*', // En producción, cambia a tu dominio específico
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Método no permitido' })
    };
  }

  try {
    // Parse del body
    const data = JSON.parse(event.body);
    
    // Validar datos
    const validationErrors = validateContactData(data);
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          message: 'Errores de validación',
          errors: validationErrors 
        })
      };
    }

    // Verificar variables de entorno
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Variables de entorno EMAIL_USER o EMAIL_PASS no configuradas');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          message: 'Error de configuración del servidor' 
        })
      };
    }

    // Crear transportador
    const transporter = createTransporter();

    // Configurar email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Enviar a tu propio email
      replyTo: data.email, // Para poder responder al remitente
      subject: `🔔 Nuevo mensaje de contacto - Portafolio`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #E63946 0%, #9B2226 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px;
            }
            .field {
              margin-bottom: 20px;
            }
            .field-label {
              font-weight: bold;
              color: #E63946;
              font-size: 14px;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .field-value {
              color: #333;
              font-size: 16px;
              line-height: 1.6;
            }
            .message-box {
              background-color: #f9f9f9;
              border-left: 4px solid #E63946;
              padding: 15px;
              border-radius: 5px;
              margin-top: 10px;
            }
            .footer {
              background-color: #f4f4f4;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            .divider {
              height: 1px;
              background: linear-gradient(to right, transparent, #E63946, transparent);
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 Nuevo Mensaje de Contacto</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Nombre</div>
                <div class="field-value">${data.name}</div>
              </div>
              <div class="divider"></div>
              <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value">
                  <a href="mailto:${data.email}" style="color: #E63946; text-decoration: none;">
                    ${data.email}
                  </a>
                </div>
              </div>
              <div class="divider"></div>
              <div class="field">
                <div class="field-label">Mensaje</div>
                <div class="message-box">
                  <div class="field-value">${data.message.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
            </div>
            <div class="footer">
              <p>Este mensaje fue enviado desde tu portafolio web</p>
              <p style="margin-top: 10px;">
                <strong>Juan Esteban López Moreno</strong> • Medellín, Colombia
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Nuevo mensaje de contacto
        
        Nombre: ${data.name}
        Email: ${data.email}
        
        Mensaje:
        ${data.message}
        
        ---
        Este mensaje fue enviado desde tu portafolio web
      `
    };

    // Enviar email
    await transporter.sendMail(mailOptions);

    // Respuesta exitosa
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Mensaje enviado exitosamente',
        success: true
      })
    };

  } catch (error) {
    console.error('Error al procesar el mensaje:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Error al enviar el mensaje. Por favor, intenta nuevamente.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};

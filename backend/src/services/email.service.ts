import "dotenv/config";
import nodemailer from "nodemailer";
import type { Request, User } from "@prisma/client";

const {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USER,
    MAIL_PASS,
    MAIL_FROM,
} = process.env;

if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS || !MAIL_FROM) {
    console.warn(
        "[email] Variables de entorno de correo incompletas. " +
        "El envío de notificaciones estará deshabilitado."
    );
}

const mailerEnabled =
    !!MAIL_HOST && !!MAIL_PORT && !!MAIL_USER && !!MAIL_PASS && !!MAIL_FROM;

const transporter = mailerEnabled
    ? nodemailer.createTransport({
        host: MAIL_HOST,
        port: Number(MAIL_PORT),
        secure: Number(MAIL_PORT) === 465,
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS,
        },
    })
    : null;

interface NewRequestNotificationParams {
    request: Request;
    applicant: User;
    responsible: User;
}

export async function sendNewRequestNotificationEmail(
    params: NewRequestNotificationParams
) {
    if (!mailerEnabled || !transporter) {
        console.info("[email] Notificación de nueva solicitud omitida (mailer deshabilitado)");
        return;
    }

    const { request, applicant, responsible } = params;

    const subject = `[${request.publicId}] Nueva solicitud de aprobación`;
    const text = `
Se ha creado una nueva solicitud que requiere tu atención.

ID público: ${request.publicId}
Título: ${request.title}
Tipo: ${request.type}
Estado actual: ${request.status}

Solicitante: ${applicant.displayName} (${applicant.username})
Responsable: ${responsible.displayName} (${responsible.username})

Descripción:
${request.description}

Por favor, ingresa a la aplicación de Flujo de Aprobaciones para revisarla.
`;

    const html = `
  <p>Se ha creado una nueva solicitud que requiere tu atención.</p>
  <ul>
    <li><strong>ID público:</strong> ${request.publicId}</li>
    <li><strong>Título:</strong> ${request.title}</li>
    <li><strong>Tipo:</strong> ${request.type}</li>
    <li><strong>Estado actual:</strong> ${request.status}</li>
    <li><strong>Solicitante:</strong> ${applicant.displayName} (${applicant.username})</li>
    <li><strong>Responsable:</strong> ${responsible.displayName} (${responsible.username})</li>
  </ul>
  <p><strong>Descripción:</strong></p>
  <p>${request.description}</p>
  <p>Por favor, ingresa a la aplicación de Flujo de Aprobaciones para revisarla.</p>
  `;

    try {
        await transporter.sendMail({
            from: MAIL_FROM,
            to: responsible.email,
            subject,
            text,
            html,
        });

        console.info(
            `[email] Notificación de nueva solicitud enviada a ${responsible.email}`
        );
    } catch (error) {
        console.error("[email] Error al enviar notificación de nueva solicitud:", error);
        // No rompemos la creación de la solicitud por fallo de email
    }
}

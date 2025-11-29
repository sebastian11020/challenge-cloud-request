import "dotenv/config";
import nodemailer from "nodemailer";
import type { Request, RequestType, User } from "@prisma/client";

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
    // Request puede venir con la relación requestType incluida o no
    request: Request & { requestType?: RequestType | null };
    applicant: User;
    responsible: User;
}

export async function sendNewRequestNotificationEmail(
    params: NewRequestNotificationParams
) {
    if (!mailerEnabled || !transporter) {
        console.info(
            "[email] Notificación de nueva solicitud omitida (mailer deshabilitado)"
        );
        return;
    }

    const { request, applicant, responsible } = params;

    const typeLabel = request.requestType
        ? `${request.requestType.name} (${request.requestType.code})`
        : `Tipo ID ${request.requestTypeId}`;

    const subject = `[${request.publicId}] Nueva solicitud de aprobación`;

    const text = `
Se ha creado una nueva solicitud que requiere tu atención.

ID público: ${request.publicId}
Título: ${request.title}
Tipo: ${typeLabel}
Estado actual: ${request.status}

Solicitante: ${applicant.displayName} (${applicant.username})
Responsable: ${responsible.displayName} (${responsible.username})

Descripción:
${request.description}

Por favor, ingresa a la aplicación de Flujo de Aprobaciones para revisarla.
`.trim();

    const html = `
  <p>Se ha creado una nueva solicitud que requiere tu atención.</p>
  <ul>
    <li><strong>ID público:</strong> ${request.publicId}</li>
    <li><strong>Título:</strong> ${request.title}</li>
    <li><strong>Tipo:</strong> ${typeLabel}</li>
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
        console.error(
            "[email] Error al enviar notificación de nueva solicitud:",
            error
        );
    }
}

interface StatusChangeNotificationParams {
    request: Request & { requestType?: RequestType | null };
    applicant: User;
    responsible: User;
    actorId: number;
    comment?: string;
}

export async function sendRequestStatusChangeEmail(
    params: StatusChangeNotificationParams
) {
    if (!mailerEnabled || !transporter) {
        console.info(
            "[email] Notificación de cambio de estado omitida (mailer deshabilitado)"
        );
        return;
    }

    const { request, applicant, responsible, actorId, comment } = params;

    const typeLabel = request.requestType
        ? `${request.requestType.name} (${request.requestType.code})`
        : `Tipo ID ${request.requestTypeId}`;

    const actorIsResponsible = actorId === responsible.id;
    const actorLabel = actorIsResponsible
        ? `${responsible.displayName} (responsable)`
        : `Usuario ${actorId}`;

    const subject = `[${request.publicId}] Solicitud ${request.status.toLowerCase()}`;

    const textBase = `
La siguiente solicitud ha cambiado de estado.

ID público: ${request.publicId}
Título: ${request.title}
Tipo: ${typeLabel}
Nuevo estado: ${request.status}

Solicitante: ${applicant.displayName} (${applicant.username})
Responsable: ${responsible.displayName} (${responsible.username})
Acción ejecutada por: ${actorLabel}
`.trim();

    const text =
        textBase +
        "\n\nComentario del aprobador:\n" +
        (comment && comment.trim().length > 0
            ? comment
            : "(Sin comentarios adicionales)") +
        "\n\nPor favor, ingresa a la aplicación de Flujo de Aprobaciones para ver más detalles.\n";

    const html = `
  <p>La siguiente solicitud ha cambiado de estado.</p>
  <ul>
    <li><strong>ID público:</strong> ${request.publicId}</li>
    <li><strong>Título:</strong> ${request.title}</li>
    <li><strong>Tipo:</strong> ${typeLabel}</li>
    <li><strong>Nuevo estado:</strong> ${request.status}</li>
    <li><strong>Solicitante:</strong> ${applicant.displayName} (${applicant.username})</li>
    <li><strong>Responsable:</strong> ${responsible.displayName} (${responsible.username})</li>
    <li><strong>Acción ejecutada por:</strong> ${actorLabel}</li>
  </ul>
  <p><strong>Comentario del aprobador:</strong></p>
  <p>${
        comment && comment.trim().length > 0
            ? comment
            : "<em>(Sin comentarios adicionales)</em>"
    }</p>
  <p>Por favor, ingresa a la aplicación de Flujo de Aprobaciones para ver más detalles.</p>
  `;

    try {
        await transporter.sendMail({
            from: MAIL_FROM,
            to: applicant.email,
            subject,
            text,
            html,
        });

        console.info(
            `[email] Notificación de cambio de estado enviada a ${applicant.email}`
        );
    } catch (error) {
        console.error(
            "[email] Error al enviar notificación de cambio de estado:",
            error
        );
    }
}

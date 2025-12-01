import "dotenv/config";
import nodemailer from "nodemailer";
import {
    buildNewRequestEmail,
    buildStatusChangeEmail,
    type StatusChangeTemplateParams,
    type BaseTemplateParams,
} from "./email.templates";

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
        secure: Number(MAIL_PORT) === 465, // 465 = SSL, 587 = STARTTLS
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS,
        },
    })
    : null;

if (mailerEnabled && transporter) {
    transporter
        .verify()
        .then(() => {
            console.info("[email] Transporter SMTP verificado correctamente");
        })
        .catch((err) => {
            console.error("[email] Error verificando transporter SMTP:", err);
        });
}

interface NewRequestNotificationParams extends BaseTemplateParams {}
interface StatusChangeNotificationParams extends StatusChangeTemplateParams {}

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

    console.info(
        `[email] Enviando notificación de NUEVA solicitud a ${responsible.email} (requestId=${request.publicId})`
    );

    const { subject, text, html } = buildNewRequestEmail({
        request,
        applicant,
        responsible,
    });

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

    console.info(
        `[email] Enviando notificación de CAMBIO DE ESTADO a ${applicant.email} (requestId=${request.publicId})`
    );

    const { subject, text, html } = buildStatusChangeEmail({
        request,
        applicant,
        responsible,
        actorId,
        comment,
    });

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

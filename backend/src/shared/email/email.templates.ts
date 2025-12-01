import type { Request, RequestType, User } from "@prisma/client";

export interface BaseTemplateParams {
    request: Request & { requestType?: RequestType | null };
    applicant: User;
    responsible: User;
}

export interface StatusChangeTemplateParams extends BaseTemplateParams {
    actorId: number;
    comment?: string;
}

const baseStyles = {
    body: `
    margin:0;
    padding:0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background-color:#f4f4f5;
  `,
    container: `
    max-width:600px;
    margin:0 auto;
    padding:24px 16px;
  `,
    card: `
    background-color:#ffffff;
    border-radius:12px;
    padding:24px 20px;
    box-shadow:0 10px 25px rgba(15,23,42,0.08);
  `,
    header: `
    font-size:20px;
    font-weight:600;
    margin:0 0 8px 0;
    color:#111827;
  `,
    badge: `
    display:inline-block;
    padding:4px 10px;
    border-radius:999px;
    font-size:11px;
    letter-spacing:0.04em;
    text-transform:uppercase;
    background-color:#eef2ff;
    color:#4f46e5;
  `,
    metaRowLabel: `
    font-size:12px;
    color:#6b7280;
    margin:0;
  `,
    metaRowValue: `
    font-size:14px;
    color:#111827;
    margin:2px 0 10px 0;
  `,
    sectionTitle: `
    font-size:13px;
    font-weight:600;
    margin:18px 0 6px 0;
    color:#374151;
    text-transform:uppercase;
    letter-spacing:0.05em;
  `,
    paragraph: `
    font-size:14px;
    line-height:1.6;
    color:#111827;
    margin:0 0 10px 0;
  `,
    footer: `
    font-size:12px;
    color:#9ca3af;
    margin-top:20px;
    text-align:center;
  `,
};

function renderLayout(contentHtml: string) {
    return `
  <html>
    <body style="${baseStyles.body}">
      <div style="${baseStyles.container}">
        <div style="${baseStyles.card}">
          ${contentHtml}
        </div>
        <p style="${baseStyles.footer}">
          Este es un mensaje automático del sistema de Flujo de Aprobaciones.<br/>
          Por favor, no respondas directamente a este correo.
        </p>
      </div>
    </body>
  </html>
  `;
}
export function buildNewRequestEmail(params: BaseTemplateParams) {
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

    const contentHtml = `
    <div style="margin-bottom:16px;">
      <span style="${baseStyles.badge}">Nueva solicitud</span>
    </div>
    <h1 style="${baseStyles.header}">${request.title}</h1>
    <p style="${baseStyles.metaRowLabel}">ID público</p>
    <p style="${baseStyles.metaRowValue}">${request.publicId}</p>
    <p style="${baseStyles.metaRowLabel}">Tipo de solicitud</p>
    <p style="${baseStyles.metaRowValue}">${typeLabel}</p>
    <p style="${baseStyles.metaRowLabel}">Estado actual</p>
    <p style="${baseStyles.metaRowValue}">${request.status}</p>

    <h2 style="${baseStyles.sectionTitle}">Participantes</h2>
    <p style="${baseStyles.metaRowLabel}">Solicitante</p>
    <p style="${baseStyles.metaRowValue}">
      ${applicant.displayName} (${applicant.username}) · ${applicant.email}
    </p>
    <p style="${baseStyles.metaRowLabel}">Responsable</p>
    <p style="${baseStyles.metaRowValue}">
      ${responsible.displayName} (${responsible.username}) · ${responsible.email}
    </p>

    <h2 style="${baseStyles.sectionTitle}">Descripción</h2>
    <p style="${baseStyles.paragraph}">
      ${request.description.replace(/\n/g, "<br/>")}
    </p>

    <h2 style="${baseStyles.sectionTitle}">Siguiente paso</h2>
    <p style="${baseStyles.paragraph}">
      Ingresa a la aplicación de Flujo de Aprobaciones para revisar los detalles,
      agregar comentarios o actualizar el estado de la solicitud.
    </p>
  `;

    const html = renderLayout(contentHtml);

    return { subject, text, html };
}

// 🔹 CAMBIO DE ESTADO
export function buildStatusChangeEmail(params: StatusChangeTemplateParams) {
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

    const contentHtml = `
    <div style="margin-bottom:16px;">
      <span style="${baseStyles.badge}">Cambio de estado</span>
    </div>
    <h1 style="${baseStyles.header}">${request.title}</h1>
    <p style="${baseStyles.metaRowLabel}">ID público</p>
    <p style="${baseStyles.metaRowValue}">${request.publicId}</p>
    <p style="${baseStyles.metaRowLabel}">Tipo de solicitud</p>
    <p style="${baseStyles.metaRowValue}">${typeLabel}</p>
    <p style="${baseStyles.metaRowLabel}">Nuevo estado</p>
    <p style="${baseStyles.metaRowValue}">${request.status}</p>

    <h2 style="${baseStyles.sectionTitle}">Participantes</h2>
    <p style="${baseStyles.metaRowLabel}">Solicitante</p>
    <p style="${baseStyles.metaRowValue}">
      ${applicant.displayName} (${applicant.username}) · ${applicant.email}
    </p>
    <p style="${baseStyles.metaRowLabel}">Responsable</p>
    <p style="${baseStyles.metaRowValue}">
      ${responsible.displayName} (${responsible.username}) · ${responsible.email}
    </p>
    <p style="${baseStyles.metaRowLabel}">Acción ejecutada por</p>
    <p style="${baseStyles.metaRowValue}">
      ${actorLabel}
    </p>

    <h2 style="${baseStyles.sectionTitle}">Comentario del aprobador</h2>
    <p style="${baseStyles.paragraph}">
      ${
        comment && comment.trim().length > 0
            ? comment.replace(/\n/g, "<br/>")
            : "<em>(Sin comentarios adicionales)</em>"
    }
    </p>

    <h2 style="${baseStyles.sectionTitle}">Siguiente paso</h2>
    <p style="${baseStyles.paragraph}">
      Ingresa a la aplicación de Flujo de Aprobaciones para consultar el historial
      completo de la solicitud y ver los detalles del cambio.
    </p>
  `;

    const html = renderLayout(contentHtml);

    return { subject, text, html };
}

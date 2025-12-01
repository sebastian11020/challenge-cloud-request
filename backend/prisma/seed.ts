import "dotenv/config";
import { PrismaClient, UserRole, RequestStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL no está definida en el entorno");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    const usersData: {
        username: string;
        email: string;
        displayName: string;
        role: UserRole;
    }[] = [
        {
            username: "sebastian.daza",
            email: "sebastiandaza792@gmail.com",
            displayName: "Sebastián Daza",
            role: UserRole.SOLICITANTE,
        },
        {
            username: "andrea.romero",
            email: "andrea.romero@empresa.com",
            displayName: "Andrea Romero",
            role: UserRole.SOLICITANTE,
        },
        {
            username: "carlos.aprobador",
            email: "sebastiandd87@gmail.com",
            displayName: "Carlos Pérez (Jefe de Área)",
            role: UserRole.APROBADOR,
        },
        {
            username: "laura.aprobadora",
            email: "laura.aprobadora@empresa.com",
            displayName: "Laura Gómez (Líder TI)",
            role: UserRole.APROBADOR,
        },
        {
            username: "admin.soporte",
            email: "admin.soporte@empresa.com",
            displayName: "Administrador Soporte",
            role: UserRole.ADMIN,
        },
    ];

    const requestTypesData = [
        {
            code: "ACCESO_SISTEMA",
            name: "Acceso a sistemas",
            description:
                "Creación o modificación de acceso a aplicaciones internas y sistemas corporativos.",
        },
        {
            code: "DESPLIEGUE_APP",
            name: "Despliegue de aplicación",
            description:
                "Despliegue de cambios en ambientes de desarrollo, QA o producción.",
        },
        {
            code: "VPN_REMOTO",
            name: "Acceso VPN remoto",
            description:
                "Solicitud de acceso remoto a la red corporativa mediante VPN.",
        },
        {
            code: "CAMBIO_ROL",
            name: "Cambio de rol / permisos",
            description:
                "Actualización de permisos según cambio de cargo o responsabilidades.",
        },
        {
            code: "INCIDENCIA",
            name: "Incidencia técnica",
            description: "Reporte de fallos o errores en sistemas o infraestructura.",
        },
        {
            code: "OTRO",
            name: "Otro",
            description: "Otros tipos de solicitud no categorizados.",
        },
    ];

    for (const data of requestTypesData) {
        await prisma.requestType.upsert({
            where: { code: data.code },
            update: {
                name: data.name,
                description: data.description,
                active: true,
            },
            create: data,
        });
    }

    console.log("✅ Tipos de solicitud sembrados correctamente");

    for (const data of usersData) {
        await prisma.user.upsert({
            where: { username: data.username },
            update: {
                email: data.email,
                displayName: data.displayName,
                role: data.role,
            },
            create: data,
        });
    }

    console.log("✅ Usuarios sembrados correctamente");
    const [tipoAcceso, tipoDespliegue, tipoVpn] = await Promise.all([
        prisma.requestType.findUnique({ where: { code: "ACCESO_SISTEMA" } }),
        prisma.requestType.findUnique({ where: { code: "DESPLIEGUE_APP" } }),
        prisma.requestType.findUnique({ where: { code: "VPN_REMOTO" } }),
    ]);

    const [sebastian, andrea, carlos, laura] = await Promise.all([
        prisma.user.findUnique({ where: { username: "sebastian.daza" } }),
        prisma.user.findUnique({ where: { username: "andrea.romero" } }),
        prisma.user.findUnique({ where: { username: "carlos.aprobador" } }),
        prisma.user.findUnique({ where: { username: "laura.aprobadora" } }),
    ]);

    if (!tipoAcceso || !tipoDespliegue || !tipoVpn) {
        throw new Error("Faltan tipos de solicitud al sembrar datos");
    }
    if (!sebastian || !andrea || !carlos || !laura) {
        throw new Error("Faltan usuarios al sembrar datos");
    }
    const requestsData = [
        {
            publicId: "REQ-20250001",
            title: "Acceso de lectura a ERP financiero",
            description:
                "El usuario requiere acceso de lectura al módulo de reportes del ERP financiero para consulta de indicadores.",
            status: RequestStatus.PENDIENTE,
            requestTypeId: tipoAcceso.id,
            applicantId: sebastian.id,
            responsibleId: carlos.id,
            history: [
                {
                    actorId: sebastian.id,
                    previousStatus: null,
                    newStatus: RequestStatus.PENDIENTE,
                    comment: "Solicitud creada según requerimiento del área contable.",
                },
            ],
        },
        {
            publicId: "REQ-20250002",
            title: "Despliegue de versión 1.3.0 del portal interno",
            description:
                "Se requiere despliegue de la versión 1.3.0 del portal interno en ambiente de producción, fuera de horario laboral.",
            status: RequestStatus.APROBADA,
            requestTypeId: tipoDespliegue.id,
            applicantId: andrea.id,
            responsibleId: laura.id,
            history: [
                {
                    actorId: andrea.id,
                    previousStatus: null,
                    newStatus: RequestStatus.PENDIENTE,
                    comment:
                        "Se adjuntó checklist de despliegue y validación de QA previa.",
                },
                {
                    actorId: laura.id,
                    previousStatus: RequestStatus.PENDIENTE,
                    newStatus: RequestStatus.APROBADA,
                    comment:
                        "Aprobado el despliegue. Ejecutar el cambio el sábado a las 20:00.",
                },
            ],
        },
        {
            publicId: "REQ-20250003",
            title: "Solicitud de acceso VPN para trabajo remoto",
            description:
                "El usuario requiere acceso VPN para conectarse a la red interna desde fuera de la oficina, 3 días a la semana.",
            status: RequestStatus.RECHAZADA,
            requestTypeId: tipoVpn.id,
            applicantId: sebastian.id,
            responsibleId: carlos.id,
            history: [
                {
                    actorId: sebastian.id,
                    previousStatus: null,
                    newStatus: RequestStatus.PENDIENTE,
                    comment:
                        "Trabajo remoto programado por proyecto con cliente externo.",
                },
                {
                    actorId: carlos.id,
                    previousStatus: RequestStatus.PENDIENTE,
                    newStatus: RequestStatus.RECHAZADA,
                    comment:
                        "Rechazado por falta de aprobación del área de Seguridad de la Información.",
                },
            ],
        },
    ] as const;

    for (const data of requestsData) {
        const existing = await prisma.request.findUnique({
            where: { publicId: data.publicId },
        });

        if (existing) {
            continue;
        }

        await prisma.request.create({
            data: {
                publicId: data.publicId,
                title: data.title,
                description: data.description,
                status: data.status,
                requestTypeId: data.requestTypeId,
                applicantId: data.applicantId,
                responsibleId: data.responsibleId,
                history: {
                    create: data.history.map((h) => ({
                        actorId: h.actorId,
                        previousStatus: h.previousStatus,
                        newStatus: h.newStatus,
                        comment: h.comment,
                    })),
                },
            },
        });
    }

    console.log("✅ Solicitudes de ejemplo sembradas correctamente");
}

main()
    .catch((e) => {
        console.error("❌ Error ejecutando seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        prisma.$disconnect();
    });

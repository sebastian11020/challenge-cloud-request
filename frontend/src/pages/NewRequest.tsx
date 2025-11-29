import {
    useEffect,
    useState,
    type FormEvent
} from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import type { RequestType } from "../types/requestType";
import type { User } from "../types/user";
import { RequestHeader} from "../components/new-request/RequestHeader.tsx";
import { SolicitorInfo } from "../components/new-request/SolicitorInfo";
import { RequestForm } from "../components/new-request/RequestForm";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

interface CreatedRequest {
    id: number;
    publicId: string;
}

export default function NewRequest() {
    const navigate = useNavigate();
    const { currentUser } = useUser();

    const [types, setTypes] = useState<RequestType[]>([]);
    const [approvers, setApprovers] = useState<User[]>([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requestTypeId, setRequestTypeId] = useState<number | "">("");
    const [responsibleId, setResponsibleId] = useState<number | "">("");
    const [comment, setComment] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setError(null);
                const [typesRes, usersRes] = await Promise.all([
                    fetch(`${API_URL}/api/request-types`),
                    fetch(`${API_URL}/api/users`)
                ]);

                const typesData = await typesRes.json();
                const usersData = await usersRes.json();

                setTypes(typesData.filter((t: RequestType) => t.active));
                setApprovers(usersData.filter((u: User) => u.role === "APROBADOR"));
            } catch {
                setError("Error al cargar catálogos.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!requestTypeId || !responsibleId) {
            setError("Debes seleccionar tipo y responsable.");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const payload = {
                title,
                description,
                requestTypeId: Number(requestTypeId),
                responsibleId: Number(responsibleId),
                applicantId: currentUser?.id,
                comment: comment.trim() || undefined
            };

            const res = await fetch(`${API_URL}/api/requests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Error al crear la solicitud");

            const data: CreatedRequest = await res.json();
            navigate(`/solicitudes/${data.id}`);
        } catch (err: any) {
            setError(err?.message || "Error al crear la solicitud.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!currentUser) return null;

    return (
        <div className="max-w-3xl mx-auto">
            <RequestHeader />
            <SolicitorInfo user={currentUser} />

            <RequestForm
                types={types}
                approvers={approvers}
                loading={loading}
                submitting={submitting}
                error={error}
                title={title}
                description={description}
                requestTypeId={requestTypeId}
                responsibleId={responsibleId}
                comment={comment}
                onSubmit={handleSubmit}
                onChangeTitle={setTitle}
                onChangeDescription={setDescription}
                onChangeType={setRequestTypeId}
                onChangeResponsible={setResponsibleId}
                onChangeComment={setComment}
            />
        </div>
    );
}

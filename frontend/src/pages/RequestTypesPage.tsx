import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useRequestTypes } from "../hooks/useRequestTypes";
import { RequestTypeList } from "../components/request-types/RequestTypeList";
import {
    createRequestType,
    updateRequestType,
    type CreateRequestTypeInput,
} from "../services/requestTypeService";
import {
    RequestTypeForm,
    type Mode,
    type RequestTypeFormState,
} from "../components/request-types/RequestTypeForm";
import type { RequestType } from "../types/requestType";

const emptyForm: RequestTypeFormState = {
    id: undefined,
    code: "",
    name: "",
    description: "",
    active: true,
};

export default function RequestTypesPage() {
    const { currentUser } = useUser();
    const { types, loading, error, reload } = useRequestTypes();

    const [mode, setMode] = useState<Mode>("create");
    const [form, setForm] = useState<RequestTypeFormState>(emptyForm);
    const [saving, setSaving] = useState(false);

    // Solo ADMIN puede acceder
    if (currentUser?.role !== "ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSelectForEdit = (type: RequestType) => {
        setMode("edit");
        setForm({
            id: type.id,
            code: type.code,
            name: type.name,
            description: type.description ?? "",
            active: type.active,
        });
    };

    const handleCancelEdit = () => {
        setMode("create");
        setForm(emptyForm);
    };

    const handleChangeField = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleToggleActive = (checked: boolean) => {
        setForm((prev) => ({
            ...prev,
            active: checked,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);

            if (mode === "create") {
                const payload: CreateRequestTypeInput = {
                    code: form.code.trim(),
                    name: form.name.trim(),
                    description: form.description.trim() || undefined,
                };
                await createRequestType(payload);
            } else if (mode === "edit" && form.id != null) {
                await updateRequestType(form.id, {
                    name: form.name.trim(),
                    description: form.description.trim() || undefined,
                    active: form.active,
                });
            }

            await reload();
            setMode("create");
            setForm(emptyForm);
        } catch (err: any) {
            console.error(err);
            alert(err?.message ?? "Ocurrió un error al guardar.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.6fr)]">
            <RequestTypeList
                types={types}
                loading={loading}
                error={error}
                onEdit={handleSelectForEdit}
            />

            <RequestTypeForm
                mode={mode}
                form={form}
                saving={saving}
                onChangeField={handleChangeField}
                onToggleActive={handleToggleActive}
                onSubmit={handleSubmit}
                onCancelEdit={handleCancelEdit}
            />
        </div>
    );
}

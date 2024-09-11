"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerDataInfo } from "../../page";
import { Input } from "@/components/input";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { z } from 'zod';

const schema = z.object({
    name: z.string().min(1, "O nome do chamado é obrigatório"),
    description: z.string().min(1, "Descreva um pouco sobre seu problema...")
})

type FormData = z.infer<typeof schema>

interface FormTicketProps {
    customer: CustomerDataInfo
}

export function FormTicket({ customer }: FormTicketProps) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    async function handleRegisterTicket(data: FormData) {
        const response = await api.post("/api/ticket", {
            name: data.name,
            description: data.description,
            customerId: customer.id
        })

        setValue("name", "")
        setValue("description", "")
    }

    return (
        <form className="bg-slate-200 mt-6 px-4 py-6 border-2 rounded" onSubmit={handleSubmit(handleRegisterTicket)}>
            <label className="mb-1 font-medium text-lg">Nome do Chamado</label>
            <Input
                placeholder="Digite o nome do chamado..."
                error={errors.name?.message}
                register={register}
                type="text"
                name="name"
            />

            <label className="mb-1 font-medium text-lg">Descreva o problema</label>
            <textarea
                className="w-full h-24 px-2 border-2 resize-none rounded-md"
                placeholder="Descreva o seu problema..."
                {...register("description")}
                id="description"
            >
            </textarea>
            {errors.description?.message && <p className="text-red-500 mt-1 mb-4">{errors.description?.message}</p>}

            <button className="bg-blue-500 text-white font-bold w-full h-11 px-2 rounded-md hover:bg-blue-600 duration-300" type="submit">
                Cadastrar
            </button>
        </form>
    )
}
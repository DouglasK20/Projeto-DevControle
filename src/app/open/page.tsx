"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormTicket } from "./components/FormTicket";
import { FiSearch, FiX } from "react-icons/fi";
import { Input } from "@/components/input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { api } from "@/lib/api";
import { z } from 'zod';

const schema = z.object({
    email: z.string().email("Digite o email do cliente para localizar.").min(1, "O campo email é obrigatório!")
})

type FormData = z.infer<typeof schema>

export interface CustomerDataInfo {
    id: string;
    name: string;
}

export default function OpenTicket() {
    const [customer, setCustomer] = useState<CustomerDataInfo | null>(null)

    const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    function handleClearCustomer() {
        setCustomer(null)
        setValue("email", "")
    }

    async function handleSearchCustomer(data: FormData) {
        const response = await api.get("/api/customer", {
            params: {
                email: data.email
            }
        })

        if (response.data === null) {
            setError("email", { type: "custom", message: "Ops, cliente não foi encontrado!" })
            return;
        }

        setCustomer({
            id: response.data.id,
            name: response.data.name
        })
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-2">
            <h1 className="font-bold text-3xl text-center mt-24">Abrir Chamado</h1>
            <main className="flex flex-col mt-4 mb-2">

                {customer ? (
                    <div className="bg-slate-200 py-6 px-2 border-2 flex items-center justify-between rounded">
                        <p className="text-lg"><strong>Cliente selecionado:</strong> {customer.name}</p>
                        <button className="h-11 px-2 flex items-center justify-center" onClick={handleClearCustomer}>
                            <FiX size={30} color="#ff2929" />
                        </button>
                    </div>
                ) : (
                    <form className="bg-slate-200 py-6 px-2 border-2 rounded" onSubmit={handleSubmit(handleSearchCustomer)}>
                        <div className="flex flex-col gap-3">
                            <Input
                                placeholder="Digite o email do cliente..."
                                error={errors.email?.message}
                                register={register}
                                name="email"
                                type="text"
                            />
                            <button className="bg-blue-500 text-white flex flex-row gap-3 px-2 h-11 items-center justify-center rounded hover:bg-blue-600 duration-300">
                                Procurar Cliente
                                <FiSearch size={24} color="#FFF" />
                            </button>
                        </div>
                    </form>
                )}

                {customer !== null && <FormTicket customer={customer} />}

            </main>
        </div>
    )
}
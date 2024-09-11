"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/input';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { z } from 'zod';

const schema = z.object({
    name: z.string().min(1, "O campo nome é obrigatório!"),
    email: z.string().email("Digite um email válido.").min(1, "O email é obrigatório!"),
    phone: z.string().refine((value) => {
        return /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) || /^\d{2}\s\d{9}$/.test(value) || /^\d{11}$/.test(value)
    }, {
        message: "O número de telefone deve estar (00) 987654321"
    }),
    address: z.string(),
})

type FormData = z.infer<typeof schema>

export function NewCustomerForm({ userId }: { userId: string }) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    const router = useRouter();

    async function handleRegisterCustomer(data: FormData) {
        await api.post("/api/customer", {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            userId: userId
        })

        router.refresh();
        router.replace("/dashboard/customer")
    }

    return (
        <form className='flex flex-col mt-6' onSubmit={handleSubmit(handleRegisterCustomer)}>
            <label className='mb-1 text-lg font-medium'>Nome Completo</label>
            <Input
                placeholder='Digite o nome completo'
                error={errors.name?.message}
                register={register}
                name='name'
                type='text'
            />

            <section className='flex flex-col gap-2 my-2 sm:flex-row'>
                <div className='flex-1'>
                    <label className='mb-1 text-lg font-medium'>Telefone</label>
                    <Input
                        placeholder='Exemplo (00) 987654321'
                        error={errors.phone?.message}
                        register={register}
                        name='phone'
                        type='text'
                    />
                </div>

                <div className='flex-1'>
                    <label className='mb-1 text-lg font-medium'>Email</label>
                    <Input
                        placeholder='Digite o email...'
                        error={errors.email?.message}
                        register={register}
                        name='email'
                        type='email'
                    />
                </div>
            </section>

            <label className='mb-1 text-lg font-medium'>Endereço Completo</label>
            <Input
                placeholder='Digite o endereço completo'
                error={errors.address?.message}
                register={register}
                name='address'
                type='text'
            />

            <button type='submit' className='bg-blue-500 text-white font-bold my-4 px-2 h-11 rounded hover:bg-blue-600 duration-300'>
                Cadastrar
            </button>
        </form>
    )
}
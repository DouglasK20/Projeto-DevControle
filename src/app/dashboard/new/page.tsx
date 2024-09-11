import { Container } from "@/components/container";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prismaClient from '@/lib/prisma';
import Link from "next/link";

export default async function NewTicket() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/");
    }

    const customers = await prismaClient.customer.findMany({
        where: {
            userId: session.user.id
        }
    })

    async function handleRegisterTicket(formData: FormData) {
        "use server"

        const name = formData.get("name")
        const description = formData.get("description")
        const customerId = formData.get("customer")

        if (!name || !description || !customerId) {
            return;
        }

        await prismaClient.ticket.create({
            data: {
                name: name as string,
                description: description as string,
                customerId: customerId as string,
                status: "ABERTO",
                userId: session?.user.id
            }
        })

        redirect("/dashboard")
    }

    return (
        <Container>
            <main className="mt-9 mb-2">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="bg-gray-900 text-white px-4 py-1 rounded">
                        Voltar
                    </Link>
                    <h1 className="text-3xl font-bold">Novo Chamado</h1>
                </div>

                <form className="flex flex-col mt-6" action={handleRegisterTicket}>
                    <label className="mb-1 font-medium text-lg">Nome do Chamado</label>
                    <input
                        className="w-full border-2 px-2 mb-2 rounded-md h-11"
                        placeholder="Digite o nome do chamado"
                        type="text"
                        name="name"
                        required
                    />

                    <label className="mb-1 font-medium text-lg">Descreva o Problema:</label>
                    <textarea
                        className="w-full border-2 px-2 mb-2 rounded-md h-24 resize-none"
                        placeholder="Descreva o problema..."
                        name="description"
                        required
                    ></textarea>

                    {customers.length !== 0 && (
                        <>
                            <label className="mb-1 font-medium text-lg">Selecione o Cliente</label>
                            <select className="w-full border-2 px-2 mb-2 rounded-md h-11 bg-white" name="customer">
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                                ))}
                            </select>
                        </>
                    )}

                    {customers.length === 0 && (
                        <Link href="/dashboard/customer/new">
                            Você ainda não tem nenhum cliente, <span className="text-blue-500 font-medium">Cadastrar Cliente</span>
                        </Link>
                    )}

                    <button
                        className='bg-blue-500 text-white font-bold my-4 px-2 h-11 rounded hover:bg-blue-600 duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed'
                        disabled={customers.length === 0}
                        type='submit'
                    >
                        Cadastrar
                    </button>

                </form>
            </main>
        </Container>
    )
}
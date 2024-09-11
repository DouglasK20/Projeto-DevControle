import { ButtonRefresh } from "./components/button";
import { Container } from "@/components/container";
import { TicketItem } from "./components/ticket";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prismaClient from '@/lib/prisma';
import Link from "next/link";


export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/")
    }

    const tickets = await prismaClient.ticket.findMany({
        where: {
            status: "ABERTO",
            customer: {
                userId: session.user.id
            }
        },
        include: {
            customer: true
        },
        orderBy: {
            created_at: "desc"
        }
    })

    return (
        <Container>
            <main className="mt-9 mb-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Chamados</h1>
                    <div className="flex items-center gap-3">
                        <ButtonRefresh />
                        <Link href="/dashboard/new" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 duration-300">
                            Abrir Chamado
                        </Link>
                    </div>
                </div>

                <table className="min-w-full my-3">
                    <thead className="bg-gray-700 text-white">
                        <tr>
                            <th className="font-medium text-left pl-1">CLIENTE</th>
                            <th className="font-medium text-left hidden sm:block">CADASTRO</th>
                            <th className="font-medium text-left">STATUS</th>
                            <th className="font-medium text-left">AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket => (
                            <TicketItem
                                key={ticket.id}
                                customer={ticket.customer}
                                ticket={ticket}
                            />
                        ))}
                    </tbody>
                </table>
                {tickets.length === 0 && (
                    <h1 className="text-gray-600 px-2">Nenhum ticket aberto foi encontrado...</h1>
                )}
            </main>
        </Container>
    )
}
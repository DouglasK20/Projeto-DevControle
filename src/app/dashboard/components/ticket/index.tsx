"use client";

import { FiCheckSquare, FiFileText } from "react-icons/fi";
import { CustomerProps } from "@/utils/customer.type";
import { TicketProps } from "@/utils/ticket.type";
import { ModalContext } from "@/providers/modal";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { api } from "@/lib/api";

interface TicketItemProps {
    ticket: TicketProps;
    customer: CustomerProps | null;
}

export function TicketItem({ customer, ticket }: TicketItemProps) {
    const { handleModalVisible, setDetailTicket } = useContext(ModalContext);
    const router = useRouter();

    async function handleChangeStatus() {
        try {
            const response = await api.patch("/api/ticket", {
                id: ticket.id
            })

            router.refresh();

        } catch (err) {
            console.log(err);
        }
    }

    function handleOpenModal() {
        handleModalVisible();
        setDetailTicket({
            customer: customer,
            ticket: ticket
        })
    }

    return (
        <>
            <tr className="border-b-2 border-b-slate-300 h-16 last:border-b-0 bg-slate-400 hover:bg-slate-300 duration-300">
                <td className="text-left pl-1">
                    {customer?.name}
                </td>
                <td className="text-left hidden sm:table-cell">
                    {ticket.created_at?.toLocaleDateString("pt-br")}
                </td>
                <td className="text-left">
                    <span className="bg-green-500 px-2 py-1 rounded">{ticket.status}</span>
                </td>
                <td className="text-left">
                    <button className="mr-3" onClick={handleChangeStatus}>
                        <FiCheckSquare size={24} color="#ff000099" />
                    </button>
                    <button onClick={handleOpenModal}>
                        <FiFileText size={24} color="#3b4ef6" />
                    </button>
                </td>
            </tr>
        </>
    )
}
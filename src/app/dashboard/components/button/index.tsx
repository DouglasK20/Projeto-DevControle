"use client";
import { FiRefreshCcw } from "react-icons/fi";
import { useRouter } from "next/navigation"

export function ButtonRefresh() {
    const router = useRouter();

    return (
        <button onClick={() => router.refresh()} className="bg-yellow-500 px-4 py-1 rounded hover:bg-yellow-600 duration-300">
            <FiRefreshCcw size={24} color="#FFF" />
        </button>
    )
}
import { DashboardHeader } from "./components/header";
import { ReactNode } from "react";


export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <DashboardHeader />
            {children}
        </>
    );
}
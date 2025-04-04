// import prisma from "@repo/db/client";
// import { AddMoney } from "../../../components/AddMoneyCard";
// import { BalanceCard } from "../../../components/BalanceCard";
// import { OnRampTransactions } from "../../../components/OnRampTransactions";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../lib/auth";

// async function getBalance() {
//     const session = await getServerSession(authOptions);
//     const balance = await prisma.balance.findFirst({
//         where: {
//             userId: Number(session?.user?.id)
//         }
//     });
//     return {
//         amount: balance?.amount || 0,
//         locked: balance?.locked || 0
//     }
// }

// async function getOnRampTransactions() {
//     const session = await getServerSession(authOptions);
//     const txns = await prisma.onRampTransaction.findMany({
//         where: {
//             userId: Number(session?.user?.id)
//         }
//     });
//     return txns.map(t => ({
//         time: t.startTime,
//         amount: t.amount,
//         status: t.status,
//         provider: t.provider
//     }))
// }

// export default async function() {
//     const balance = await getBalance();
//     const transactions = await getOnRampTransactions();

//     return <div className="w-screen">
//         hi
//         <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
//             Transfer
//         </div>
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
//             <div>
//                 <AddMoney />
//             </div>
//             <div>
//                 <BalanceCard amount={balance.amount} locked={balance.locked} />
//                 <div className="pt-4">
//                     <OnRampTransactions transactions={transactions} />
//                 </div>
//             </div>
//         </div>
//     </div>
// }


import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

// Define TypeScript interfaces
interface Balance {
    amount: number;
    locked: number;
}





interface OnRampTransaction {
    time: Date; // Renamed from startTime to time
    amount: number;
    status: string;
    provider: string;
}

async function getBalance(): Promise<Balance> {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
        return { amount: 0, locked: 0 }; // Handle case where user is not logged in
    }

    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session.user.id),
        },
    });

    return {
        amount: balance?.amount ?? 0,
        locked: balance?.locked ?? 0,
    };
}

async function getOnRampTransactions(): Promise<OnRampTransaction[]> {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
        return []; // Return empty array if no user session
    }

    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session.user.id),
        },
    });

    return txns.map((t) => ({
        time: new Date(t.startTime), // Renamed from startTime to time
        amount: t.amount,
        status: t.status,
        provider: t.provider,
    }));
}

export default async function TransferPage() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();

    return (
        <div className="w-screen">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                Transfer
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
                <div>
                    <AddMoney />
                </div>
                <div>
                    <BalanceCard amount={balance.amount} locked={balance.locked} />
                    <div className="pt-4">
                        <OnRampTransactions transactions={transactions || []} />
                    </div>
                </div>
            </div>
        </div>
    );
}

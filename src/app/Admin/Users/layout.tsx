'use client'
import userInfo from "@/mocks/UserInfo"
import parkingSlots from "@/mocks/ParkingSlots"
import { Children } from "react";
import Link from "next/link";
import client from "@/apolloclient";
import { gql } from "@apollo/client";
import { useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    tipoUser: boolean;
    carId: number;
}

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    const usersInfo = userInfo;
    const carInfo = parkingSlots;
    const [users, setUsers] = useState<User[]>([]);
    const usersWithCars = usersInfo.map((user) => {
        const car = carInfo.find((car) => car.id === user.carId);
        return { ...user, car };
    });

    const fetchUsers = async () => {
        try {
            const result = await client.query({
                query: gql`
                query {
                    getUsers{
                      users{
                        id
                        email
                        name
                        password
                        tipoUser
                      }
                    }
                  }
                `
            });
            setUsers(result.data.getUsers.users);
            console.log(result.data.getUsers.users);
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        fetchUsers();
    }, []);

    return(
        <main>
            
            <h1 className="text-4xl font-bold">Users</h1>
        <div className="text-black h-[90%] flex items-center justify-between gap-4">
            {/* tabla usuarios */}
            <div className="my-10 bg-white h-[80vh] w-[30%]  overflow-scroll border-2 border-black">
                <table className="justify-between w-[100%] p-2  ">
                    <thead className="h-12 bg-yellow-500 ">
                        <tr>
                        <th>Nombre</th>
                        <th className="w-32">Reservas</th>
                        </tr>
                    </thead>
                    <tbody>

                {
                    users.map((user)=> (

                            user.tipoUser == false &&

                            <tr className="text-center h-10 border-b-2 border-black hover:bg-slate-200 transition-all" key={user.id}>

                            <td> {user.name}</td>
                            <td>
                                <Link href={`/Admin/Users/${user.id}`}>
                                    <p className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        Detalles
                                    </p>
                                </Link>
                            </td>
                        </tr>
                           
                        ))
                    }
                    </tbody>
                    </table>
            </div>
            <div className="w-[50%] h-[85%]">
                {children}
            </div>
        </div>

        </main>
    )
}
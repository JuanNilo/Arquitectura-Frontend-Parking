'use client'
import Link from "next/link"
import { use, useEffect, useState } from "react";
import { gql } from "@apollo/client";
import client from "@/apolloclient";


interface Reserva {
    id: number,
    fecha_inicio: string,
    hora_inicio: string,
    fecha_fin: string,
    hora_fin: string,
    patente: string,
    idZona: number,
    idUsuario: number
}

interface Zona {
    id: number;
    name: string;
    cantEstacionamientosTotales: number;
    cantEstacionamientosOcupados: number;
}

interface Booking {
    id: number;
    dateHourStart: string;
    dateHourFinish: string;
    status: string;
    patente: string;
    zone: Zona;
}

export default function ListaReservas({id} : {id: number}) {
    const [bookings, setBookings] = useState<Booking[]>([] || null);
    
    const fetchBookings = async () => {
        try {
            const result = await client.query({
                query: gql`
                query {
                    findAllBookingsByUser(
                      id: ${id}
                    ){
                      bookings{
                        id
                        dateHourStart
                        dateHourFinish
                        patente
                        status
                        zone{
                          id
                          name
                        }
                      }
                    }
                  }
                `
            });
            setBookings(result.data.findAllBookingsByUser.bookings);
        }
        catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        fetchBookings();
    }
    , []);

    return (
        <section className="w-[100%] mt-4 ">
            <h2 className="text-3xl">Mis reservas:</h2>
            <table className=" w-[100%] h-[50vh] bg-white overflow-scroll rounded-lg">
                <thead className="bg-yellow-500 h-12">
                    <tr>
                        <th>Patente</th>
                        <th>Fecha inicio</th>
                        <th>Hora inicio</th>
                        <th>Zona</th>
                        <th>Estado</th>
                        <th>Accion</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        bookings.length == 0 ? <tr className='border-b-2 text-center'><td colSpan={5}>No hay reservas</td></tr> :
                    
                    bookings.map((reserva) => {
                        const date = new Date(reserva.dateHourStart);
                        const fechaInicio = date.toLocaleDateString();
                        const horaInicio = date.toLocaleTimeString();
                        return (
                            <tr key={reserva.id} className="text-center max-h-14 ">
                                <td>{reserva.patente}</td>
                                <td>{fechaInicio}</td>
                                <td>{horaInicio}</td>
                                <td>{reserva.zone?.name}</td>
                                <td>{reserva.status}</td>
                                <td>
                                            <Link href={`/Checkout/${reserva.id}`} 
                                             className={`bg-blue-500 text-white p-2 rounded-lg font-bold`}>CheckOut</Link>
                                 </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>
    )
}
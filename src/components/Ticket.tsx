'use client'
import Image from "next/image"
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from 'axios';

interface ticketProps {
    idCar: number,
    llegada: string,
    salida: string,
    patente: string
}

interface Booking {
    id: number;
    dateHourStart: string;
    dateHourFinish: string;
    status: string;
    patente: string;
    zone: {
        id: number;
        name: string;
    }
}
export default function Ticket({ booking }: { booking: Booking | undefined }) {
    
    let patente, hourStart,dateStart, dateHourFinish, zone;

    if (booking) {
        patente = booking.patente;
        hourStart = new Date(booking.dateHourStart).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        dateStart = new Date(booking.dateHourStart).toLocaleDateString('es-CL');
        dateHourFinish = booking.dateHourFinish;
        zone = booking.zone;
    }
    
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        axios.get('http://worldtimeapi.org/api/timezone/America/Santiago')
            .then(response => {
                const datetime = new Date(response.data.datetime);
                console.log(datetime)
                const time = datetime.getHours() + ':' + datetime.getMinutes();
                setCurrentTime(time);
            })
            .catch(error => console.error('Error fetching time: ', error));
    }, []);
    return (
        <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: 4 }}>
            {/* arrow up */}
            <div className='flex justify-center h-[10%] pb-4'>
                <Image src={'/arrow.png'} alt='arrowUp' height={30} width={80} />
            </div>
            {/* Datos del ticket */}
            <div className=' text-center text-xl text-black'>
                <div className=" border-b-2 border-black border-t-2 my-2">
                    <p className='text-2xl font-bold'>Ticket de parking!</p>

                </div>
                {/* Date */}
                <p className=''>{dateStart ? dateStart : "cargando..."}</p>
                {hourStart ? (<p>Llegada: {hourStart}</p>) : (<p>Llegada: esperando...</p>)}
                {currentTime != '' ? (<p>Salida: {currentTime}</p>) : (<p>Salida: esperando...</p>)}

            </div>
            {/* Patente */}
            <div className="flex justify-center">
                {/* <div className="bg-white p-2 text-black text-center text-2xl font-bold w-[30%] border-black border-4 rounded-xl"> */}
                <div className="bg-white p-2 text-black mx-auto text-center text-2xl font-bold w-36 border-black border-4 rounded-xl">
                    {patente ? (<p>{patente}</p>) : (<p>XXXX99</p>)}
                </div>
            </div>
            {/* <h1 className='text-5xl text-center font-bold text-black pt-4'>Parking ticket</h1> */}

            {/* Qr */}
            <section className=' flex justify-center items-center h-36 mb-4'>
                <Image className='rounded-xl' src={'/Barcode.png'} height={150} width={150} alt='codigo qr' />
            </section>
            {/* Botones */}
            <div className='flex justify-center gap-4'>
                <Link href={`/Admin/Payment`} className=' text-2xl font-bold p-2 rounded-lg'>Pagar</Link>
                <button className=' text-2xl font-bold p-2 rounded-lg'>Cancelar</button>
            </div>
        </div>
    )
}
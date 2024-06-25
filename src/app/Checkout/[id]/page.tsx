'use client'
import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import client from "@/apolloclient";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";

import { useUserStore } from "@/store/UserStorage";
import {useRouter}  from "next/navigation";
interface Params {
    id: number;
}

interface CheckOut {
    success: boolean;
    message: string;
    booking: {
        id: number;
        dateHourStart: string;
        dateHourFinish: string;
        status: string;
        patente: string;
        amount: number;
        zone: {
            id: number;
            name: string;
        }
    }
}

interface Booking {
    id: number;
    dateHourStart: string;
    dateHourFinish: string;
    status: string;
    patente: string;
    amount: number;
    zone: {
        id: number;
        name: string;
    }
}

export default function CheckoutPage({ params }: { params: Params }) {
    // hora actual chile
    const router = useRouter()
    const date = new Date();
    const { id } = params;
    const [booking, setBooking] = useState<Booking | undefined>();
    const { amount, setAmount } = useUserStore();
    const [dateHourFinish, setDateHourFinish] = useState<string>(date.toISOString());
    const [canPay, setCanPay] = useState<boolean>(false);

    const dateHourStartBooking = new Date(booking?.dateHourStart || Date.now());
    const dateStart = dateHourStartBooking.toDateString().substring(4);
    const hourStart = dateHourStartBooking.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const dateCheckOut = new Date(dateHourFinish);
    const dateFinish = dateCheckOut.toDateString().substring(4);
    const hourFinish = dateCheckOut.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const fetchBookings = async () => {
        try {
            const result = await client.query({
                query: gql`
                query {
                    findOneBooking (id: ${id}) {
                        id
                        dateHourStart
                        dateHourFinish
                        status
                        idZone
                        patente
                        idUser
                        zone {
                            id
                            name
                        }
                    }
                }
                `
            });
            setBooking(result.data.findOneBooking);
            console.log(result.data.findOneBooking);

            if (result.data.findOneBooking.status === 'finished') {
                setCanPay(false);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleFinish = () => {
        console.log(canPay);
        console.log("pagando");
    }

    const fetchConfirm = async () => {
        try {
            const result = await client.mutate({
                mutation: gql`
                mutation{
                    confirmBooking(
                      id: ${id}
                    ){
                      success
                      message
                    }
                  }
                `
            });
            console.log(result.data.confirmBooking.success);
            if(result.data.confirmBooking.success){
                router.push('/')
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const fetchCheckouts = async () => {
        try {
            const hourFinishWithoutZ = dateHourFinish.substring(0, 19); // Ajuste de la hora final sin 'Z'
            console.log("Hora final", hourFinishWithoutZ);
            const result = await client.mutate({
                mutation: gql`
                mutation {
                    checkOutBooking(id: ${id}, dateHourFinish: "${hourFinishWithoutZ}") {
                        success
                        message
                        booking {
                            id
                            dateHourStart
                            dateHourFinish
                            status
                            patente
                            amount
                            zone {
                                id
                                name
                            }
                        }
                    }
                }
                `
            });

            if (result.data.checkOutBooking.success) {
                setCanPay(true);

                setAmount(result.data.checkOutBooking.booking.amount);
                console.log("monto", amount)
            } else {
                setCanPay(false);
            }

            console.log(result.data.checkOutBooking);

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div className="flex justify-center items-center h-[90vh]">
            <main className="bg-slate-200 h-[80vh] w-[60%] rounded-lg">
                <div className="flex h-[100%] justify-between">
                    {/* Resumen de parking */}
                    <div className="py-4 m-auto p-4 rounded-md border-[1px] border-black w-[40%] bg-white h-[50vh]">
                        <h2 className="mt-2 mb-6 font-bold text-2xl">Resumen de reserva</h2>
                        <div className="grid grid-cols-2 py-4 border-b-[1px] border-gray-600 mx-auto">
                            <p>Patente:</p>
                            <p>{booking?.patente}</p>
                            <p>Zona:</p>
                            <p>{booking?.zone.name}</p>
                            <p>Hora llegada:</p>
                            <p>{hourStart}</p>
                            <p>Fecha llegada:</p>
                            <p>{dateStart}</p>
                            <p>Estado:</p>
                            <p>{booking?.status}</p>
                        </div>
                        <button disabled={booking?.status === 'finished'} onClick={fetchCheckouts} className="bg-blue-500 hover:bg-blue-700 w-[100%] text-white font-bold py-2 px-4 rounded">
                            CheckOut
                        </button>
                        <p className="font-bold text-sm my-2">Presione el botón CheckOut para calcular el monto</p>
                    </div>
                    {/* Resumen de cobro */}
                    <div className="w-[40%] border-[1px] bg-white border-black shadow-md h-[50vh] py-4 m-auto p-4 rounded-lg">
                        <h2 className="mt-2 mb-6 font-bold text-2xl">Resumen de cobro</h2>
                        <div className="flex justify-between py-4 border-b-[1px] border-gray-600 mx-auto">
                            <p>Fecha y hora:</p>
                            <p>{hourFinish} - {dateFinish}</p>
                        </div>
                        <div className="flex justify-between flex-col-2 py-4">
                            <p>Tarifa por media hora:</p>
                            <p>$1000</p>
                        </div>
                        <div className="flex justify-between flex-col-2 py-4">
                            <p>Total a pagar:</p>
                            <p>${amount}</p>
                        </div>

                        <PayPalScriptProvider options={{ "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'default_client_id' }}>
                            <PayPalButtons
                                style={{ color: "blue", shape: "rect", label: "pay", layout: "horizontal" }}
                                disabled={!canPay}
                                createOrder={async () => {
                                    console.log("monto", amount)
                                    const result = await fetch("/api/checkout", {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ amount }) // Envía el amount en el cuerpo de la solicitud
                                    });
                                    const order = await result.json();
                                    console.log(order);
                                    return order.id;
                                }}
                                onApprove={async (data, actions) => {
                                    console.log("aprobado")
                                    fetchConfirm();

                                    if (actions.order) {
                                        const order = await actions.order.capture();
                                        handleFinish();
                                    }
                                }}
                                onCancel={(data) => {
                                    console.log(data);
                                }}
                            />
                        </PayPalScriptProvider>
                    </div>
                </div>
            </main>
        </div>
    );
}

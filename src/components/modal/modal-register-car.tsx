"use client";
import axios from 'axios';
import React, { use, useEffect, useState } from 'react';
import { BsFillBackspaceFill } from "react-icons/bs";
import { useUserStore } from '@/store/UserStorage';

import { useRouter } from 'next/navigation'
import client from '@/apolloclient';
import { gql } from '@apollo/client';

interface ModalLoginProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Zona {
    id: number;
    name: string;
    cantEstacionamientosTotales: number;
    cantEstacionamientosOcupados: number;
}

const ModalRegisterCar: React.FC<ModalLoginProps> = ({ isOpen, onClose }) => {
    const router = useRouter()

    const { id_user, token } = useUserStore();
    const [patente, setPatente] = useState<string>('');
    const [dateHourStart, setDateHourStart] = useState<string>('');
    const [selectedZone, setSelectedZone] = useState<Zona | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleClose = () => {
        onClose();
    };

    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        fetchZones();
        fetchDate();
    }, []);

    const fetchDate = async () => {
        axios.get('http://worldtimeapi.org/api/timezone/America/Santiago')
            .then(response => {
                const datetime = new Date(response.data.datetime);
                const isoString = datetime.toISOString();
                const formattedDate = isoString.slice(0, isoString.indexOf('.')); // remove seconds and milliseconds
                // const formattedDateWithoutZ = formattedDate.slice(0, formattedDate.length - 1); 
                setDateHourStart(formattedDate);
                const time =  datetime.getDate() + '/' + (datetime.getMonth() + 1) + '/' + datetime.getFullYear() + ' - ' + datetime.getHours() + ':' + datetime.getMinutes() ;
                setCurrentTime(time);
            })
            .catch(error => console.error('Error fetching time: ', error));
    }
    const fetchCreateBooking = async (dateHourStart: string, patente: string) => {
        setLoading(true);
        setIsError(false);
        const idUser = id_user;
        const idZone = selectedZone?.id;
        console.log(dateHourStart, patente, idZone, idUser);
        try {
            const result = await client.mutate({
                mutation: gql`
                mutation {
                    createBooking(createBookingInput:{
                      dateHourStart: "${dateHourStart}",
                      patente: "${patente}",
                      idZone: ${idZone},
                      idUser: ${idUser}
                    }){
                      success
                    }
                  }
                `
            });

            console.log(result.data.createBooking.success);
            if (result.data.createBooking.success) {
                setLoading(false);
                onClose();
                router.refresh();
            }
            else {
                setLoading(false);
                setIsError(true);
                setErrorMessage("Error al crear reserva, intente de nuevo.");
            }
        }
        catch (error) {
            setLoading(false);
            setIsError(true);
            setErrorMessage("Error al crear reserva, intente de nuevo.");
            console.log("Error: ", error);
        };
    };

    const [zonas, setZonas] = useState<Zona[]>([]);

    const fetchZones = async () => {
        try {
            const result = await client.query({
                query: gql`
          query{
            findAllZones{
              zones {
                id
                name
                cantEstacionamientosTotales
                cantEstacionamientosOcupados
              }
            }
          }
          `
            });
            setZonas(result.data.findAllZones.zones);
            console.log(result.data.findAllZones.zones);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-20 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none">
                    <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"></div>
                    <div className="relative z-30 h-[90%] w-[60%] p-4 mx-auto bg-black bg-opacity-50 rounded-md shadow-lg flex items-center justify-center">
                        <div className="absolute inset-0 bg-cover blur-sm bg-center  z-10" style={{ backgroundImage: "url('/background-register.jpg')" }}></div>
                        <div className="relative z-20 w-[50%] p-10 ">
                            <div className="flex justify-end">
                                <button onClick={handleClose}>
                                    <BsFillBackspaceFill size={35} color='white' />
                                </button>
                            </div>
                            <div className="flex flex-col justify-center my-auto items-center">
                                <div className='text-white font-bold text-5xl flex items-center text'
                                    style={{ textShadow: '4px 4px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000' }}>
                                    Registrar auto
                                </div>
                                <input
                                    type="text"
                                    placeholder="Patente"
                                    maxLength={6}
                                    className="p-2 mx-5 my-2 border border-gray-300 rounded-md text-black font-semibold w-full"
                                    onChange={(event) => setPatente(event.target.value)} />

                                {/* Input de horas */}
                                <input type="text" disabled={false} id="llegada" name="llegada" min="06:00" max="20:00"
                                    className="p-2 mx-5 my-2 border border-gray-300 rounded-md  font-semibold w-full text-gray-500" placeholder={'2024-06-12T09:00:00'} value={dateHourStart} />
                                {/* selector de zona 1, zona 2 y zona 3 */}
                                <select className='bg-white w-42 h-10 rounded-lg' onChange={(e) => {
                                    const selectedId = parseInt(e.target.value);
                                    const selectedZone = zonas.find((z) => z.id === selectedId);
                                    setSelectedZone(selectedZone || null);
                                }
                                }>
                                    <option value="">Seleccione una zona</option>
                                    {zonas.map((zona) => (
                                        <option key={zona.id} value={zona.id}>
                                            {zona.name}
                                        </option>
                                    ))}
                                </select>

                                <button disabled={loading} className="bg-yellow-500 text-black p-2 m-2 rounded-md w-full font-bold" onClick={() => fetchCreateBooking(dateHourStart, patente)}>{loading ? 'Cargando...' : 'Registrar auto'}</button>
                                {isError && (
                                    <div className="flex justify-center items-center h-12 text-red-500 font-bold">
                                        {errorMessage}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ModalRegisterCar;
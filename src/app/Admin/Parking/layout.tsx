'use client'
import CarDark from '@/components/Car-Dark';
import ModalCreateZone from '@/components/modal/modal-create-zone';
import ModalRegisterCar from '@/components/modal/modal-register-car';
import parkingSlots from '@/mocks/ParkingSlots';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaPlus, FaPlusCircle } from 'react-icons/fa';
import client from '@/apolloclient';
import { gql } from '@apollo/client';
interface Zona
{
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

export default function LayoutCarDetails({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenZone, setModalOpenZone] = useState(false);

  const [selectedZone, setSelectedZone] = useState<Zona | null>(null);
  const closeModalLogin = () => {
    setModalOpen(false);
}

  const closeModalZone = () => {
    setModalOpenZone(false);
  }


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

  const fetchBooking = async () => {
    try {
      const result = await client.query({
        query: gql`
        query {
          findAllBookings{
            bookings{
              id
              dateHourStart
              dateHourFinish
              status
              patente
              zone {
                id
                name
              }
            }
          }
        }        
        `
      });
      console.log(result.data.findAllBookings.bookings);
      setBookings(result.data.findAllBookings.bookings);
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchZones();
    fetchBooking();
  }
  , []);


  return (
    <main className='w-[100%] flex gap-10'> 
       <ModalRegisterCar isOpen={modalOpen} onClose={closeModalLogin} />
      <ModalCreateZone isOpen={modalOpenZone} onClose={closeModalZone} />
      <aside className='w-[70%] h-[100%]'>
        <h1 className=" text-5xl font-bold text-black">Parking Slots</h1>
        {/* Sector de autos */}
        {/* Zonas de parking */}
        <div className='flex justify-between items-center mt-4'>
          <div className="flex flex-row gap-2">
            {/* selector de zona */}
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
            
          </div>
            { selectedZone?.id ? null : (<p className='font-bold'>Seleccione una zona para ver la info.</p>)}
        </div>
        <div className=' flex gap-x-4 my-4 justify-between'>
          <div className='rounded-lg  hover:cursor-pointer  transform transition-transform duration-500 hover:scale-110  border-2 bg-white border-gray-500 shadow-md h-24 w-48  flex flex-col items-center justify-center' >
            <p className='text-4xl font-bold'> {selectedZone?.cantEstacionamientosTotales || "-"}</p>
            <p>Espacios totales</p>
          </div>
          <div className='rounded-lg  hover:cursor-pointer  transform transition-transform duration-500 hover:scale-110  border-2 bg-white border-gray-500 shadow-md h-24 w-48  flex flex-col items-center justify-center' >
            <p className='text-4xl font-bold'> {selectedZone?.cantEstacionamientosOcupados || '-'}</p>
            <p>Espacios ocupados</p>
          </div>
          <button onClick={()=> {setModalOpenZone(!modalOpenZone)}} className='rounded-lg  hover:cursor-pointer  transform transition-transform duration-500 hover:scale-110  border-2 bg-white border-gray-500 shadow-md h-24 w-48  flex flex-col items-center justify-center' >
            <FaPlus size={45} />
            <p>Crear zona</p>
          </button>
        </div>
        <div className='h-[60vh] overflow-scroll bg-white p-4 rounded-lg border-2 border-gray-500'>

       <table className='w-full'>
          <thead className='bg-gray-100 p-2 rounded-md'>
            <tr>
              <th>Patente</th>
              <th>Llegada</th>
              <th>Estado</th>
              <th className=' w-[20%]'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            { selectedZone == null ? 
              (
                <tr className='border-b-2 text-center'>
                  <td colSpan={4}>Seleccione una zona para ver los detalles.</td>
                </tr>
              )
            :
            (

              bookings.map((booking, index) => {
                const date = new Date(booking.dateHourStart);
                const fechaInicio = date.toLocaleDateString();
                const horaInicio = date.toLocaleTimeString();

               
                return (
                  
                   booking.zone.id == selectedZone.id  && <tr key={index} className='border-b-2 text-center'>
                      <td>{booking.status ? <p>{booking.patente}</p> : <p>-----------</p>}</td>
                      <td>{booking.status ? <p>{fechaInicio} - {horaInicio}</p> : <p>-----------</p>}</td>
                      <td>{booking.status ? <p>Ocupado</p> : <p>Disponible</p>}</td>
                      <td> 
                        <Link href={`/Admin/Parking/${booking.id}`}>
                          <p className='bg-yellow-500 p-2 text-white rounded-lg'>Ver Detalles</p>
                        </Link>
                      </td>
                      </tr>
                )
              })
            )
            }
          </tbody>
        </table>
        </div>
      </aside>
      <section>
      <div className=' w-80 rounded-xl my-10 bg-white h-[80vh] shadow-lg p-2'>
            {children}
          </div>
      </section>
    </main>
  );
}
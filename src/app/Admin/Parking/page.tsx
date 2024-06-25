import CarDark from '@/components/Car-Dark';
import Ticket from '@/components/Ticket';
import parkingSlots from '@/mocks/ParkingSlots';
import Image from 'next/image';

export default function Parking(){
    const slots = parkingSlots;
    const booking = {
        id: 1,
        dateHourStart: "2023-09-01T00:00:00.000Z",
        dateHourFinish: "2023-09-01T00:00:00.000Z",
        status: "active",
        patente: "XXXX99",
        zone: {
            id: 1,
            name: "Zona 1"
        }
    }

    return (
     <main>
        <Ticket booking={booking} />
     </main>
    )
}
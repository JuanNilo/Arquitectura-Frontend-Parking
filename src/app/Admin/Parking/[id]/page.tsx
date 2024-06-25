'use client'
import Ticket from "@/components/Ticket";
import parkingSlots from "@/mocks/ParkingSlots";
import { useEffect } from "react";
import { useState } from "react";
import { gql } from "@apollo/client";
import client from "@/apolloclient";
//@ts-ignore

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

interface Params {
    id: number;
}
export default function CarDetails({params} : {params: Params}){
    const {id} = params;
    const [booking, setBooking] = useState<Booking | undefined>();
    const fetchBookings = async () => {
        try {
            const result = await client.query({
                query: gql`
                query {
                    findOneBooking (
                      id: ${id}
                    ){
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
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchBookings();
    }
    , []);

    return(
        <div>  
            
            <Ticket booking={booking}/>
        </div>
    )
}
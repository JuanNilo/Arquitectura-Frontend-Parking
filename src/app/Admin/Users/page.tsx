'use client'
import ListaReservas from '@/components/user/ListaReservas';
import { useParams } from 'next/navigation';
import React from 'react';

interface Params {
    id: number;
}

export default function page ({params}: {params: Params}) {
    const {id} = params;
    return(
        <ListaReservas id={ 0 } />
    )
}

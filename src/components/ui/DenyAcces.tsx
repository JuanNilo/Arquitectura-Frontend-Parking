import { FaUserLock } from "react-icons/fa";
import CardOption from "./Card-Option";


export default function DenyAcces(){
    return(
        <div className="flex h-[60vh]  justify-center items-center">
        <CardOption title="Acceso denegado" description="Presione aqui para volver al inicio. " path={'/'} icon={<FaUserLock size={34}/>} />
    </div>
    )
}
import Link from "next/link";


export default function CardOption({title, description, icon, path}:{title:string, description:string, icon:any, path:string}){
    return(
        <Link href={path} className="w-[35%] h-[30vh] bg-white  hover:cursor-pointer  transform transition-transform duration-500 hover:scale-110 flex flex-col justify-center
         mx-auto items-center  rounded-lg drop-shadow-lg text-center gap-y-5">
            <div className="flex justify-center items-center scale-150">
                {icon}
            </div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p>{description}</p>
        </Link>
    )
}
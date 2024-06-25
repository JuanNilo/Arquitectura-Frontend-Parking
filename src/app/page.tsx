'use client';
import ModalLogin from "@/components/login/modal-login";
import NavBar from "@/components/ui/NavBar";
import ListaReservas from "@/components/user/ListaReservas";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useUserStore } from "@/store/UserStorage";
import ModalRegisterCar from "@/components/modal/modal-register-car";

export default function Home() {

  const { id_user, tipoUser } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  const hanldeCloseModal = () => {
    setIsOpen(false);
  }
  console.log(id_user)
  return (
    <div className="h-[100%]">
      <NavBar />
      <main
        className="flex flex-col items-center justify-center h-[90vh] w-[100%] bg-cover bg-center"
        style={{ backgroundImage: `url('/background.png')` }}
      >
        <h1 className="text-5xl font-bold">PARKING CLIFT!</h1>
        <div className="flex flex-col-2 h-[80vh] w-[100%] md:w-[80%] transition-all  lg:w-[60%]">
          {id_user == -1 ?
            (
              <aside className="h-[100%] w-[100%] flex flex-col text-center items-center p-10 ">
                {/* Input */}
                <div className=" h-[100%]">



                  <div className="flex flex-col gap-4 mt-4 items-center justify-center h-[50vh] m-10 ">
                    <h3 className="text-2xl font-bold">
                      Ingresa al sistema para ver tus reservas.
                    </h3>

                    <ModalLogin />

                  </div>

                </div>
              </aside>
            ) : (
              tipoUser ?
              (
                <section className="h-[100%] w-[100%] bg-opacity-40 m-10">
                  <div className="flex flex-col gap-4 mt-4 items-center justify-center h-[50vh] m-10 ">
                    <h3 className="text-2xl font-bold">
                      Bienvenido administrador
                    </h3>
                    <Link href="/Admin">
                      <p className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Ir al panel de administrador
                      </p>
                    </Link>
                  </div>
                </section>
              ):

              (<section className="h-[100%] w-[100%] bg-opacity-40 m-10">
                  
                <ListaReservas id={id_user} />
                <div className="w-[100%] flex justify-center my-6">
                  <button onClick={() => setIsOpen(!isOpen)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Reservar
                  </button>
                </div>
                <ModalRegisterCar isOpen={isOpen} onClose={hanldeCloseModal} />

              </section>)
              
            )
          }
        </div>

      </main>
    </div>
  );
}

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Agendador de Horários
          </h1>
          <p className="text-gray-600">
            Gerenciamento de agenda simples e eficiente para o seu negócio
          </p>
        </div>

        <div className="card space-y-4">
          <Link
            href="/login"
            className="btn btn-primary w-full block text-center"
          >
            Login do Negócio
          </Link>

          <div className="text-center text-sm text-gray-500">
            <p>Para clientes: Peça ao negócio o link de agendamento</p>
          </div>
        </div>
      </div>
    </div>
  )
}

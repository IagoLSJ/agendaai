import { Service } from '@/types'

export default function ServiceSelection({
  services,
  onSelect,
}: {
  services: Service[]
  onSelect: (serviceId: string) => void
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Selecione um Serviço
      </h2>

      <div className="space-y-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service.id)}
            className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {service.duration} minutos
                  • {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price || 0)}
                </p>
              </div>
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

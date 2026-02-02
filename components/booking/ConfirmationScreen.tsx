export default function ConfirmationScreen({
  businessName,
  appointmentId,
  onReset,
}: {
  businessName: string
  appointmentId: string
  onReset: () => void
}) {
  return (
    <div className="text-center py-8">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Agendamento Confirmado!
        </h2>
        <p className="text-gray-600">
          Seu agendamento com {businessName} foi marcado
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <p className="text-sm text-gray-600 mb-2">ID de Confirmação</p>
        <p className="font-mono text-xs text-gray-900 break-all">{appointmentId}</p>
      </div>

      <div className="space-y-3 text-sm text-gray-600">
        <p>
          ✓ Você receberá uma mensagem de confirmação no WhatsApp
        </p>
        <p>
          ✓ Por favor, chegue 5 minutos antes do seu horário
        </p>
        <p>
          ✓ Se precisar cancelar ou reagendar, entre em contato com {businessName}
        </p>
      </div>

      <button onClick={onReset} className="btn btn-primary w-full mt-8">
        Marcar Outro Agendamento
      </button>
    </div>
  )
}

import Header from './Header'

/* Página en blanco con un texto centrado.
   Se usa para secciones aún no implementadas (Mi red, Empleos, etc.). */
export default function PlaceholderPage({ icon: Icon, titulo, descripcion }) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-56px)] bg-[#F3F2EF] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg border border-gray-200 max-w-md w-full p-10 text-center">
          {Icon && (
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center">
              <Icon className="w-8 h-8" strokeWidth={1.8} />
            </div>
          )}

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {titulo}
          </h1>

          <p className="text-sm text-gray-600 leading-relaxed">
            {descripcion}
          </p>
        </div>
      </main>
    </>
  )
}

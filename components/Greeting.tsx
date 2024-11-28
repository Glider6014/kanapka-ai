export default function Greeting() {
  return (
    <div className="relative bg-gradient-to-r from-purple-700 to-orange-500 text-white py-32 px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Creating recipes for everyone!
          </h1>
          <p className="text-lg md:text-3xl mb-8">For big or small.</p>
          <form className="flex flex-col md:flex-row gap-4">
            <button className="bg-black font-bold text-white px-6 py-2 rounded-md transition">
              Sign up – it’s free!
            </button>
          </form>
        </div>

        <div className="relative flex justify-center items-center">
          <div className="w-80 h-80 flex justify-center items-center">
            <img
              className="w-80 h-80"
              src="data:image/png;base64,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"
              alt="sandwich"
            />
            ;
          </div>
        </div>
      </div>

      <div className="wave-bottom absolute inset-x-0 bottom-0"></div>
    </div>
  );
}
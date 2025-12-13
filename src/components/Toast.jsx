
function Toast(){
    return(
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium text-white
            ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
          >
            <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
            <span>{toast.message}</span>
            <button
              type="button"
              className="ml-2 text-white/80 hover:text-white"
              onClick={() => setToast(null)}
            >
              ✕
            </button>
          </div>
        </div>
    );

}

export default Toast;
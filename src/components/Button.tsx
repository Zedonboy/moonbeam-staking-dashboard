import { memo } from "react"
function Button(props : any) {
    return (
        <button {...props} className={`bg-accent text-white rounded shadow px-6 py-3 transition-transform scale-100 active:scale-95 active:bg-accent-dark hover:bg-accent-dark`}>
        </button>
    )
}

export default memo(Button)
import type { InputProps } from "../../utils/types/types";

const Input : React.FC<InputProps> = ({label, placeholder, value, type = "text", onChange, icon}) =>{
    return(
        <>
            <div className="mb-6">
                {
                    label && 
                    (
                        <label className="block text-sm font-semibold text-gray-800 mb-1 tracking-wide">{label}</label>
                    )
                }
                <div className="relative group">
                    <input type = {type} 
                    placeholder = {placeholder} 
                    value = {value}
                     onChange = {onChange} 
                    className = 
                    {
                        `w-full py-3 px-4 pr-12 bg-white/70 backdrop-blur-sm border border-red-200
                        focus:border-red-500 focus:ring-2 focus:ring-red-300 transition-all 
                        duration-200 shadow-sm focus:shadow-xl outline-none placeholder-gray-400`
                    }></input>
                    {
                        icon &&
                        (
                            <div className="absolute inset-y-0 right-3 flex items-center text-gray-500 group-focus-within:text-red-500 transition-all duration-300">{icon}</div>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Input;
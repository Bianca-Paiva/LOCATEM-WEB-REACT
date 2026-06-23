import './OrderButton.css';

 export function ButtonOrder({ value, onChange, options }) {
   return (
     <div className="button-order-container">
       <label htmlFor="button-order-select" className="sort-label">
         Ordenar por
       </label>
      
       <select 
         id="button-order"
         className="button-order-box"
         value={value} 
         onChange={(e) => onChange(e.target.value)}
       >
         {options.map((option) => (
           <option key={option.value} value={option.value}>
             {option.label}
           </option>
         ))}
       </select>
     </div>
   );
}
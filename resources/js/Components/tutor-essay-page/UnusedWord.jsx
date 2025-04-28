export default function UnusedWord({number, word}) {
  
  return(
    <li 
      key={number} 
      className="bg-gray-100 text-gray-800 line-through px-2 py-1 text-sm rounded-full "
    >
      {word}
    </li>
  )
}